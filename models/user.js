// const regex = new Regex( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
// const Regex = require('regex');
// const validator = require('validator');
require('mongoose-type-email');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secretKey = 'mySecretKey';
// const promisify = require('promisify');
// const sign = promisify.sign(jwt) 
// const verfiy = promisify.verfiy(jwt);
////////////////////////////////////////////////////////////////////////////////////////////////

const sign = (...args) => {
    return new Promise((resolve, reject) => {
      jwt.sign(...args, (err, result) => {
        if(err) return reject(err);
        resolve(result);
      });
    });
  };
  
  
  const verify = (...args) => {
    return new Promise((resolve, reject) => {
      jwt.verify(...args, (err, result) => {
        if(err) return reject(err);
        resolve(result);
      });
    });
  }


const schema = new mongoose.Schema({

    userName:{
        type:String,
        required:true,
        
        
    },
    email:{
        type: mongoose.SchemaTypes.Email ,
        required:true,
        unique:true,
   
    },
    password:{
        type:String,
        required:true
    },
    products:{
        type:Array
    }
    
},{
    toJSON: {
      hide: 'password',
      transform: true,
    },
    autoIndex: true
})

// this function to hidden password
schema.options.toJSON.transform = function (doc, ret, options) {
    if (options.hide) {
      options.hide.split(' ').forEach((prop) => { delete ret[prop]; });
    }
    return ret;
  }

//hashing password by bcrypt package
const hashPassword = password => bcrypt.hash(password, saltRounds);

//when save do hashing password
schema.pre('save', async function(){
  const user = this;
  if(user.isNew || user.modifiedPaths().includes('password')){
    user.password = await hashPassword(user.password)
  }
});

//this  verify function to compare passwords when user do login
schema.method('verifyPassword',function(comparedPassword){
    return bcrypt.compare(comparedPassword , this.password);
})

//this is generate token function use when match user when login
schema.method('generateToken',async function(){
    const user =this;
    const token = await sign({ _id: user.id },secretKey, { expiresIn: '5m' })
    return token;
})

//this is Decode Token function use when authentication 
schema.static('decodeToken',function(token){
    return verify(token,secretKey);
})
const User = mongoose.model('User',schema);

module.exports = User;