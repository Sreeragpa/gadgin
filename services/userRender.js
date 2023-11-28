const axios = require('axios');
const Userdb = require('../models/userModel');
exports.homepage=(req, res) => {

    axios.all([
        axios.get(`http://localhost:${process.env.PORT}/api/products`),
        axios.get(`http://localhost:${process.env.PORT}/api/getcategory`),
     
    ])

    .then(axios.spread((response1,response2)=>{
        res.render("homepage.ejs",{products:response1.data,category:response2.data})
    }))
    .catch((err)=>{
        res.status(500).render('errorpage500.ejs');
    })


 
}
exports.login=(req, res) => {
    res.render("userlogin.ejs")
}
exports.register=(req, res) => {
    if(req.session.error){
        req.session.error=false;
        res.render('emailreg.ejs',{messages:{error:"Email taken"}});
        return;
    }
    res.render("emailreg.ejs")
}
exports.forgotpass=(req, res) => {
    if (req.session.error) {
        req.session.error = false;
        res.render('forgotpass.ejs', { messages: { error: "Email not registered" } });
        return;
    }
    res.render('forgotpass.ejs')
}
exports.logout= (req, res) => {
    const userId = req.session.passport.user;
    // console.log(userId);
    req.session.destroy(async err => {
        if (err) {
            res.send(err);
        } else {
            await Userdb.findByIdAndUpdate({_id:userId},{$set:{status:'inactive'}})
            res.redirect("/login")
        }
    });

}
exports.otpreg=(req, res) => {
    if(req.session.email){
        res.render('otpreg.ejs',{email:req.session.email})
        req.session.destroy();
    }else{
        res.render('errorpage.ejs');
    }
  
    
}

exports.userAccount = async(req,res)=>{
    try {
        const userId = req.session.passport.user;
        if (userId) {
            const user = await Userdb.findById(userId);
            res.render('useraccountpage.ejs', { user: user });
        }else{
            res.redirect('/login')
        }
    } catch (err) {
        res.redirect('/login');
    }
   
   
}