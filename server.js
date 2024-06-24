const express = require('express');
const bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./module/todo.js'); // Correctly import the User model
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken');



const JWT_SECRET="Jbsfsasdfghjkl";
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/User", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

// // Fallback to index.html for single-page applications
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});
app.use(express.static(path.join(__dirname, 'public')));

app.post("/register", async (req, res) => {
  
    const { fname, lname, email, password } = req.body;
    console.log(req.body); // Log the received data
    const encrypted=await bcrypt.hash(password,10);

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send({ status: "errorr", message: "User already exists" });
             console.log("User already exists");
            // return;
        }
        else{
        const newUser = new User({
            fname,
            lname,
            email,
            password:encrypted,
        });

        await newUser.save();
        res.send({ status: "ok" });
       }
    } catch (error) {
        console.error("Error during registration", error); // Log the error
        res.send({ status: "error", message: "Registration failed", error });
    }
});
app.post("/login", async (req, res) => {
    const {  email, password } = req.body;
    const user=await User.findOne({ email });
            if(!user) {
            return res.send({ status: "errorr", message: "User not exists" });
        }
        if(await bcrypt.compare(password,user.password)){
            // const token=jwt.sign({},JWT_SECRET);
            const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '60s' });

            if(res.status(201)){
                return res.json({status:"ok", data:token});
            }else{
                return res.json({error:"error"});
            }
        }
        res.send({ status: "error2", message: "Invalid Password" });
        

});

app.post("/userdetails", async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userEmail = decoded.email;
        const user = await User.findOne({ email: userEmail });

        if (user) {
            res.send({ status: "ok", data: user });
        } else {
            res.send({ status: "error", message: "User not found" });
        }
    } catch (error) {
        res.send({ status: "error1", message: "Invalid Token", error });
    }
});
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const olduser=await User.findOne({email});
        if(!olduser)
             return res.send({ status: "error", message:"user doesnot exit" });

          const secret=JWT_SECRET+olduser.password;
         const token=jwt.sign({email:olduser.email,id:olduser.id},secret,{expiresIn:'5m'});
        const link=`http://localhost:3000/reset-password/${olduser._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "ankitad67890@gmail.com",
              pass: "ieis qtmi hbwc cxza",
            },
          });
      
          var mailOptions = {
            from: "youremail@gmail.com",
            to: email,
            subject: "Password Reset",
            text: link,
          };
      
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              return res.json({ status: "error1", message: "Failed to send email" });
            } else {
              return res.json({ status: "success", message: "Reset link sent" });
              console.log("Email sent: " + info.response);
            }
            

          });
        } catch (error) {
          return res.json({ status: "error1", message: "Failed to send email" });
        }
      });

app.get("/reset-password/:id/:token",async(req,res)=>{
    const{id,token}=req.params;
    console.log(req.params);
   // res.send("done");
    const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
     return res.json({ status: "User Not Exists!!" });
  }
      const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    //res.sendFile(path.join(__dirname, 'public', 'reset_password.html'));
    //res.send({ status: "ok", message: " Verified" });
     res.render("reset_password", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.render("reset_password", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  });
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
