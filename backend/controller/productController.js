const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");

const productAdd = asyncHandler(async (req, res) => {
  const user = req.user;
  if(user.role!=='admin'){
    res.status(403);
    throw new Error("Not authorized as admin.Cannot add product");
  }
  const { title, price } = req.body;
  
  

  if (!title || !price) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const files = req.files;
   if (!files|| files.length === 0) {
     res.status(400);
     throw new Error("Please add at least one image");
  }
  
   const imagePaths = files.map((file) => file.path);

  const product = await Product.create({
    title,
    price,
    image: imagePaths,
  });

  res.status(201).json({
    "message": "Product created",
     product
  });
});

const productGet = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

const productDelete = asyncHandler(async (req, res) => {
  const user = req.user;
  if(user.role!=='admin'){
    res.status(403);
    throw new Error("Not authorized as admin.Cannot delete product");
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Product.findByIdAndDelete({ _id: req.params.id });

  res.json({ message: "Product removed" });
});

module.exports = { productAdd, productGet, productDelete };