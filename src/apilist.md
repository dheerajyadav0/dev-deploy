list of apis
-auth router
POST/ sign up
POST/ login
POST/logout

-profile router
GET/profile/view
GET/profile/edit
PATCH/profile/password

-connection request router
<!--  POST/request/send/:status/:userid-->
POST/request/send/interested/:userid
post /request/send/ignored/:userid
<!--  POST/request/send/:status/:userid-->
post/request/review/accepted/:reqid
post/request/review/rejected/:reqid
status: ignored , intersted, accepted, reject

 -user router
GET/user/connections
GET/user/request/recieved
GET/user/feed- gets u the profile of other users on the platform



