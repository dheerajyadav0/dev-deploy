 const User= require('../models/user')
const jwt =  require("jsonwebtoken")
const userAuth = async( req, res, next)=>{
    //  read the cookies from req cookie
   try{const cookie= req.cookies;
  const  {token}= cookie;
  if(!token){
    return res.status(401).send("please login");
  }
  const decodedobj= await jwt.verify(token,process.env.JWT_secret )
const {id}= decodedobj;
 const user= await User.findById(id);
  if(!user){
    throw new Error("user not found");

 }
 req.user=user;
 next();}   catch(err){
    res.status(400).send(err.message);
 }

 }
 module.exports={
    userAuth,
 }