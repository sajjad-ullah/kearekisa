const Buyer=require('../models/buyerM');
module.exports.updateProfile=async(req,res,next)=>{
try{
await Buyer.findByIdAndUpdate(req.id,req.body);
res.json({msg:"Profile Updated"})


}

catch(err){
    console.log(err.message)
    return res.status(500).json({msg:err.message})
}

}
