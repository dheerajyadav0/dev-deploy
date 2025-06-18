// it will define connection b/w 2 users
const mongoose= require("mongoose");
     const connectionrequestSchema= new mongoose.Schema({
          fromuserID:{
             type: mongoose.Schema.Types.ObjectId,
             ref: "User", // reference to the user collection
            required:true,
            },
             
             touserID:{
                type: mongoose.Schema.Types.ObjectId,
                   ref:"User", 
                required:true,
            },
                  status:{
                   type: String,
                   enum:{
                    values:["ignored","interested","accepted","rejected"],
                    message:`{values} is incorrect status`
                   },
                       required:true,

                  },
                  
             },{timestamps:true,}
        );

        //  craeting compound indexex:
        connectionrequestSchema.index({fomuserID:1,touserID:1})

        connectionrequestSchema.pre("save",function(next){
            const connectionrequest= this;
        //   check if the    from user id is ame as  to userid
        if(connectionrequest.fromuserID.equals(connectionrequest.touserID)){
            throw new Error("u cannot send request to urself");
        }
next();
        })
     // creating a model(model ka naam caps mai)
      const ConnectionRequestModel =  new mongoose.model("ConnectionRequest", connectionrequestSchema);
       module.exports=
        ConnectionRequestModel;
       
