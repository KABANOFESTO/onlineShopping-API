
const express=require('express');

const router=express.Router();

const mongoose=require('mongoose');

const multer=require('multer');
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

const Product=require('../models/product');
const app= require('../../app');
const product = require('../models/product');

router.get('/',(req,res,next)=>{
Product.find()
.select('name price _id productImage')
.exec()
.then(docs=>{
    const response={
      count:docs.length,
      product:docs.map(doc=>{
        return{
            name:doc.name,
            price:doc.price,
            productImage:doc.productImage,
            _id:doc._id,
            request:{
                type:"GET",
                url:"http://localhost:3000/product/" + doc._id
            }
        }
      }
      )

    }
    // if(docs.length>=0){
        res.status(200).json(response)
})
.catch(err=>{
    console.log(err)
    res.status(500).json({
        Error:err
    })
})
});
router.post('/',upload.single('productImage'),(req,res,next)=>{
    const product= new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    });
    product.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message:'product created well',
            createProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:"GET",
                 url:"http://localhost:3000/product/" + result._id
                }
            }
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            Error:err
        })
    });
});

router.get('/:id',(req,res,next)=>{
    const id=req.params.id;
    Product.findById(id)
    .select('name price productImage _id')
    .exec()
    .then(doc =>{
        console.log("From the database",doc);
        if(doc){
            res.status(200).json({
                product:doc,
                request:{
                    type:"GET",
                    url:"http://localhost:3000/product/"
                }
            });
        }
        else{
            res.status(404).json({
                message:'you are searching invalid id'
            });
        }
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({Error:err});
    })
});

router.patch('/:id',(req,res,next)=>{
    const id =req.params.id;
    const updateOpr={};
    for(const opr of req.body){
        updateOpr[opr.propName]=opr.value;
    }
    Product.findByIdAndUpdate({_id: id},{$set:updateOpr})
    .exec()
    .then(result=>{
       
        res.status(200).json({
            message:'product well updated',
            request:{
                type:'GET',
                ulr:"http://localhost:3000/product/"+ id
            }
        })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            Error:err
        })
    })
});

router.delete('/:id',(req,res,next)=>{
   const id=req.params.id;
   Product.findByIdAndRemove({_id: id})
   .exec()
   .then(result=>{
    if(result){
        res.status(200).json({
           message:'well deleted',
           request:{
            type:"POST",
            url:"http://localhost:3000//product",
            body:{name:'String',price:'Number'}
           } 
        })
    }
    else{
        res.status(404).json({
            message:'unexisting id'
        })
    }
   })
   .catch(err=>{
    console.log(err)
    res.status(500).json({
        Error:err
    })
   })
});

module.exports=router;