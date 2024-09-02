const mongoose = require("mongoose");


const ObjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    answers: {
      type: Array,
      default: [], // Default value as an empty array
  },// Use Mixed type for flexible JSON
  });
  


const UserSchema=new mongoose.Schema({
    name: { type: String, required: true},
    username:{type: String, required: true},
    password:{type: String, required: true},
    partner: [ObjectSchema],
})


const UserModel=mongoose.model("users",UserSchema);
module.exports = UserModel