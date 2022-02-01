var mongoose = require('mongoose');

var schema = mongoose.Schema;

var adSchema = new schema({

sellerid:{
type:mongoose.Types.ObjectId,
required:true,
ref:'Seller'
},
sellername:{
type:String
}

,


    title: {
        type: String,
        required: true,
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        required:true
    },
    
    mainimg:{
        type:String,
        default:"https://ajsywunmvq.cloudimg.io/v7/sample.li/boat.jpg?w=500&wat=1"
    },
    otherimages: {
        type: [{
            imgpath: {
                type: String,
                
            }
        }]
    },
    address:{
        type:String
    },
    location:{
        type:String
    },
    phonenumber:{
        type:String
    },
    premium:{
    type:Boolean,
    default:false
    },
    description:{
        type:String,
        required:true
    }



},{ timestamps: true });
module.exports = mongoose.model('Ad', adSchema);