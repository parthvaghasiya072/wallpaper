const axios = require('axios');

class ShiprocketService {
    constructor() {
        this.email = process.env.SHIPROCKET_EMAIL;
        this.password = process.env.SHIPROCKET_PASSWORD || process.env.SHIPROCKET_PASS;
        this.baseUrl = process.env.SHIPROCKET_URL || 'https://apiv2.shiprocket.in/v1/external';
    }

    async createCustomOrder(order, user) {
        try {
            const token = await this.getAuthToken();
            if (!token) return { success: false, message: "Authentication failed with Shiprocket" };

            // Format items for Shiprocket
            const orderItems = order.items.map(item => ({
                name: item.titleName || 'Wallpaper Product',
                sku: item.productId.toString(),
                units: item.quantity,
                selling_price: item.price,
                discount: 0,
                tax: 0,
                hsn: 48149000 // general paper/wallpaper HSN
            }));

            // Extract first and last name from fullName
            const nameParts = order.shippingAddress.fullName.split(' ');
            const firstName = nameParts[0] || 'Customer';
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Name';

            // Generate payload (with Fallback "Primary" pickup location)
            const payload = {
                order_id: (order.originalOrderId || order._id).toString(),
                order_date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                pickup_location: "Primary", // Important: Admin MUST have built a location named exactly 'Primary' in Shiprocket dashboard
                channel_id: "",
                comment: `Order ID: ${order._id}`,
                billing_customer_name: firstName,
                billing_last_name: lastName,
                billing_address: order.shippingAddress.addressLine,
                billing_city: order.shippingAddress.city,
                billing_pincode: order.shippingAddress.pincode,
                billing_state: order.shippingAddress.state,
                billing_country: order.shippingAddress.country || "India",
                billing_email: user.email || this.email,
                billing_phone: order.shippingAddress.mobileNo,
                shipping_is_billing: true,
                order_items: orderItems,
                payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
                sub_total: order.totalAmount,
                length: 10, breadth: 10, height: 10, weight: 1 // Default metrics
            };

            const response = await axios.post(`${this.baseUrl}/orders/create/ad-hoc`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data.order_id) {
                const shiprocketOrderId = response.data.order_id;
                const shipmentId = response.data.shipment_id;

                let awbCode = null;
                try {
                    // Try to auto-generate AWB immediately
                    const awbResponse = await axios.post(`${this.baseUrl}/courier/assign/awb`, {
                        shipment_id: shipmentId
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (awbResponse.data?.response?.data?.awb_code) {
                        awbCode = awbResponse.data.response.data.awb_code;
                    }
                } catch (awbErr) {
                    console.log("Shiprocket Info: Could not auto-assign AWB instantly. Courier assignment may be manual.", awbErr.response?.data?.message || awbErr.message);
                }

                return { success: true, shiprocketOrderId: shiprocketOrderId.toString(), shiprocketAWB: awbCode };
            }
            return { success: false, message: "Could not create order on Shiprocket" };
        } catch (error) {
            console.error("Shiprocket Create Order Error:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to create order" };
        }
    }

    async getAuthToken() {
        try {
            if (!this.email || !this.password) {
                console.error("Shiprocket credentials are not provided in .env");
                return null;
            }

            const response = await axios.post(`${this.baseUrl}/auth/login`, {
                email: this.email,
                password: this.password
            });

            return response.data.token;
        } catch (error) {
            console.error("Shiprocket Auth Error:", error.response?.data || error.message);
            return null;
        }
    }

    async trackOrder(awbCode) {
        try {
            // MOCK RESPONSE FOR TESTING DUMMY AWB FRONTEND VISUALS
            if (awbCode === '14101913101') {
                return {
                    success: true,
                    data: {
                        tracking_data: {
                            track_status: 1,
                            shipment_status: 3,
                            shipment_track: [{
                                current_status: 'Delivered',
                                awb_code: awbCode,
                                courier_name: 'Mock Carrier Demo',
                                expected_date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
                            }],
                            shipment_track_activities: [
                                { status: 'Delivered', location: 'Customer Location', date: 'Today, 10:00 AM' },
                                { status: 'Out for Delivery', location: 'Local Distribution Center', date: 'Today, 07:30 AM' },
                                { status: 'Shipped', location: 'Warehouse', date: 'Yesterday, 04:15 PM' }
                            ]
                        }
                    }
                };
            }

            const token = await this.getAuthToken();
            if (!token) return { success: false, message: "Authentication failed with Shiprocket" };

            const response = await axios.get(`${this.baseUrl}/courier/track/awb/${awbCode}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return { success: true, data: response.data };
        } catch (error) {
            console.error("Shiprocket Tracking Error:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to track order" };
        }
    }

    async trackByOrderId(orderId) {
        try {
            // MOCK RESPONSE FOR TESTING DUMMY ORDER ID FRONTEND VISUALS
            if (orderId === '1256747') {
                return {
                    success: true,
                    data: {
                        tracking_data: {
                            track_status: 1,
                            shipment_status: 3,
                            shipment_track: [{
                                current_status: 'Delivered',
                                awb_code: '14101913101',
                                courier_name: 'Mock Carrier Demo',
                                expected_date: new Date(Date.now() + 86400000).toISOString().split('T')[0]
                            }],
                            shipment_track_activities: [
                                { status: 'Delivered', location: 'Customer Location', date: 'Today, 10:00 AM' },
                                { status: 'Out for Delivery', location: 'Local Distribution Center', date: 'Today, 07:30 AM' },
                                { status: 'Shipped', location: 'Warehouse', date: 'Yesterday, 04:15 PM' }
                            ]
                        }
                    }
                };
            }

            const token = await this.getAuthToken();
            if (!token) return { success: false, message: "Authentication failed with Shiprocket" };

            const response = await axios.get(`${this.baseUrl}/courier/track?order_id=${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Shiprocket returns nested data for order tracking (where the key is the order ID)
            // e.g. { "ORDER_ID": { "tracking_data": { "shipment_track": [...] } } }
            // We'll normalize it so the frontend can read it just like AWB tracking response
            let normalizedData = response.data;
            if (response.data && response.data[orderId]) {
                normalizedData = response.data[orderId];
            } else if (response.data && response.data.tracking_data && response.data.tracking_data[orderId]) {
                normalizedData = response.data.tracking_data[orderId];
            }

            return { success: true, data: normalizedData };
        } catch (error) {
            console.error("Shiprocket Tracking Error:", error.response?.data || error.message);
            return { success: false, message: error.response?.data?.message || "Failed to track order" };
        }
    }
}

module.exports = new ShiprocketService();
