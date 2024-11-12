const express=require('express');
const { verifyToken } = require("../middleware/authMiddleware")
const {
  productAdd,
  productGet,
  productDelete
} = require("../controller/productController");

const productRoute = express.Router();

productRoute.post("/add", verifyToken, productAdd)
productRoute.get("/get", productGet)
productRoute.delete("/delete/:id", verifyToken, productDelete)

module.exports = productRoute