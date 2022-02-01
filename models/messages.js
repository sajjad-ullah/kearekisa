var mongoose = require('mongoose');

var schema = mongoose.Schema;

var messageSchema = new schema({

sendername:{
    type:String,required:true
},
senderemail:{
    type:String
},
messbody:{
type:String,
required:true
}



},{ timestamps: true });
module.exports = mongoose.model('Message', messageSchema);