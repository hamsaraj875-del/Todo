const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todoName:{type:String,required:true},
  date:{type:String,required:true},
  time:{type:String,required:true},
  description:{type:String,required:true},
  fileName:{type:String},
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("todoList", todoSchema,"todoList");