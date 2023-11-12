const passport = require('../configs/passport-config')
const otpCtrl = require('../controllers/otpCtrl')
function CheckAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
// function checkOtp(req,res,next){
//     if(otpCtrl.otp)
// }

module.exports={CheckAuthenticated}