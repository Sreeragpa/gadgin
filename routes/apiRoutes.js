const route = require('express').Router();
const userCtrl = require('../controllers/userCtrl')
const otpCtrl = require('../controllers/otpCtrl')
const productCtrl = require('../controllers/productsCtrl')
const orderCtrl = require('../controllers/orderCtrl')
const cartCtrl = require('../controllers/cartCtrl')
const { CheckAuthenticated, CheckNotauthenticated } = require('../middlewares/authMiddleware');
const {isBlocked} = require('../middlewares/userBlockMiddleware');
const store = require('../services/multer');
const validation = require('../middlewares/validationMiddleware');

// User
route.post('/update',validation.strongPassword, userCtrl.updatepass)
route.post('/register',validation.strongPassword,userCtrl.create)
route.post('/getotp', otpCtrl.getOtp)
route.post('/checkotp', otpCtrl.checkOtp)
route.post('/user/changepassword',CheckAuthenticated,validation.strongPassword,userCtrl.changePassword)
route.get('/user/get/:id',CheckAuthenticated,userCtrl.getUser)
route.post('/user/changeinfo',CheckAuthenticated,userCtrl.changeInfo)
route.post('/user/address/delete/:id',CheckAuthenticated,userCtrl.deleteAddress)
route.post('/user/cart/clear',CheckAuthenticated,cartCtrl.clearCart)
route.get('/user/cart/clearafterpurchase',CheckAuthenticated,cartCtrl.clearAfterPurchase)
route.post('/user/changeprofile',store.array('images',1),userCtrl.changeProfile)
route.post('/user/block/:id',userCtrl.block)
route.post('/user/unblock/:id',userCtrl.unblock)
route.post('/user/addtocart/:id',CheckAuthenticated,isBlocked,cartCtrl.addtoCart)
route.get('/user/getCart/:id',cartCtrl.getCart)
route.get('/cart/delete/:id',cartCtrl.deleteCartitem)
route.post('/cart/updatequantity/:id',cartCtrl.updateQuantity)
route.get('/user/getaddress/:id',userCtrl.getAddress)
route.post('/user/addaddress',validation.checkAddress,userCtrl.addAddress)
route.post('/user/address/makedefault/:id',userCtrl.makeaddressDefault)
route.get('/getusers',userCtrl.getuser)

// Product
route.get('/products',productCtrl.getProducts )
route.get('/unlistedproducts',productCtrl.unlistedProd)
route.get('/getproduct/:id',productCtrl.getProducts )
route.post('/addproducts',store.array('images',4),productCtrl.addProducts )
route.post('/addproductsfromunlisted/:id',productCtrl.addProductsfromUnlisted )
route.post('/addcategoryfromunlisted/:id',productCtrl.addategoryFromUnlisted )
route.post('/editproducts/:id',store.array('images',4),productCtrl.editProducts )
route.post('/createcategory',store.array('images',1),productCtrl.createCategory)
route.get('/getcategory',productCtrl.getCategory)
route.get('/getcategory/unlisted',productCtrl.getUnlistedCategory)
route.post('/delete/product/:id',productCtrl.deleteProducts)
route.post('/delete/category/:id',productCtrl.deleteCategory)
route.post('/deleteimage',productCtrl.deleteImage)



// Order
route.get('/admin/getorders',orderCtrl.getallOrders)
route.get('/admin/getorders/userdetails',orderCtrl.getallorderwithuser)
route.post('/order/changestatus/:id/:pid',orderCtrl.changeorderStatus)
route.post('/order/cancel/:oid/:pid',CheckAuthenticated,orderCtrl.cancelOrder)
route.get('/admin/getorder/:orderid',orderCtrl.getSingleOrder)
route.post('/checkout/:id',userCtrl.checkout)
route.get('/user/getorders/:userid/:orderid',orderCtrl.getOrders)
route.get('/user/getorders/products/:userid/:orderid',orderCtrl.getOrderProducts)
route.get('/user/cod/success/:userid/:orderid',userCtrl.setcodSuccess)










module.exports = route