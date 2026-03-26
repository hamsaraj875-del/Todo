//External modules
const express = require("express");
const login = express.Router();

//local modules
const loginControl = require("../controls/loginControl");

//server handler
login.get("/login",loginControl.displayLogin);
login.post("/login",loginControl.login);
login.get("/sign",loginControl.displaySignup);
login.post("/sign",loginControl.signup);
login.get("/logout",loginControl.logout);
login.post("/OTP",loginControl.otp);

module.exports = login;