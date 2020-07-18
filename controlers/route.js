const express = require('express');
const router = express.Router();




router.get('/',(req,res)=>{
    res.render('index',{text:'Relaxation and Comfort',company:'Xpress Dreams Technology',pass:'hello' });
});
router.get('/about',(req, res)=>{
    res.render('about');
});
router.get('/contact',(req, res)=>{
    res.render('contact');
});
router.get('/service',(req, res)=>{
    res.render('service');
});
router.get('/register',(req,res)=>{
    res.render('register')
});
router.get('/login',(req,res)=>{
    res.render('login')
});
router.get('/admin',(req, res,err)=>{
    // if(res.status !== 200)return res.render('error');
    res.render('adminlogin')
});


module.exports = router;