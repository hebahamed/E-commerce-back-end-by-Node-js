const mongoose = require('mongoose');

let connectionurl = 'mongodb+srv://heba:mlab123456@cluster0-jmyhm.mongodb.net/ecommerce?retryWrites=true';

// let connectionurl = 'mongodb://localhost:27017/ecommerceData'

mongoose.connect(connectionurl, 
{ useNewUrlParser: true, useCreateIndex: true });
