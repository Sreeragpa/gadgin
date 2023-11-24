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


exports.getCategory = async(req,res)=>{
    const categories = await Categorydb.find()
    res.send(categories)
}
exports.getUnlistedCategory = async(req,res)=>{
    const categories = await UnlistedCategorydb.find()
    res.send(categories)
}


exports.createCategory = async(req,res)=>{
    cat=req.body.category;
    cat=cat.toLowerCase();

    const categories = await Categorydb.findOne({categoryName:cat})
 

    if(categories){
        
        res.render('adminaddcategory.ejs',{messages:{error:"Category Exists"}})
    }else{
        const files = req.files;
        // console.log(files);
        imag="/uploads/" + files[0].filename;
        
        
        const newCate = new Categorydb({
            categoryName:cat,
            images:imag
        })
        result=await newCate.save()
        res.redirect('/admin/categorymgmt')
    }
   
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
