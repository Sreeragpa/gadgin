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

    function checkAdminCredentials(email, password) {
        return email === admincred.email && password === admincred.password;
    }
    const isMatch = checkAdminCredentials(req.body.email,req.body.password)

    if(isMatch){
        req.session.isAdminLogged = true;
        res.redirect("/admin");
    }else if(req.body.password!=admincred.password && req.body.email==admincred.email){
        res.render("adminlogin.ejs",{messages:{passerror:"Invalid Password"}})
    }else{
        res.render("adminlogin.ejs",{messages:{error:"Invalid Credentials"}})
    }

    // if(req.body.email==admincred.email && req.body.password==admincred.password){
    //     req.session.isAdminLogged = true;
    //     res.redirect("/admin");
    //     // res.send("Logged in")
    // }else{
    //     res.render("adminlogin.ejs",{messages:{error:"Invalid Credentials"}})
    // }
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


