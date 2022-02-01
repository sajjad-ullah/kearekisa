require('dotenv').config({path:`./configure.env`});
const stripe=require('stripe')('sk_test_51KLspRC6Tyt0CL0k0dGLHnEyoc9XUs6zNJxcgTG7fpfxfNLZIreZSeMOFINTrQkdAmQSrqPS9k1hlP1Mf8Qkw50X00Rn26TY16');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var buyerRouter=require('./routes/buyer')
var sellerRouter=require('./routes/seller');
var adminRouter=require('./routes/admin');
var mongoose=require('mongoose');
var auth=require('./middlewares/auth');
var User=require('./models/userM')
var Ad=require('./models/addsM');
var Payment=require('./models/payments')
var Admin=require('./models/adminM');
var adminauth=require('./middlewares/adminauth');


const hbs = require("hbs");









// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}







var app = express();

// view engine setup
// app.engine('hbs',hbs({extname:'hbs', defaultLayout:'main', layoutsDir:__dirname+'/views/layouts/'}))
// app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mongoose.connect('mongodb+srv://danish:9188412286@cluster0.ccn2q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

connection.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/users/updateprofileimage',auth, (req, res,next)=> {
  upload(req, res, (err) => {
    if(err){
      res.json( {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.json({
          msg: 'Error: No File Selected!'
        });
      } else {

User.findOneAndUpdate({_id:req.header('id')},{profileimg:`uploads/${req.file.filename}`},(err,results)=>{
if(err){
  next(err)
}

  res.json({
    msg: 'File Uploaded!',
    filepath: `uploads/${req.file.filename}`
  });
})


        
      }
    }
  });
});




app.post('/users/ad/:adid/addimage',auth, (req, res,next)=> {
  upload(req, res, (err) => {
    if(err){
      res.json( {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.json({
          msg: 'Error: No File Selected!'
        });
      } else {

Ad.findOneAndUpdate({_id:req.params.adid},



{
  "$push": {
      "otherimages": {
          "imgpath": `uploads/${req.file.filename}`
      }
  }
}, { new: true, upsert: false }






,(err,results)=>{
if(err){
  next(err)
}

  res.json({
    msg: 'File Uploaded!',
    filepath: `uploads/${req.file.filename}`
  });
})


        
      }
    }
  });
});



//Charge Route
app.post('/users/charge',(req,res,next)=>{
  const amount=2500;
  console.log(req.body);
  stripe.customers.create({
    email:req.body.stripeEmail,
    source:req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,description:'Request for premium',
    currency:'usd',
    customer:customer.id
  }))
  .then(charge =>{
User.findOne({email:req.body.stripeEmail})
.then((useres)=>{

  Payment.create({userid:useres._id,useremail:req.body.stripeEmail,amountpaid:'25$'})
  .then((payme) => {
      console.log('Payment has been Added ', payme);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(payme);
  }, (err) => next(err))
  .catch((err) => next(err));


}, (err) => next(err))
.catch((err) => next(err));



   
  })
})








app.post('/admin/updateprofileimage',adminauth, (req, res,next)=> {
  upload(req, res, (err) => {
    if(err){
      res.json( {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.json({
          msg: 'Error: No File Selected!'
        });
      } else {

Admin.findOneAndUpdate({_id:req.header('id')},{profileimg:`uploads/${req.file.filename}`},(err,results)=>{
if(err){
  next(err)
}

  res.json({
    msg: 'File Uploaded!',
    filepath: `uploads/${req.file.filename}`
  });
})


        
      }
    }
  });
});







app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/buyer',buyerRouter)
app.use('/seller',sellerRouter)
app.use('/admin',adminRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
