require('../db/conn');
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app=express();
dotenv.config();

app.use("/folder",require("../routes/folderRoutes"));
app.use("/document",require("../routes/documentRoutes"));
app.use("/comment",require("../routes/commentRoutes"));
// app.use("/contribution",require("../routes/contributionRoutes"));
app.use("/resource",require("../routes/resourceRoutes"));
app.use("/user",require("../routes/userRoutes"));

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