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