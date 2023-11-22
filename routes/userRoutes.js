const route = require('express').Router();
const userCtrl = require('../controllers/userCtrl')
const otpCtrl = require('../controllers/otpCtrl')
const productCtrl = require('../controllers/productsCtrl')
const productRender = require('../services/productRender')
const session = require('express-session')
const { CheckAuthenticated, CheckNotauthenticated } = require('../middlewares/authMiddleware')
const userRender=require('../services/userRender')
const axios = require('axios')
const store = require('../services/multer');


route.get('/',userRender.homepage)
route.get('/login', CheckNotauthenticated,userRender.login)
route.get('/register', CheckNotauthenticated,userRender.register)
route.get('/forgotpass',CheckNotauthenticated,userRender.forgotpass)
route.get('/otpreg',CheckNotauthenticated,userRender.otpreg)
route.post('/logout',userRender.logout)
route.get('/products',(req,res)=>{
    if(req.query.category){
        axios.get(`http://localhost:3001/api/products?category=${req.query.category}`)
        .then(function(response){
            if(!response.data){
                res.send("No products")
            }else{
                res.render('productpage.ejs',{products:response.data})
            }
           
        }).catch(err=>{
            console.log(err);
        })
    }else{
        axios.get(`http://localhost:3001/api/products`)
        .then(function(response){
            console.log(response);
            res.render('productpage.ejs',{products:response.data})
        }).catch(err=>{
            console.log(err);
        })
    }
 
})

// route.get('/')

route.post('/api/update', userCtrl.updatepass)
route.post('/api/register', userCtrl.create)
route.post('/api/getotp', otpCtrl.getOtp)
route.post('/api/checkotp', otpCtrl.checkOtp)
route.get('/api/products',productCtrl.getProducts )
route.post('/api/addproducts',store.array('images',4),productCtrl.addProducts )
route.post('/api/editproducts',productCtrl.editProducts )
route.post('/api/createcategory',store.array('images',1),productRender.createCategory)
route.get('/api/getcategory',productRender.getCategory)
module.exports = route;