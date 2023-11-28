const session  = require('express-session');
const axios = require('axios')
exports.loginpage = (req,res)=>{
    res.render('adminlogin.ejs')
}
exports.admindash = (req,res)=>{
    res.render('admindash.ejs')
}

exports.loginvalidate = (req,res)=>{
    const admincred = {
        email:"admin@gmail.com",
        password:"123"
    }

    if(req.body.email==admincred.email && req.body.password==admincred.password){
        req.session.isAdminLogged = true;
        res.redirect("/admin");
        // res.send("Logged in")
    }else{
        res.render("adminlogin.ejs",{messages:{error:"Invalid Credentials"}})
    }
}
exports.logout = (req,res)=>{
    req.session.destroy(err => {
        if (err) {
            res.send(err);
        } else {
            res.redirect("/admin/login")
        }
    });

}

exports.usermgmt = (req,res)=>{
    axios.get(`http://localhost:3001/api/getusers`)
        .then((response)=>{
            res.render('adminusermgmt.ejs',{users:response.data})
        })
        .catch((err)=>{
            res.send("Usermgmt error")
        })
    
}


