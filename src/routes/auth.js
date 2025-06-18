const express= require("express");
const validator = require("validator");

const authRouter= express.Router();
const { validatesignupdata } = require("../utils/validation");
const User = require("../models/user");
const bcrypt= require("bcrypt");
const {userAuth} = require("../middleware/auth");
 const jwt= require("jsonwebtoken");
  authRouter.post("/signup", async (req,res) => {
 
try{
     // validation of data
  validatesignupdata(req);
 // encrypt the password
 const {password,firstName,lastName,emailId}= req.body;
 const passwordHash =  await bcrypt.hash(password,10);

   //creating a nwe instance of the user model
   const user = new User({firstName,lastName,emailId, password:passwordHash});
     const saveduser=await user.save();
     // create jwt token
 const token = await saveduser.getJWT();

//  add token to ccokie and send back to user
res.cookie("token", token,{expires:new Date(Date.now()+8*3600000)})

    res.json({message:"User registered successfully",data:saveduser});
   }
   catch(err){
     res.status(400).send("ERROR:"+err.message);
   }
 })
 authRouter.post("/login",async(req,res)=>{
  try{
    const { emailId, password}= req.body;
     if(!validator.isEmail(emailId)){
      throw new Error("enter a valid id");
     }
     const user= await User.findOne({emailId:emailId});
     if(!user){
      throw new Error("invalid credentials");
     }
 const isPasswordValid=  await user.validatepassword(password);
 if(isPasswordValid){
//  yha pr cookie wala logic lagega
// create jwt token
 const token = await user.getJWT();

//  add token to ccokie and send back to user
res.cookie("token", token,{expires:new Date(Date.now()+8*3600000)})
res.send("login successfull");
 }
 else{
  throw new Error("invald credentials");
 }
  }
  catch(err){
    res.status(400).send("ERROR:"+err.message);
  }
  
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    }) ;
    res.send("logout successfully");
})

 module.exports = authRouter;