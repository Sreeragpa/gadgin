const axios = require('axios');
const Categorydb = require('../models/categoryModel');
const UnlistedCategorydb = require('../models/UnlistedcategoryModel');
const store = require('../services/multer');


exports.productmanagement = (req,res)=>{
    axios.get('http://localhost:3001/api/products')
        .then(function(response){
            res.render('adminproductmgmt.ejs',{products:response.data})
        })
    
}
exports.Unlistedproductmanagement = (req,res)=>{
    axios.get('http://localhost:3001/api/unlistedproducts')
        .then(function(response){
            res.render('adminUnlistedproductmgmt.ejs',{products:response.data})
        })
    
}

exports.addproductform = (req,res)=>{
    axios.get('http://localhost:3001/api/getcategory')
        .then(function(response){
            res.render('adminaddproductform.ejs',{categories:response.data})
        })
}



exports.addCategory = async (req,res)=>{
    res.render('adminaddcategory.ejs')
}

exports.unlistedCategorymgmt = async(req,res)=>{
    const response = await axios.get(`http://localhost:3001/api/getcategory/unlisted`)
    res.render("adminUnlistedcategorymgmt.ejs",{categories:response.data})
}


exports.categoryManagement = async (req,res)=>{
    const response = await axios.get(`http://localhost:3001/api/getcategory`)

    if(response){
        res.render('admincategorymgmt.ejs',{categories:response.data})
    }
}

exports.productsbyCategory = async(req,res)=>{
    if(req.query.category){
        axios.get(`http://localhost:3001/api/products?category=${req.query.category}`)
        .then(function(response){
            if(!response.data){
                res.send("No products")
            }else{
                res.render('productpage.ejs',{products:response.data,isInCart:null})
            }
           
        }).catch(err=>{
            console.log(err);
        })
    }else{
        axios.get(`http://localhost:3001/api/products`)
        .then(function(response){
            console.log(response);
            res.render('productpage.ejs',{products:response.data,isInCart:null})
        }).catch(err=>{
            console.log(err);
        })
    }
}

exports.getProductdetails = async(req,res)=>{
    axios.all([
        axios.get(`http://localhost:3001/api/getproduct/${req.params.id}`),
        axios.get(' http://localhost:3001/api/getcategory')
    ])

    .then(axios.spread((response1,response2)=>{
        res.render('admineditproductform.ejs',{product:response1.data,categories:response2.data})
    }))
}