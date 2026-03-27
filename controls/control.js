//external modules
const mongoose = require("mongoose");
const path = require("path");

//local file module
const database = require("../Models/Database");
const User = require("../Models/User");
const fs = require("fs");

//home page display
exports.homePage=(req,res,next)=>{
  if(req.session.isLoggedIn==true){
    database.find({userId:new mongoose.Types.ObjectId(req.session.userId)}).then((todoDetails)=>{
    res.render("home",{todoDetails,page:"home"});
  })
  }else{
    res.redirect("/login");
  }
}

//redirector to the home page 
exports.redirector = (req,res,nect)=>{
  res.redirect("/home");
}

//add Page display
exports.addToHomePage=(req,res,next)=>{
  res.render("add",{page:"add",edit:false});
}

//Saving the given data
exports.displayData=(req,res,next)=>{
  const {todoName,time,date,description} = req.body;
  let fileName;
  if(req.file){
    fileName = req.file.originalname;
  }
  else{
    fileName = "false";
  }
  const Details = new database({todoName,date,time,description,fileName,userId:req.session.userId,});
  Details.save().then(()=>{
    req.session.isLoggedIn = true;
    res.redirect("/home");
  });
}

//Deleting all the details.
exports.deleteAll=(req,res,next)=>{
  database.deleteMany({}).then((err)=>{
    if(err){
      res.redirect("/home");
    }
    database.find().then((todoDetails),(err)=>{
      if(err){
        res.redirect("/home");
      }
      res.render("home",{todoDetails,page:"home"});
    })
  })
}

//deleting of individual boxes 
exports.delete=(req,res,next)=>{
  const base = req.params.id;
  database.findByIdAndDelete(base).then((err)=>{
    if(err){
      res.redirect("/home");
    }
    database.find().then(()=>{
      res.status(302);
      res.redirect("/home");
    })
  })
}

//editing of individual boxes
exports.edit=(req,res,next)=>{
  const base = req.params.id;
  database.findById(base).then((todoDetails),(err)=>{
    if(err){
      res.redirect("/home");
    }
    let edit=true;
    res.render("add",{todoDetails,page:"add",edit});
  })
}

//replacing the data in database
exports.replace=(req,res,next)=>{
  const base = req.params.id;
  console.log(base);
  const {todoName,date,time,description} = req.body;
  database.findById(base).then((list)=>{
    console.log(list);
    if(!list){
      return res.redirect("/home");
    }
    else{
      list.todoName = todoName;
      list.date = date;
      list.time = time;
      list.description = description;
      if(req.file){
        fs.unlink(path.join(__dirname,"..","uploads",list.fileName),(err)=>{
          if(err){
            console.log('you got the error while deleting the previous file');
            return res.redirect("/home");
          }
        })
        list.fileName=req.file.originalname;
      }
      list.save().then(()=>res.redirect("/home"))
      .catch(err=>res.redirect("/add"));
    }
  })
}

// display the account details
exports.accountDisplay=async(req,res,next)=>{
  const accountDetails = await User.findOne({_id:new mongoose.Types.ObjectId(req.session.userId)});
  const list = await database.find({userId:req.session.userId})
  res.render("account",{accountDetails,list,page:"nothing"});
}
