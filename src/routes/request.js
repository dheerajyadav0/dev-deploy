 const express= require("express");
const { userAuth } = require("../middleware/auth");
 const  requestRouter= express.Router();
const User = require("../models/user");
 const connectionRequest=  require("../models/connectionrequest")

const sendEmail = require("../utils/sendEmail");
 requestRouter.post("/request/send/:status/:touserID",
  userAuth,
  async(req,res)=>{
  try{
 const fromuserID= req.user._id;
const touserID= req.params.touserID;
const status= req.params.status;
const allowedstatus = ["ignored","interested"];
 if( !allowedstatus.includes(status)){
   return res.status(400).json({message:"Invalid status"});
 }
 


//  checking if to user exist or not
 const touser= await User.findById(touserID);
  if(!touser){
    return res.status(404).send("message:User not found");
  }
 
//  if there is an exixting connection req
 const  existingconnectionreq= await connectionRequest.findOne({
  $or:[
     { fromuserID,touserID},
     { fromuserID:touserID,touserID:fromuserID },
     
  ] });
    if(existingconnectionreq) // is ki value null honi chhciye
    {
      return res.status(400).send({message:"connection request already exist"});
    }


//  saving the conection req or create an instance of the model
const connectionrequest= new connectionRequest({
     fromuserID,
     touserID,
     status});
     // saving the instance
      const data= await connectionrequest.save();

      
      const action = status === "interested" ? "interested in" : "not interested in";
const message = `${req.user.firstName} is ${action} ${touser.firstName}`;
res.json({ message,
   data });

 } catch(err){
    res.status(400).send("Error:"+err.message)
  }
})
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionrequest = await connectionRequest.findOne({
        _id: requestId,
        touserID: loggedInUser._id,
        status: "interested",
      });
      if (!connectionrequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionrequest.status = status;

      const data = await connectionrequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

  module.exports= requestRouter;

