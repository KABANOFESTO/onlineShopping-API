const express= require('express');
const app=express();
const morgan=require('morgan');
const bodyPerser=require('body-parser');
const mongoose=require('mongoose');

const productRoutes=require('./src/routes/product');
const orderRoutes=require('./src/routes/orders');

// mongoose.connect('mongodb+srv://node-shop:'+
//  process.env.MONGO_ATLAS_PW +
//  '1@node-rest-shop.16hmd9j.mongodb.net/',
//  {
 
// })
mongoose.connect('mongodb+srv://node-shop:'+ 
process.env.MONGO_ATLAS_PW +
'@node-rest-shop.16hmd9j.mongodb.net/?retryWrites=true&w=majority')
app.use(morgan('dev'));
app.use(express.static('uploads'));
app.use(bodyPerser.urlencoded({extended: false}));
app.use(bodyPerser.json());
app.use((req,res,next)=>{
    res.header("Acces-Control-Allow-Orgin","*");
    res.header(
        "Access-control-allow-Header",
        "Origin, X-Requested-With, Content-Type,Accept,Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Method', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/product', productRoutes);
app.use('/orders', orderRoutes);

app.use((req,res,next)=>{
    const error=new Error('not found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})

module.exports =app;