const mongoose = require("mongoose");
const express = require("express");
const app  = express();
app.use(express.json());
mongoose.connect("mongodb+srv://verbser:rahul@users.az5y7.mongodb.net/");
const user = mongoose.model("users", {
  name: String,
  email: String,
  password: String,
});
app.post("/signup",async (req,res) => {
const data = req.body;
const userExists = await user.findOne({email : data.email})
if(userExists){
  res.status(400).json({message:" User aldready exists !"})
}
  const User = new user({
    name: data.name,
    email: data.email,
    password: data.password,
  });
  User.save().then(()=>console.log("Data saved in the database :)"));
  res.json({
    message : "User created successfully ! "
  })
})
app.listen(3000,()=>{
  console.log("Server connected at port http://localhost:3000 ");
})
