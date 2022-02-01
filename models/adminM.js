var mongoose = require('mongoose');

var schema = mongoose.Schema;

var adminSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true
    },
    profileimg:{
        type:String,
        default:"https://ajsywunmvq.cloudimg.io/v7/sample.li/boat.jpg?w=500&wat=1"
    }
});
module.exports = mongoose.model('Admin', adminSchema);