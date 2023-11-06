const express=require('express');
const router=express.Router();
// const mongoose=require('mongoose');
// const User=require('../models/user');
// const bcrypt=require('bcrypt');
// const jwt=require('jsonwebtoken');
const auth=require('../middleware/auth');
const UsersController=require('../controllers/user');

router.post('/signUp',UsersController.user_signup);

router.post('/login',UsersController.user_login);

router.delete('/:userId',auth);

router.get('/',auth,UsersController.get_users);

module.exports=router;