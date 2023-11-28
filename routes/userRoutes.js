const route = require('express').Router();
const userCtrl = require('../controllers/userCtrl')
const otpCtrl = require('../controllers/otpCtrl')
const productCtrl = require('../controllers/productsCtrl')
const productRender = require('../services/productRender')
const session = require('express-session')
const { CheckAuthenticated, CheckNotauthenticated } = require('../middlewares/authMiddleware');
const {isBlocked} = require('../middlewares/userBlockMiddleware');
const userRender=require('../services/userRender')
const axios = require('axios')
const store = require('../services/multer');
const { response } = require('express');

route.get('/',CheckAuthenticated,isBlocked,userRender.homepage)
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
route.get('/getproduct/:id',(req,res)=>{


    axios.all([
        axios.get(`http://localhost:3001/api/getproduct/${req.params.id}`),
        axios.get(' http://localhost:3001/api/getcategory')
    ])

    .then(axios.spread((response1,response2)=>{
        res.render('admineditproductform.ejs',{product:response1.data,categories:response2.data})
    }))

})
route.get('/sproduct/:id',(req,res)=>{
    axios.get(`http://localhost:3001/api/getproduct/${req.params.id}`)
        .then((response)=>{
            res.render('singleproductpage.ejs',{product:response.data})
        })
})

route.get('/account',userRender.userAccount)




// route.get('/')

route.post('/api/update', userCtrl.updatepass)
route.post('/api/register', userCtrl.create)
route.post('/api/getotp', otpCtrl.getOtp)
route.post('/api/checkotp', otpCtrl.checkOtp)
route.get('/api/products',productCtrl.getProducts )
route.get('/api/unlistedproducts',productCtrl.unlistedProd)
route.get('/api/getproduct/:id',productCtrl.getProducts )
route.post('/api/addproducts',store.array('images',4),productCtrl.addProducts )
route.post('/api/addproductsfromunlisted/:id',productCtrl.addProductsfromUnlisted )
route.post('/api/addcategoryfromunlisted/:id',productCtrl.addategoryFromUnlisted )
route.post('/api/editproducts/:id',store.array('images',4),productCtrl.editProducts )
route.post('/api/createcategory',store.array('images',1),productRender.createCategory)
route.get('/api/getcategory',productRender.getCategory)
route.get('/api/getcategory/unlisted',productRender.getUnlistedCategory)
route.post('/api/delete/product/:id',productCtrl.deleteProducts)
route.post('/api/delete/category/:id',productCtrl.deleteCategory)
route.post('/api/deleteimage',productCtrl.deleteImage)
route.get('/api/getusers',userCtrl.getuser)
route.post('/api/user/block/:id',userCtrl.block)
route.post('/api/user/unblock/:id',userCtrl.unblock)



module.exports = route;