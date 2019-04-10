const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user');
const Product = require('../models/product');
const authenticationMiddleware = require('../middlewares/authentication');



//Registet For User

router.post('/',(req,res,next)=>{
  const {userName , email , password } = req.body;
  const user = new User({userName , email , password });
  user.save((err)=>{
    if(err) return next(createError(400, err));
    debugger;
    res.send(user);
  });
})

// Get ALL USERS

router.get('/',(req,res,next)=>{
  User.find({}, function (err, users) {
    if(err) return next(createError(400,err));
    res.send(users);
});
})

// Get All Products From One User

router.get('/:userId',(req,res,next)=>{
  Product.find({userId:req.params.userId},function (err, products) {
      if(err) return next(createError(400,err));
      res.send(products);
  });
})


//LOGIN USER (Authentication and Autherization)

router.post('/login',async (req,res,next)=>{

  const{ userName,password } = req.body;
  if(!userName|| !password) return next(createError(400,'Missing Data'));
  const user = await User.findOne({userName});
  if(!user) return next(createError(401));
  const isMatch = await user.verifyPassword(password).catch(console.error);
  if(!isMatch) return next(createError(401));
  const token = await user.generateToken();
  res.send({token , user});
})

//middleware
router.use(authenticationMiddleware);

// protected end point
router.get('/profile', (req, res, next)=>{
  res.send(req.user);
});




module.exports = router;
