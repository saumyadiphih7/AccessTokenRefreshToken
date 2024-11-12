const express = require("express")
const {verifyToken,verifyUserRole}=require("../middleware/authMiddleware")

const {
  registerUser,
  loginUser,
  RefreshTokenUser,
  getProfile
} = require("../controller/userController");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/token", RefreshTokenUser);

router.get("/profile", verifyToken, verifyUserRole,getProfile);
module.exports = router