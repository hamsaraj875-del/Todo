//external modules
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");

//Set default engines
app.set('view engine','ejs');
app.set('views','views')

//file modules 
const control = require("../controls/control");
const login = require("./login");
const store = require("../Models/session");

//declaration of path.
const port = process.env.PORT;

//Input file handler
const fileStorage= multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname,'..','uploads'));
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  }
})
const fileFilter= (req,file,cb)=>{
  if(['image/jpg','image/png','image/jpeg'].includes(file.mimetype)){
    cb(null,true);
  }else{
    cb(null,false);
  }
}
app.use("/uploads",express.static(path.join(__dirname,'..','/uploads')));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('photo'));

//reading the input
app.use(express.urlencoded({extended:false}));

//cascading of stylesheet.
app.use(express.static(path.join(__dirname,'../public')));

//Handling Sessions
app.use(session({
  secret:process.env.SECRET_KEY,
  resave:false,
  saveUninitialized:false,
  store:store
}));

//Login Router
app.use(login);

//Deleting the cache memory of browser to prevent from the browser undo button
app.use((req,res,next)=>{
  res.set("Cache-Control","no-store");
  next();
}); 

//checking is the user is logged or not
app.use((req,res,next)=>{
  if(req.session.isLoggedIn){
    next();
  }else{
    res.redirect("/login");
  }
});

//server handling.
app.get("/",control.redirector);
app.get("/home",control.homePage);
app.post("/home",control.homePage);
app.get("/add",control.addToHomePage);
app.post("/save",control.displayData);
app.get("/deleteAll",control.deleteAll);
app.get("/delete/:id",control.delete);
app.get("/edit/:id",control.edit);
app.post("/replace/:id",control.replace);
app.get("/account",control.accountDisplay);

//last listening of server
const db = process.env.DB;

mongoose.connect(db).then(()=>{
  console.log("Both mongoose and database is conneceted successfully");
  app.listen(port,()=>{
    console.log(`Server is running in http://localhost:${port}`);
  });
});