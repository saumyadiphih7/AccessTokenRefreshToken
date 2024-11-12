const express=require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const path = require('path');
const connectDB = require('./config/db');
const {errorHandler}=require('./middleware/errorHandler')
dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const userRoute = require('./route/userRoute');
const productRoute = require('./route/productRoute');
const adminRoute = require('./route/adminRoute');

app.use('/api/admins', adminRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);



app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});