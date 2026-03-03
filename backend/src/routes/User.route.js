const express = require("express");
const router = express.Router();

const { createUser, loginUser } = require("../controllers/authController");
const { createAddress, getAllAddress, getSingleAddress, updateAddress, deleteAddress } = require("../controllers/addressController");
// const { getAllProducts } = require("../controllers/productController");

router.post("/register", createUser);
router.post("/login", loginUser);

// Address routes
router.post("/createAddress", createAddress);
router.get("/getAllAddress", getAllAddress);
router.get("/getSingleAddressById/:id", getSingleAddress);
router.put("/updateAddressById/:id", updateAddress);
router.delete("/deleteAddressById/:id", deleteAddress);


module.exports = router;
