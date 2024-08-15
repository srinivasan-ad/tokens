const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const express = require("express");
const app = express();
app.use(express.json());
mongoose.connect("mongodb+srv://verbser:rahul@users.az5y7.mongodb.net/");
const user = mongoose.model("users", {
  name: String,
  email: String,
  password: String,
});
const jwtKey = "1234";
app.post("/signup", async (req, res) => {
  const data = req.body;
  try{
  const userExists = await user.findOne({ email: data.email });
  if (userExists) {
    res.status(400).json({ message: " User aldready exists !" });
  }
  const User = new user({
    name: data.name,
    email: data.email,
    password: data.password,
  });
 await User.save()
 console.log("Data saved in the database :)");
  const token  = jwt.sign({name : User.name},jwtKey,{expiresIn : '5m'}) ;
//   For user info ->
//   For client side use localStorage.setItem(token);
// Need to create a refresh token seperately since access token expires every 5 minutes
  res.json({
    message: "User created successfully with token -> ",
    token,
  });}
  catch(err){
    console.error(err)
  }
});
app.get("/verify",async(req,res) => {
//For user info ->
// Use in client const tokenCheck = localStorage.getItem(token)
try{
const tokenCheck  = req.headers.authorization;
// For user info ->
// Here regular expression is used to remove the quotes from the token string , 
// / is the delimitter used to indicate the start and end of the regx(short form for regular expression),
// " here is used as the patten to find , if you want to replace for single and double quotes use an array as of patterns [' "],
// g is the global flag that tells the replace function to not stop after a single occurence rather check the entire string for the pattern .

const cleanedToken = tokenCheck.replace(/"/g, '');
const verifiying = jwt.verify(cleanedToken,jwtKey)
const verified = await user.findOne({name : verifiying.name})
if(!verified){
    res.status(401).json({
        message : "User not verified",
    })
}
res.json({
    message : `USER with name ${verified.name} is VERIFIED `,
})}
catch(err){
    console.error(err);
}
})
app.listen(3000, () => {
  console.log("Server connected at port http://localhost:3000 ");
});
