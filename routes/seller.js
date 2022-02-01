
var express = require('express');
var router = express.Router();
var Seller=require('../models/sellerM')
var configurer=require('../config')
const client = require('twilio')(configurer.accountSID, configurer.authToken);
const auth=require('../middlewares/auth')
const sellerController=require('../controllers/sellerC')
const Ad=require('../models/addsM')
const Message=require('../models/messages')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'hello' });
});
// router.get('/sendotp',function(req,res,next){
// if(Buyer.findOne({phonenumber:"+"+req.params.phonenumber})){
//     res.json({msg:"Phone number already exists"})
// }

//     client
//     .verify
//     .services(configurer.serviceID)
//     .verifications
//     .create({
//         to: `+${req.query.phonenumber}`,
//         channel: req.query.channel 
//     })
//     .then(data => {
//         res.status(200).send(data)
//     })

// })
// router.post('/signup',function(req,res,next){

//   client
//   .verify
//   .services(configurer.serviceID)
//   .verificationChecks
//   .create(
//     {
//       to:`+${req.query.phonenumber}`,
//       code:req.query.code
//     }
//   )
//   .then(data => {
//       if(Buyer.findOne({email:req.params.email})){
//           res.json({msg:"Email already exists"});
//       }
//     Buyer.create(req.body)
//     .then((teacher) => {
//         console.log('user is authenticated');
//         console.log('User has been Added and authenticated', teacher);
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(teacher);
//     }, (err) => next(err))
//     .catch((err) => next(err));

// }) 



//     // Buyer.create(req.body)
//     // .then((teacher) => {
//     //     console.log('User has been Added ', teacher);
//     //     res.statusCode = 200;
//     //     res.setHeader('Content-Type', 'application/json');
//     //     res.json(teacher);
//     // }, (err) => next(err))
//     // .catch((err) => next(err));

// })
// router.get('/gettoken',function(req,res,next){
  
//   res.statusCode=200;
// res.json({accessToken:process.env.accessToken})

  
// })
// router.get('/userinfo',auth,async(req,res,next)=>{
//   try{
// const buyer=await Buyer.findById(req.header('id')).select('-password')
// res.json(buyer)
//   }
//   catch(err){
//     console.log(err.message)
//     return res.status(500).json({msg:err.message})
//   }
// })





router.get('/userinfo',auth,async(req,res,next)=>{
  try{
const seller=await Seller.findById(req.header('id')).select('-password')
res.json(seller)
  }
  catch(err){
    console.log(err.message)
    return res.status(500).json({msg:err.message})
  }
})

router.patch('/updateprofile',auth,async(req,res,next)=>{
  console.log(req.body)
  await Buyer.findOneAndUpdate({_id:req.header('id')},req.body);
res.json({msg:"Profile Updated"})
});

router.patch('/updatepassword',auth,async(req,res,next)=>{
  try{
  console.log(req.body)
  const seller=await Seller.findById(req.header('id'));
  if(req.body.oldpassword==seller.password){
    await Seller.findOneAndUpdate({_id:req.header('id')},{password:req.body.newpassword});
    res.json({msg:"Password Updated"})
  }
  else{
    res.status(404).json({msg:"old password is incorrect"})
  }

}
catch(err){
  console.log(err.message)
  return res.status(500).json({msg:err.message}) 
}
});






router.patch('/updateprofile',auth,async(req,res,next)=>{
  console.log(req.body)
  await Seller.findOneAndUpdate({_id:req.header('id')},req.body);
res.json({msg:"Profile Updated"})
});

router.post('/ad',auth,async (req,res,next)=>{

try{
const newadd=await Ad.create(req.body);
res.json({msg:"Ad is posted"})

}
catch(err){
  console.log(err.message)
  return res.status(500).json({msg:err.message}) 
}

})
router.patch('/ad/:adid',auth,async (req,res,next)=>{

  try{
  const newadd=await Ad.findOneAndUpdate({_id:req.params.adid},req.body);
  res.json({msg:"Ad is updated"})
  
  }
  catch(err){
    console.log(err.message)
    return res.status(500).json({msg:err.message}) 
  }
  
  })
  //set premium for ad
  router.patch('/setpremium/:adid',auth,async (req,res,next)=>{

    try{
    const newadd=await Ad.findOneAndUpdate({_id:req.params.adid},req.body);
    res.json({msg:"Ad is in premium category now"})
    
    }
    catch(err){
      console.log(err.message)
      return res.status(500).json({msg:err.message}) 
    }
    
    })
router.delete('/ad/:adid',auth,async (req,res,next)=>{


try{
await Ad.deleteOne({_id:req.params.adid})
res.status(202).json({msg:"Ad is deleted"})
}
catch(err){
  console.log(err.message)
      return res.status(500).json({msg:err.message}) 
}

})
//get specific add posted by me
router.get('/ad/:adid',auth,async(req,res,next)=>{

  try{
    const ad=await Ad.findOne({_id:req.params.adid})
    res.status(202).json(ad);
    }
    catch(err){
      console.log(err.message)
          return res.status(500).json({msg:err.message}) 
    }

})




//get by category
router.get('/ad/category/:catname',auth,async(req,res,next)=>{

  try{
    const ad=await Ad.findOne({category:req.params.catname})
    res.status(202).json(ad);
    }
    catch(err){
      console.log(err.message)
          return res.status(500).json({msg:err.message}) 
    }

})


//get all adds posted by me
router.get('/ad/useradd/:sid',auth,async(req,res,next)=>{

  try{
    const ad=await Ad.find({sellerid:req.params.sid})
    res.status(202).json(ad);
    }
    catch(err){
      console.log(err.message)
          return res.status(500).json({msg:err.message}) 
    }


})
//send reply to buyer

router.patch('/sendreply',auth,async(req,res,next)=>{
try{
  await Message.findOneAndUpdate({ _id: req.body.cid }, {
    "$push": {
        "replies": {
            "sendid": req.body.sendid,
            "sendname":req.body.sendname,
            "messtext":req.body.messtext
        }
    }
})
res.json({msg:"Reply posted"})
}
catch(err){
  return res.status(500).json({msg:err.message})
}

})
//Get All Chats
router.get('/getchats',auth,async(req,res,next)=>{
const chats=await Message.find({sellerid:req.header('id')});
res.json({chats})
try{

}
catch(err){
  return res.status(500).json({msg:err.message})
}


})

//Get Specific Chat

router.get('/getchat/:cid',auth,async(req,res,next)=>{
  const chats=await Message.findOne({_id:req.params.cid});
  res.json({chats})
  try{
  
  }
  catch(err){
    return res.status(500).json({msg:err.message})
  }
  
  
  })





module.exports = router;
