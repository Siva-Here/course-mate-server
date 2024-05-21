const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require('../db/conn');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());


const start = async () => {
  try {
    app.listen(process.env.PORT, () => { 
      console.log(`Server Running successfully on ${process.env.PORT}`); 
    });
  } catch (err) {
    console.log(err); 
  }
};

start();
mongoose
  .connect("mongodb://localhost/coursemate", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
