import React from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * InvoiceTemplate - Redesigned as a Formal "TAX INVOICE" 
 * Following standard industrial formatting for tax compliance.
 */
export const InvoiceTemplate = ({ order, user }) => {
    // Standard Tax Calculation (Assuming 18% GST included in price for illustration)
    const shippingFee = 150;
    const subtotal = (order.totalAmount - shippingFee) / 1.18;
    const gstTotal = subtotal * 0.18;
    const cgst = gstTotal / 2;
    const sgst = gstTotal / 2;

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div
            id="invoice-capture-area"
            className="w-[210mm] min-h-[297mm] bg-white text-slate-800 font-sans flex flex-col"
            style={{ boxSizing: 'border-box' }}
        >
            {/* 1. Official Header */}
            <div className="p-12 border-b-4 border-orange-500 bg-[#FFF7ED]">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">WALLPAPER</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">The Art Gallery Collection</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">TAX INVOICE</h2>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mt-1 italic">Original for Recipient</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 text-[11px]">
                    <div className="space-y-1">
                        <p className="font-black text-slate-400 uppercase tracking-widest text-[9px]">Sold By:</p>
                        <p className="font-black text-slate-900 uppercase">Wallpaper Interiors Pvt. Ltd.</p>
                        <p className="font-medium text-slate-500">102-105, Creative Plaza, Art District, Surat - 395007</p>
                        <p className="font-medium text-slate-500 italic">GSTIN: 24AAACW1234A1Z5 | PAN: AAACW1234A</p>
                    </div>
                    <div className="text-right space-y-2">
                        <div>
                            <span className="font-black text-slate-400 uppercase tracking-widest text-[9px] mr-2">Invoice No:</span>
                            <span className="font-black text-slate-900 italic">WP-INV-{order._id?.slice(-8).toUpperCase()}</span>
                        </div>
                        <div>
                            <span className="font-black text-slate-400 uppercase tracking-widest text-[9px] mr-2">Invoice Date:</span>
                            <span className="font-black text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div>
                            <span className="font-black text-slate-400 uppercase tracking-widest text-[9px] mr-2">Place of Supply:</span>
                            <span className="font-black text-slate-900 uppercase italic">Gujarat (24)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Logistics & Delivery */}
            <div className="p-12 grid grid-cols-2 gap-16 border-b border-slate-100">
                <div className="space-y-4">
                    <h6 className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">Bill To:</h6>
                    <div className="space-y-1">
                        <p className="text-xl font-black text-slate-900 italic uppercase tracking-tight">{order.shippingAddress?.fullName || user?.fullName}</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            {order.shippingAddress?.addressLine},<br />
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        </p>
                        <p className="text-xs font-bold text-slate-800 pt-1">Phone: {order.shippingAddress?.mobileNo}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Payment Information:</h6>
                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                        <div>
                            <p className="font-black text-slate-400 uppercase tracking-widest text-[8px] mb-1">Method</p>
                            <p className="font-bold text-slate-900 italic uppercase">Digital Payment</p>
                        </div>
                        <div>
                            <p className="font-black text-slate-400 uppercase tracking-widest text-[8px] mb-1">Status</p>
                            <p className="font-black text-emerald-600 uppercase italic tracking-widest">SUCCESSFUL</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Items with HSN/SAC */}
            <div className="flex-grow p-12">
                <table className="w-full text-[11px] border-collapse">
                    <thead>
                        <tr className="bg-slate-900 text-white border-b-2 border-orange-500">
                            <th className="py-4 px-4 font-black uppercase tracking-widest text-left w-12">Sl. No</th>
                            <th className="py-4 px-4 font-black uppercase tracking-widest text-left">Product Specification</th>
                            <th className="py-4 px-4 font-black uppercase tracking-widest text-center italic">HSN</th>
                            <th className="py-4 px-4 font-black uppercase tracking-widest text-center">Qty</th>
                            <th className="py-4 px-4 font-black uppercase tracking-widest text-right">Rate</th>
                            <th className="py-4 px-4 font-black uppercase tracking-widest text-right">Taxable Value</th>
                        </tr>
                    </thead>
                    <tbody className="font-medium text-slate-600">
                        {order.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-50">
                                <td className="py-6 px-4 font-bold text-slate-300">{(idx + 1).toString().padStart(2, '0')}</td>
                                <td className="py-6 px-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-10 bg-slate-50 rounded border border-slate-100 overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                                                className="w-full h-full object-cover grayscale opacity-80"
                                                alt=""
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase italic tracking-tight text-xs">{item.titleName}</p>
                                            <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">{item.paperMaterial?.paperType || 'Archival Quality'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-4 text-center font-bold text-slate-400">4911</td>
                                <td className="py-6 px-4 text-center font-black text-slate-900">x{item.quantity}</td>
                                <td className="py-6 px-4 text-right">{formatPrice(item.price / item.quantity)}</td>
                                <td className="py-6 px-4 text-right font-black text-slate-900 italic">{formatPrice(item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 4. Tax Breakdown & Totals */}
            <div className="p-12 bg-slate-50 border-t border-slate-200">
                <div className="flex justify-between gap-10">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h6 className="text-[9px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2">Declaration</h6>
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
                                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                                This is a computer generated invoice and does not require a physical signature.
                            </p>
                        </div>
                    </div>
                    <div className="w-[300px] space-y-3">
                        <div className="flex justify-between text-[11px]">
                            <span className="font-bold text-slate-400 uppercase tracking-widest italic">Taxable Amount</span>
                            <span className="font-black text-slate-900 italic">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                            <span className="font-bold text-slate-400 uppercase tracking-widest italic">CGST (9%)</span>
                            <span className="font-black text-slate-900 italic">{formatPrice(cgst)}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                            <span className="font-bold text-slate-400 uppercase tracking-widest italic">SGST (9%)</span>
                            <span className="font-black text-slate-900 italic">{formatPrice(sgst)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] pt-2 border-t border-slate-200">
                            <span className="font-bold text-slate-400 uppercase tracking-widest italic">Logistics Fee</span>
                            <span className="font-black text-orange-600 italic">{formatPrice(shippingFee)}</span>
                        </div>

                        <div className="mt-6 bg-slate-900 p-6 rounded-xl text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-full bg-orange-500 opacity-10 -skew-x-12 translate-x-12"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-40">Invoice Total</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black tracking-tighter italic tabular-nums whitespace-nowrap">{formatPrice(order.totalAmount)}</span>
                                    <span className="text-xs font-bold opacity-30 tracking-widest">INR</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Minimal Formal Footer */}
            <div className="p-12 pt-0 pb-12 flex justify-between items-center text-[8px] font-black text-slate-300 uppercase tracking-[0.5em] italic">
                <span>E. & O.E.</span>
                <span>WP-INV-{order._id?.toUpperCase()}</span>
            </div>
        </div>
    );
};

/**
 * generateInvoice - Functional utility to render the PDF
 */
export const generateInvoice = async (order, user) => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '210mm';
    document.body.appendChild(container);

    const root = createRoot(container);

    try {
        root.render(<InvoiceTemplate order={order} user={user} />);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const canvas = await html2canvas(container.children[0], {
            scale: 2.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            onclone: (clonedDoc) => {
                const captured = clonedDoc.getElementById('invoice-capture-area');
                if (captured) captured.style.position = 'static';
            }
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

        pdf.save(`Wallpaper_Tax_Invoice_${order._id?.slice(-8).toUpperCase()}.pdf`);
        return true;
    } catch (error) {
        console.error('Invoice Generation Error:', error);
        throw error;
    } finally {
        setTimeout(() => {
            root.unmount();
            document.body.removeChild(container);
        }, 500);
    }
};
