const axios = require('axios');
const Productdb = require('../models/productModel')
const UnlistedProductdb = require('../models/UnlistedproductModel');
const store = require('../services/multer');
const Categorydb = require('../models/categoryModel');
const UnlistedCategorydb = require('../models/UnlistedcategoryModel');
const fs = require('fs');
const path = require('path');
const { log } = require('console');
const Cartdb = require('../models/cartModel');
exports.getProducts = async (req, res) => {
    if (req.query.category) {
        const category = req.query.category;
        const products = await Productdb.find({ category: { $regex: new RegExp(category, 'i') } })
        if (products.length === 0) {
              const nop = false;
            res.send();
        } else {
            res.send(products)
        }

    } else if (req.params.id) {
        try {
            const id =req.params.id 
            const response = await Productdb.findById(id)
            res.send(response)
        } catch (error) {
            console.error('Error fetching product from external API:', error.message);
            res.status(500).send('Internal Server Error');
        }
    }
    else {
        const products = await Productdb.find();
        res.send(products)
    }
    // if(req.query.search){
    //     const name = req.query.search;
    //     console.log(name);
    //     const products = await Productdb.find({name:name});
    //     res.send(products)
    // }


}

exports.singlepdtRender = async (req,res)=>{
    try {
        const id =req.params.id ;
        const userid = req.session.passport?.user;
        let isInCart=null;
       
        const response = await Productdb.findById(req.params.id);
        if(userid){
             isInCart = await Cartdb.findOne({userid:userid,'cartitems.productid':id});
        }
            res.render('singleproductpage.ejs', { product: response ,isInCart:isInCart});
        
    } catch (error) {
        console.error('Error fetching product from external API:', error.message);
        res.status(500).send('Internal Server Error');
    }
} 

exports.unlistedProd = async (req, res) => {
    const unlistedproducts = await UnlistedProductdb.find();
    res.send(unlistedproducts)
}

exports.addProducts = async (req, res) => {
    const files = req.files;
    imag = files.map((file) => {
        return "/uploads/" + file.filename
    })

    const newProduct = new Productdb({
        name: req.body.name,
        mrp: req.body.mrp,
        price: req.body.price,
        discount: req.body.discount,
        category: req.body.category,
        description: req.body.description,
        brand: req.body.brand,
        color: req.body.color,
        quantity: req.body.quantity,
        images: imag
    })
    product = await newProduct.save()
    //  res.send(product)
    // res.send(files)
    res.redirect('/admin/productmgmt')


}

exports.addProductsfromUnlisted = async (req, res) => {
    const id = req.params.id;
    const productToMove = await UnlistedProductdb.findById(id);
    const newProduct = new Productdb({
        name: productToMove.name,
        mrp: productToMove.mrp,
        price: productToMove.price,
        discount: productToMove.discount,
        category: productToMove.category,
        description: productToMove.description,
        brand: productToMove.brand,
        color: productToMove.color,
        quantity: productToMove.quantity,
        images: productToMove.images
    })
    product = await newProduct.save()
    await UnlistedProductdb.findByIdAndDelete(id)
    res.redirect('/admin/productmgmt')
}

exports.addategoryFromUnlisted = async (req, res) => {
    const id = req.params.id;
    const categoryToMove = await UnlistedCategorydb.findById(id)

    const newCate = new Categorydb({
        categoryName: categoryToMove.categoryName,
        images: categoryToMove.images
    })
    await newCate.save()
    await UnlistedCategorydb.findByIdAndDelete(id)
    res.redirect('/admin/categorymgmt');
}

exports.editProducts = async (req, res) => {
    id = req.params.id;
    const files = req.files;
    let imag;
    if (files) {
        imag = files.map((file) => {
            return "/uploads/" + file.filename
        })
        
    }


    // updatedProduct = await Productdb.findByIdAndUpdate({ _id: id }, {
    //     $set: {
    //         name: req.body.name,
    //         mrp: req.body.mrp,
    //         price: req.body.price,
    //         discount: req.body.discount,
    //         category: req.body.category,
    //         description: req.body.description,
    //         brand: req.body.brand,
    //         color: req.body.color,
    //         quantity: req.body.quantity,
    //         images:imag
    //     }
    // }, { new: true })

    let updateFields = {
        name: req.body.name,
        mrp: req.body.mrp,
        price: req.body.price,
        discount: req.body.discount,
        category: req.body.category,
        description: req.body.description,
        brand: req.body.brand,
        color: req.body.color,
        quantity: req.body.quantity
    };
    if (imag && imag.length > 0) {
        await Productdb.findByIdAndUpdate({ _id: id }, { $push: { images: imag } }, { new: true });
    }
    updatedProduct = await Productdb.findByIdAndUpdate({ _id: id }, { $set: updateFields }, { new: true });
    res.redirect('/admin/productmgmt')
}

exports.deleteProducts = async (req, res) => {
    const id = req.params.id;
    try {

        const productToMove = await Productdb.findById(id);

        const unlistedProduct = new UnlistedProductdb({
            name: productToMove.name,
            mrp: productToMove.mrp,
            price: productToMove.price,
            discount: productToMove.discount,
            category: productToMove.category,
            description: productToMove.description,
            brand: productToMove.brand,
            color: productToMove.color,
            quantity: productToMove.quantity,
            images: productToMove.images
        })
        product = await unlistedProduct.save()
        // await UnlistedProductdb.create(productToMove);
        const deletesuccess = await Productdb.findByIdAndDelete(id);

        if (deletesuccess) {
            res.status(200).redirect('/admin/productmgmt');
        } else {
            console.log('Product not found.');
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

exports.deleteCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const productToMove = await Categorydb.findById(id);
        const newCate = new UnlistedCategorydb({
            categoryName: productToMove.categoryName,
            images: productToMove.images
        })
        await newCate.save()

        const deletesuccess = await Categorydb.findByIdAndDelete(id);

        if (deletesuccess) {
            res.status(200).redirect('/admin/categorymgmt');
        } else {
            console.log('Category not found.');
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error deleting Category:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}


exports.deleteImage = async (req, res) => {
    const productid = req.query.pid;
    const index = req.query.index;

    try {
        const product = await Productdb.findById(productid);
        const img = product.images[index];
        product.images.splice(index, 1);
        imgfilepath = path.join(__dirname,'../'+'/public'+img)
        console.log(imgfilepath);
       fs.unlink(imgfilepath,(err)=>{
        if(err){
            console.log(err);
        }
       })
        const updatedProduct = await product.save();
        const category = await Categorydb.find()
        res.render('admineditproductform.ejs', { product: updatedProduct ,categories:category})
    }
    catch (err) {
        console.log(err);
    }
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

exports.getCategory = async(req,res)=>{
    const categories = await Categorydb.find()
    res.send(categories)
}
exports.getUnlistedCategory = async(req,res)=>{
    const categories = await UnlistedCategorydb.find()
    res.send(categories)
}
