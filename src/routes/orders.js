const express=require('express');
const router=express.Router();

// const mongoose=require('mongoose');
// const Order = require('../models/orders');
// const Product=require('../models/product');
// const product = require('../models/product');
// const checkAuth=require('../middleware/auth');
const auth = require('../middleware/auth');
const OrdersController=require('../controllers/orders');


router.post('/',auth,OrdersController.orders_create_order);

router.get('/',auth,OrdersController.orders_get_all);

router.get('/:id',auth,OrdersController.order_get_order);

// router.patch('/:id',auth,(req,res,next)=>{
// })

router.delete('/:id',auth,OrdersController.order_delete_order);

module.exports=router;