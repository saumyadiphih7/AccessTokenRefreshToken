const express=require('express');
const { verifyToken, verifyAdminRole } = require("../middleware/authMiddleware")
const {
  productAdd,
  productGet,
  productDelete
} = require("../controller/productController");

const productRoute = express.Router();

const { configureUploader } = require("../config/dynamicFileUploader");

const productImageUpload=configureUploader({
  allowedFormats:["jpg", "png", "jpeg"],
  fileSize: 1 * 1024 * 1024,
  folder:"product-Image"
})

productRoute.post(
  "/add",
  verifyToken,
  verifyAdminRole,
  productImageUpload.array("image",2),
  productAdd
);
productRoute.get("/get", productGet)
productRoute.delete("/delete/:id", verifyToken, productDelete)

module.exports = productRoute