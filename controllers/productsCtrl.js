const axios = require('axios');
const Productdb=require('../models/productModel')
const store = require('../services/multer');
exports.getProducts = async (req,res)=>{
    if(req.query.category){
        const category=req.query.category;
        const products = await Productdb.find({ category: { $regex: new RegExp(category, 'i') } })
        if(products.length === 0){
            const nop=false;
            res.send();
        }else{
            res.send(products)
        }
        
    }else{
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

exports.addProducts=async(req,res)=>{

    
    const files = req.files;
    imag=files.map((file)=>{
        return "/uploads/" + file.filename
    })

    const newProduct = new Productdb({
            name:req.body.name,
            mrp:req.body.mrp,
            price:req.body.price,
            discount:req.body.discount,
            category:req.body.category,
            description:req.body.description,
            brand:req.body.brand,
            color:req.body.color,
            quantity:req.body.quantity,
            images:imag
        })
     product =  await newProduct.save()
    //  res.send(product)
    res.send(files)
     
    
}

exports.editProducts = async(req,res)=>{
    id=req.body.id;
    updatedProduct = await Productdb.findByIdAndUpdate({_id:id},{$set:{
        name:req.body.pname,
        price:req.body.price,
        category:req.body.category,
        }},{new:true})
        res.send(updatedProduct)
}