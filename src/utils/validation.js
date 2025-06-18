
const validator = require('validator');
const validatesignupdata= (req)=>{
    const {firstName,lastName,emailId,password}= req.body;
     if(!firstName|| !lastName){
        throw new Error("enter a valid name");
     }
  else if (!validator.isEmail(emailId)){
    throw new Error("email id is required or invalid")
  }
 else if(!validator.isStrongPassword(password)){
    throw new Error("password should be strong");
 }
 };
 const validate_edit_profile_data=(req)=>{
const allowed_edit_fields=[
"firstName", "lastName","skills",
"location","experienceLevel","about",
"photoUrl","age","gender",
"lookingFor",
];
 const is_edit_allowed=Object.keys(req.body).every((fields)=> 
    allowed_edit_fields.includes(fields));
   return is_edit_allowed;
}

module.exports = {
    validatesignupdata,
    validate_edit_profile_data,
};