var mongoose = require('mongoose');

var schema = mongoose.Schema;

var buyerSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    aboutme:{
        type:String
    },
    profileimg:{
        type:String,
        default:"https://ajsywunmvq.cloudimg.io/v7/sample.li/boat.jpg?w=500&wat=1"
    },
    address:{
        type:String
    },
    location:{
        type:String
    },
    role:{
        type:Number,
        required:true
    }
    



},{ timestamps: true });
module.exports = mongoose.model('Buyer', buyerSchema);