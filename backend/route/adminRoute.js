const express = require('express');
const { verifyToken, verifyAdminRole } = require("../middleware/authMiddleware")
const {
  registerAdmin,
  loginAdmin,
  
  getAdminProfile,
  // adminProfile
} = require("../controller/adminController");

const { RefreshTokenUser }=require("../controller/userController")

const adminRoute = express.Router();

adminRoute.post("/register", registerAdmin);
adminRoute.post("/login", loginAdmin);
adminRoute.post("/token", RefreshTokenUser);
// adminRoute.get("/profile",adminProfile)

adminRoute.get("/profile", verifyToken,verifyAdminRole, getAdminProfile);


module.exports = adminRoute