const axios = require('axios')
exports.homepage=(req, res) => {

    axios.all([
        axios.get(' http://localhost:3001/api/products'),
        axios.get(' http://localhost:3001/api/getcategory')
    ])

    .then(axios.spread((response1,response2)=>{
        res.render("homepage.ejs",{products:response1.data,category:response2.data})
    }))


 
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
exports.logout=(req, res) => {
    userId = req.session.passport;
    req.session.destroy(err => {
        if (err) {
            res.send(err);
        } else {
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

