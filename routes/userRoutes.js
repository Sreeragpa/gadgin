const route = require('express').Router();
const userCtrl = require('../controllers/userCtrl')
const otpCtrl = require('../controllers/otpCtrl')
const productCtrl = require('../controllers/productsCtrl')
const cartCtrl = require('../controllers/cartCtrl')
const productRender = require('../services/productRender')
const session = require('express-session')
const { CheckAuthenticated, CheckNotauthenticated } = require('../middlewares/authMiddleware');
const {isBlocked} = require('../middlewares/userBlockMiddleware');
const userRender=require('../services/userRender')
const axios = require('axios')
const store = require('../services/multer');
const { response } = require('express');

route.get('/',userRender.homepage)
route.get('/login', CheckNotauthenticated,userRender.login)
route.get('/register', CheckNotauthenticated,userRender.register)
route.get('/forgotpass',CheckNotauthenticated,userRender.forgotpass)
route.get('/otpreg',CheckNotauthenticated,userRender.otpreg)
route.get('/otpregfpass',CheckNotauthenticated,userRender.otpregfpass)
route.post('/logout',userRender.logout)
route.get('/products',productRender.productsbyCategory)
route.get('/sproduct/:id',productCtrl.singlepdtRender)
route.get('/account',CheckAuthenticated,isBlocked,userRender.userAccount)
route.get('/cart',CheckAuthenticated,isBlocked,userRender.cart)



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
route.post('/api/createcategory',store.array('images',1),productCtrl.createCategory)
route.get('/api/getcategory',productCtrl.getCategory)
route.get('/api/getcategory/unlisted',productCtrl.getUnlistedCategory)
route.post('/api/delete/product/:id',productCtrl.deleteProducts)
route.post('/api/delete/category/:id',productCtrl.deleteCategory)
route.post('/api/deleteimage',productCtrl.deleteImage)
route.get('/api/getusers',userCtrl.getuser)
route.post('/api/user/block/:id',userCtrl.block)
route.post('/api/user/unblock/:id',userCtrl.unblock)
route.post('/api/user/addtocart/:id',CheckAuthenticated,isBlocked,cartCtrl.addtoCart)
route.get('/api/user/getCart/:id',cartCtrl.getCart)
route.get('/api/cart/delete/:id',cartCtrl.deleteCartitem)
route.post('/api/cart/updatequantity/:id',cartCtrl.updateQuantity)



module.exports = route;