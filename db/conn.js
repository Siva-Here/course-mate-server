require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB not connected...', err);
  });
