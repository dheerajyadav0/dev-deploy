const express = require ("express");
const  validator= require("validator");
//craeting an instance off express js application
require("dotenv").config();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app= express();
const { Error } = require("mongoose");


const allowedOrigins = [
  "http://localhost:5173",
  "https://devconnect-frontened.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("🚀 DevConnect backend is up and running!");
});

 
//   importing all the routes here
 const authRouter= require("./routes/auth");
 const profileRouter= require("./routes/profile");
 const requestRouter= require("./routes/request");
const userRouter = require("./routes/user");
 // usig these routes
 app.use("/",authRouter);
 app.use("/",profileRouter);
 app.use("/",requestRouter);
 app.use("/",userRouter);
  

connectDB().then(()=>{
   console.log("database connection established");
   app.listen(3000 ,()=>{
      console.log("listening on port");
   });

}).catch(err =>{
  console.error("database connection error");
})


 //listening on a port
 //test deploy
