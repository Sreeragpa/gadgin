const route = require('express').Router();
const userCtrl=require('../controllers/userCtrl')
const otpCtrl=require('../controllers/otpCtrl')
const {CheckAuthenticated} = require('../middlewares/authMiddleware')
route.get('/',CheckAuthenticated,(req,res)=>{
    res.send("Homepage")
})
route.get('/login',(req,res)=>{
    res.render("userlogin.ejs")
})
route.get('/register',(req,res)=>{
    res.render("emailreg.ejs")
})

route.post('/api/register',userCtrl.create)
route.post('/api/getotp',otpCtrl.getOtp)
route.post('/api/checkotp',otpCtrl.checkOtp)
module.exports = route;