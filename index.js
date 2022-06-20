const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require("./routes/cart")
const orderRoute= require("./routes/order")

//dotenv config
dotenv.config();

//Mongoose conection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Db Conection Successfull!'))
  .catch(err => console.log(err));

//Enable json incoming
app.use(express.json());

//Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);

//listen
app.listen(process.env.PORT || 5000, () => {
  console.log('Backend server is running!');
});
