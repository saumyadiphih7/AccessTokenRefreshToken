const User = require("../model/userModel");
const Admin = require("../model/adminModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { log } = require("console");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password ,role} = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role:user.role
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }


  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role:user.role,
      accesstoken: generateAccessToken(user,user.role),
      refreshToken: generateRefreshToken(user,user.role),
    });
  } else {
    res.status(403);
    throw new Error("Invalid credentials");
  }
});

// const RefreshTokenUser = asyncHandler(async (req, res) => {
  
//   const { refreshToken } = req.body;
//   if (!refreshToken) {
//     res.status(401);
//     throw new Error("No refresh token");
//   }
  
// if (refreshToken) {
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
//     if (err) {
//       res.status(401);
//       throw new Error("Invalid refresh token. Please log in again.");
//     }
//     if (decoded) {
//       const user=await User.findById(decoded.id)
//       const accessToken = generateAccessToken(user);
//       res.json({ message: "Token refreshed", accessToken });
//     }
//   });
// } else {
//   res.status(401);
//   throw new Error("No refresh token found. Please provide a refresh token.");
// }

// });


// const RefreshTokenUser = asyncHandler(async (req, res) => {
//   const { refreshToken } = req.body;

//   // Check if refresh token is provided
//   if (!refreshToken) {
//     res.status(401);
//     throw new Error("No refresh token");
//   }

//   try {
//     // Verify the refresh token
//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

//     // Find the user by ID decoded from the token
//     const user = await User.findById(decoded.id);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found. Please log in again." });
//     }

//     // Generate a new access token
//     const accessToken = generateAccessToken(user);
//     return res.json({ message: "Token refreshed", accessToken });
//   } catch (err) {
//     // Handle specific token errors
//     if (err.name === "TokenExpiredError") {
//       return res
//         .status(401)
//         .json({ message: "Refresh token expired. Please log in again." });
//     }
//     return res
//       .status(401)
//       .json({ message: "Invalid refresh token. Please log in again." });
//   }
// });


const RefreshTokenUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

   console.log(refreshToken)
  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "No refresh token provided. Please log in again." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    console.log(decoded)
    let user;
    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id);
    } else if (decoded.role === "user") {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please log in again." });
    }

    const accessToken = generateAccessToken(user, decoded.role);
    return res.json({ message: "Token refreshed", accessToken });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Refresh token expired. Please log in again." });
    }
    return res
      .status(401)
      .json({ message: "Invalid refresh token. Please log in again." });
  }
});


const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
 
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
 
});


const generateAccessToken = (user, role) => {
  console.log(user,role)
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2m",
    }
  );
};

const generateRefreshToken = (user, role) => {
   console.log("refreshToken")
    console.log(user, role);
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "5m",
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  RefreshTokenUser,
  getProfile,
  generateAccessToken,
  generateRefreshToken
   
};
