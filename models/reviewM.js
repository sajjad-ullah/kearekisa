var mongoose = require('mongoose');

var schema = mongoose.Schema;

var reviewSchema = new schema({
    name:{
type:String
    },
  adid:{
      type:mongoose.Types.ObjectId
  }
  ,
  reviewbody:{
      type:String
  },
  rating:{
      type:String
  }

},{ timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);