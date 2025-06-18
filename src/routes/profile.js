 const express= require("express");
const  {userAuth} = require("../middleware/auth");
 const profileRouter= express.Router();
 const {validate_edit_profile_data}= require("../utils/validation");

profileRouter.get("/profile/view", userAuth,async(req,res)=>{
 try{
   const user= req.user;
  res.send(user);
 } 
 catch(err){
  res.status(400).send("ERROR:"+err.message);
 }

})
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{ if(!validate_edit_profile_data(req)){
         throw new Error("invalid edit request")
}
    const loggedinuser= req.user;
     Object.keys(req.body).forEach((key)=>(loggedinuser[key]= req.body[key]));
    //  save the data
     await loggedinuser.save();
    
     res.json({
      message: `${loggedinuser.firstName}, your profile updated successfuly`,
      data: loggedinuser,
    });
    

}
 catch(err){res.status(400).send("error:"+ err.message);
    }

})

 module.exports= profileRouter; 
 