const route = require('express').Router();
const userCtrl=require('../controllers/userCtrl')
const otpCtrl=require('../controllers/otpCtrl')
const session = require('express-session')
const {CheckAuthenticated,CheckNotauthenticated} = require('../middlewares/authMiddleware')
route.get('/',CheckAuthenticated,(req,res)=>{
    res.render("homepage.ejs")
    
})
route.get('/login',CheckNotauthenticated,(req,res)=>{
  
    res.render("userlogin.ejs")
})
route.get('/register',CheckNotauthenticated,(req,res)=>{
    res.render("emailreg.ejs")
})
route.get('/forgotpass',(req,res)=>{
    res.render('forgotpass.ejs')
})
route.post('/logout',(req,res)=>{
    // console.log(req.session);
    userId=req.session.passport;
        req.session.destroy(err=>{
        if(err){
            res.send(err);
        }else{
            res.redirect("/login")
        }
    });
    
})

route.post('/api/update',userCtrl.updatepass)
route.post('/api/register',userCtrl.create)
route.post('/api/getotp',otpCtrl.getOtp)
route.post('/api/checkotp',otpCtrl.checkOtp)
module.exports = route;
