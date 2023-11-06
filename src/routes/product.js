
const express=require('express');

const router=express.Router();

// const mongoose=require('mongoose');

const multer=require('multer');

// const Product=require('../models/product');

const app= require('../../app');

const product = require('../models/product');

const auth = require('../middleware/auth');

const ProductsController=require('../controllers/product');

const storage=multer.diskStorage({
destination:function(req,file,cb) {
    cb(null,'./upload/')
},
filename:function(req,file,cb){
    cb(null, new Date().toDateString() + file.originalname);
}
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype==='image/jpg'|| file.mimetype==='image/png'){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
    
};
const upload=multer({storage:storage,
limits:{
    fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter
});


router.get('/',ProductsController.products_get_allProducts);

router.post('/', auth, upload.single('productImage'),ProductsController.product_create_product);

router.get('/:id',auth,ProductsController.product_create_product);

router.patch('/:id',auth,ProductsController.product_update_product);

router.delete('/:id',auth,ProductsController.product_delete_product);

module.exports=router;