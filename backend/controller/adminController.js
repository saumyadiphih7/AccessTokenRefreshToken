const Admin = require("../model/adminModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {generateAccessToken,generateRefreshToken}=require("./userController");
const { log } = require("node:console");

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.status(400);
    throw new Error("admin not found");
  }

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      accesstoken: generateAccessToken(admin, admin.role),
      refreshToken: generateRefreshToken(admin, admin.role),
    });
  } else {
    res.status(403);
    throw new Error("Invalid credentials");
  }
});

// const adminProfile = asyncHandler(async (req, res) => { 
//   console.log("ademin")
// })


const getAdminProfile = asyncHandler(async (req, res) => {
  console.log("req.user",req.user)
  const admin = req.user;
  console.log("admin",admin)
  if (!admin) {
    console.log("admin not found");
    res.status(401);
    throw new Error("Admin not found");
  }

  res.status(200).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });
});

// const generateAccessToken = (admin, role) => {
//   return jwt.sign(
//     {
//       id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: "2m",
//     }
//   );
// };

// const generateRefreshToken = (admin, role) => {
//   return jwt.sign(
//     {
//       id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: "5m",
//     }
//   );
// };

module.exports = {
  registerAdmin,
  loginAdmin,
// adminProfile
  getAdminProfile,
};
