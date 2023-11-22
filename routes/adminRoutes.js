const route = require('express').Router();
const adminRender = require('../services/adminRender')
const productRender = require('../services/productRender')
const {adminAuthenticated,adminNotAuthenticated} = require('../middlewares/adminMiddleware')
// Route /admin/..
const store = require('../services/multer');
route.get('/',adminAuthenticated,adminRender.admindash)
route.get('/login',adminNotAuthenticated,adminRender.loginpage)
route.post('/login',adminNotAuthenticated,adminRender.loginvalidate)
route.get('/logout',adminRender.logout)
route.get('/productmgmt',productRender.productmanagement)
route.get('/addproduct',productRender.addproductform)
route.get('/addcategory',productRender.addCategory)






module.exports = route