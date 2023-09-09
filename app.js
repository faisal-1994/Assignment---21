//! Basic Lib Import
const express =require('express');
const path = require('path');
const router =require('./src/routes/api');
const app= new express();
const bodyParser =require('body-parser');
const urlencoded  = require('express');
const dotenv = require("dotenv");
dotenv.config();

//! Database Lib Import
const mongoose =require('mongoose');

//! Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(express.json({limit:"50mb"}));
app.use(urlencoded({limit:"50mb"}));

//! Body Parser Implement
app.use(bodyParser.json());

//! Request Rate Limit
const limiter= rateLimit({windowMs:15*60*1000,max:3000});
app.use(limiter);

//! Connect to  Mongo DB 
let URL = "mongodb+srv://<username>:<password>@cluster0.981m0ts.mongodb.net/Ecom4?retryWrites=true&w=majority"; 
let OPTION = { user: "faisal", pass: process.env.DATABASE_PASSWORD, autoIndex:true };

let connectMongo = mongoose.connect(URL, OPTION );

connectMongo
.then(() => {   
  console.log("Connection Success for Live_Project");
})
 
.catch((error) => {  
  console.log("Failed to connect to the database:", error);
});


//! Managing Back API End Routing
app.use("/api/v1", router);
app.use("*", (req,res) => {
  res.status(401).json({status:"fail", data:"not found"})
})


module.exports=app;