const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')


const verifyToken=asyncHandler(async(req,res,next)=>{
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try{
      token=req.headers.authorization.split(' ')[1]
      const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      req.user=decoded
      next()
    }catch(error){
      res.status(401)
      throw new Error('Not authorized')
    }
  }
  if(!token){
    res.status(401)
    throw new Error('Not authorized,no token')
  }
})

const verifyUserRole=asyncHandler(async(req,res,next)=>{
  if(req.user.role!=='user'){
    res.status(403)
    throw new Error('Not authorized as person is not user')
  }
  next()
})

const verifyAdminRole=asyncHandler(async(req,res,next)=>{
  if(req.user.role!=='admin'){
    res.status(403)
    throw new Error('Not authorized as person is not admin')
  }
  next()
})



// const verifyAdminToken = asyncHandler(async (req, res, next) => {
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//       console.log("decoded", decoded);
//       req.user = decoded;
//       next();
//     } catch (error) {
//       res.status(401);
//       throw new Error("Not authorized");
//     }
//   }
//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized,no token");
//   }
// });

module.exports={verifyToken,verifyUserRole,verifyAdminRole}

