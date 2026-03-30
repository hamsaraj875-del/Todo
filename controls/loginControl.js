//external modules 
const {check,validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.EMAIL_API);


//file modules
const user = require("../Models/User");

// initial display of login page
exports.displayLogin = (req,res,next)=>{
  res.render("login",{error:false});
}

//Sign up handler
exports.displaySignup = (req,res,next)=>{
  res.render("sign",{otp:false,first:true});
}

//Input value checker of signup
exports.signup = [
  check('firstName')
  .notEmpty()
  .withMessage("First name cannot be empty")
  .trim()
  .isLength({min:2})
  .withMessage("First name should be of atleast length 2"),


  check('secondName')
  .trim()
  .notEmpty()
  .withMessage("Second name cannot be empty")
  .isLength({min:2})
  .withMessage("Second name should be of atleast length 2"),


  check('email')
  .isEmail()
  .withMessage("Invalid email")
  .custom(async(value)=>{
    const presence = await user.findOne({email:value});
    if(presence){
      throw new Error("Email id is already in use");
    }
    return true;
  }),

  check('password')
  .isLength({min:8})
  .withMessage("Password must be atleast of length 8character")
  .matches(/[a-z]/)
  .withMessage("Password must contain  a lower case ")
  .matches(/[A-Z]/)
  .withMessage("Password must contain a upper case")
  .matches(/[0-9]/)
  .withMessage("Password must contain a digit")
  .matches(/[^A-Za-z0-9]/)
  .withMessage("Password must contain a special character"),


  check('confirmPassword')
  .custom((value,{req})=>{
    if(value!=req.body.password){
      throw new Error("password do not match");
    }
    return true;
  }),
  check('otpp')
  .notEmpty()
  .withMessage("OTP cannot be empty")
  .custom((value,{req})=>{
    if(!req.session.otp) throw new Error("OTP is not found Try Again ");
    if(value!=req.session.otp) throw new Error("OTP is expired or mismatched");
    return true;
  }),
  (req,res,next)=>{
    const {firstName,secondName,email,password} = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
      return res.status(422).render("sign",{otp:true,error:error.array().map(errors=>errors.msg),oldInput:{firstName,secondName,email,password}});
    }
    bcrypt.hash(req.body.password,15).then((hashPassword)=>{
      const users = new user({firstName,secondName,email,password:hashPassword});
      users.save().then(()=>{
        res.redirect("/login");
      })
    })
  }
]

//Input value Checker of login
exports.login = async (req,res,next)=>{
  try{
    const {email,password} = req.body;
    const detail = await user.findOne({email:email});
    if(!detail){
      req.session.isLoggedIn = false;
      return res.render("login",{error:true,oldInput:{email:email,password:password}});
    }
    bcrypt.compare(req.body.password,detail.password).then((result)=>{
      if(result){
        req.session.regenerate((err)=>{
          req.session.userId = detail._id.toString();
          req.session.isLoggedIn = true;
          req.session.save(()=>{
            res.redirect("/home");
          })
        })
      }
      else{
        res.render("login",{error:true,oldInput:{email:email,password:password}});
      }
    })  
  }catch(err){
    return res.render("login",{error:true,oldInput:{email:email,password:password}});
  }
}

//Function for otp generator
function otpGenerator(){
  return Math.floor(100000+Math.random()*900000);
}

//OTP handler
exports.otp = async (req, res, next) => {

  const otpValue = otpGenerator()
  req.session.otp = otpValue;

  const { email } = req.body;

  try {

    await sgMail.send({
      to: email,
      from: "todo.aim.09@gmail.com", // MUST be verified
      subject: "Your OTP",
      html:`
  <div style="background-color:#f4f4f4; padding:20px;">
    <div>
      <h2 style="text-align:center; color:#333;">🔐 Verify Your Email</h2>
      
      <p style="font-size:16px;">
        Hello,
      </p>
      
      <p style="font-size:16px; color:#555;">
        Use the OTP below to complete your sign up for <b>Todo App</b>:
      </p>
      
      <div style="text-align:center;">
        <span style="font-size:28px; letter-spacing:5px;color:#2c3e50; background:#f1f1f1; padding:10px 20px; border-radius:8px;">
          ${otpValue}
        </span>
      </div>
      
      <p style="font-size:14px; color:#777;">
        ⏳ This OTP is valid for <b>2 minutes</b>.
      </p>
      
      <p style="font-size:14px; color:#777;">
        If you didn’t request this, you can safely ignore this email.
      </p>
      
      <hr style="margin:20px 0;">
      
    </div>
  </div>
`
    });

    console.log("yah its right!");
    return res.render("sign", { otp: true ,first:false,oldInput:req.body});

  } catch (err) {
    err=["Something went wrong"];
    return res.render("sign", { otp: false,wait:false,oldInput:req.body,err });
  }
};


//logout from the account
exports.logout = (req,res,next)=>{
  req.session.destroy((err)=>{
    if(err){
      return res.redirect("/home");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  })
}