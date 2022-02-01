var mongoose = require('mongoose');

var schema = mongoose.Schema;

var paySchema = new schema({

userid:{
type:mongoose.Types.ObjectId,
required:true
},
useremail:{
type:String
}
,
 amountpaid: {
        type: String,
        required: true,
    },
paytime:{
    type:Date,
    default:Date.now()
}



},{ timestamps: true });
module.exports = mongoose.model('Payment', paySchema);