var express = require('express');
var router = express.Router();
var Buyer=require('../models/buyerM')
var configurer=require('../config')
const client = require('twilio')(configurer.accountSID, configurer.authToken);
const auth=require('../middlewares/auth')
const buyerController=require('../controllers/buyerC')
const Ad=require('../models/addsM')
var Message=require('../models/messages');
const reviewM = require('../models/reviewM');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'hello' });
});
router.get('/sendotp',function(req,res,next){
if(Buyer.findOne({phonenumber:"+"+req.params.phonenumber})){
    res.json({msg:"Phone number already exists"})
}

    client
    .verify
    .services(configurer.serviceID)
    .verifications
    .create({
        to: `+${req.query.phonenumber}`,
        channel: req.query.channel 
    })
    .then(data => {
        res.status(200).send(data)
    })

})
router.post('/signup',function(req,res,next){

  client
  .verify
  .services(configurer.serviceID)
  .verificationChecks
  .create(
    {
      to:`+${req.query.phonenumber}`,
      code:req.query.code
    }
  )
  .then(data => {
      if(Buyer.findOne({email:req.params.email})){
          res.json({msg:"Email already exists"});
      }
    Buyer.create(req.body)
    .then((teacher) => {
        console.log('user is authenticated');
        console.log('User has been Added and authenticated', teacher);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(teacher);
    }, (err) => next(err))
    .catch((err) => next(err));

}) 



    // Buyer.create(req.body)
    // .then((teacher) => {
    //     console.log('User has been Added ', teacher);
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(teacher);
    // }, (err) => next(err))
    // .catch((err) => next(err));

})
router.get('/gettoken',function(req,res,next){
  
  res.statusCode=200;
res.json({accessToken:process.env.accessToken})

  
})
router.get('/userinfo',auth,async(req,res,next)=>{
  try{
const buyer=await Buyer.findById(req.header('id')).select('-password')
res.json(buyer)
  }
  catch(err){
    console.log(err.message)
    return res.status(500).json({msg:err.message})
  }
})

router.patch('/updateprofile',auth,async(req,res,next)=>{
  console.log(req.body)
  await Buyer.findOneAndUpdate({id:req.header('id')},req.body);
res.json({msg:"Profile Updated"})
});
router.patch('/updatepassword',auth,async(req,res,next)=>{
  try{
  console.log(req.body)
  const buyer=await Buyer.findById(req.header('id'));
  if(req.body.oldpassword==buyer.password){
    await Buyer.findOneAndUpdate({_id:req.header('id')},{password:req.body.newpassword});
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

router.get('/ad/:adid',auth,async(req,res,next)=>{
try{
  const ad=await Ad.findOne({_id:req.params.adid})
    res.status(202).json(ad);
}
catch(err){
  return res.status(500).json({msg:err.message}) 
}




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
//get by title
router.get('/ad/title/:tname',auth,async(req,res,next)=>{

  try{
    const ad=await Ad.findOne({title:req.params.tname})
    res.status(202).json(ad);
    }
    catch(err){
      console.log(err.message)
          return res.status(500).json({msg:err.message}) 
    }

})









})
router.post('/contactmessage',auth,async(req,res,next)=>{

  try{

    const {adid,sellerid,buyerid,sendername,messbody}=req.body;

    const contactmess= new Message({adid,sellerid,buyerid,sendername,messbody});
    await contactmess.save();
    res.json({msg:"Contact Message sent"})
  }

  catch(err){
    return res.status(500).json({msg:err.message}) 
  }

})


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
  const chats=await Message.find({buyerid:req.header('id')});
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



router.post('/review/ad/:adid',auth,async(req,res,next)=>{

try{
const review=await reviewM.create({name:req.body.name,adid:req.params.adid, reviewbody:req.body.reviewbody,rating:req.params.rating})
res.json({msg:"Review Posted"})
}
catch(err){
  return res.status(500).json({msg:err.message})

}

  })
  


















module.exports = router;
