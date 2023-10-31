const express=require('express');
const router=express.Router();

const mongoose=require('mongoose');
const Order = require('../models/orders');
const Product=require('../models/product');
const product = require('../models/product');
const checkAuth=require('../middleware/auth');


router.post('/',(req,res,next)=>{
    Product.findById(req.body.id)
    .then(product=>{
        if(!product){
            res.status(404).json({
                message:'product not found'
            })
        }
        const order= new Order({
            _id:new mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.id
        });
       return order.save()
    })
        .then(result=>{
            console.log(result);
            res.status(201).json({
                message:'storing data successfull',
                createdOrder:{
                    _id:result._id,
                    product:result.product,
                    quantity:result.quantity
                },
                request:{
                    type:'POST',
                    url:'http://localhost:3000/orders'+result._id,
                    body:{id:"ID",quantity:"Number"}
                }
            })
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                errror:err
            })
        });

});

router.get('/',(req,res,next)=>{
    Order.find()
    .select('_id product quantity')
    .populate('product','name')
    .exec()
    .then(docs=>{
        if(!docs){
            return res.status(404).json({
                message:'no orders found in DB'
            })
        }
        res.status(200).json({
            count:docs.length,
            orders:docs.map(doc=>{
                return{
                    _id: doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders/'+ doc._id
                        }
                }
            })
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            Error:err
        })
    })
});

router.get('/:id',(req,res,next)=>{
    const id=req.params.id
    Order.findById(id)
    .select('_id product quantity')
    .populate('product')
    .exec()
    .then(doc=>{
        console.log(doc)
       if(doc){
        res.status(200).json({
            order:doc,
            request:{
                type:'GET',
                url:'http://localhost:3000/orders/'+doc.id
            }
        })
       }
       else{
        res.status(404).json({
            message:'invalid id'
        })
       }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
});
router.patch('/:id',(req,res,next)=>{

})

router.delete('/:id',(req,res,next)=>{
    Order.findByIdAndRemove(_id=req.params.id)
    .exec()
    .then(result=>{
        if(result){
            res.status(200).json({
               message:'well deleted',
               request:{
                type:"POST",
                url:"http://localhost:3000//product",
                body:{}
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
            error:err
        })
    })
});

module.exports=router;