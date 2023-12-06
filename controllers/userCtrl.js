var Userdb = require('../models/userModel')
const bcrypt = require('bcrypt')


exports.create = async (req,res)=>{
    const existingUser = await Userdb.findOne({email:req.body.email});

    const existingPhone = await Userdb.findOne({phone:req.body.phone});
        
            if(existingUser){
                // res.send("User Already Exists")
                res.render("userlogin.ejs",{messages:{error:"User Already exists"}})
            }else if(existingPhone){
                // res.render("userlogin.ejs",{messages:{error:"Phone already exists"}})
                res.render('finalreg.ejs', { email: req.body.email,messages:{error:"Phone already exists"} })
            }else{
                try{
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    const user = new Userdb ({
                        name:req.body.name,
                        email:req.body.email,
                        password:hashedPassword,
                        phone:req.body.phone
                    })
    
                    await user.save() 
                        .then(()=>{
                            res.render('successpage.ejs',{messages:"Password Updated"});
                        })
                        .catch(err=>{
                            res.status(500).send(err)
                        })
                }catch(err){
                    res.status(500).send(err);
                }
                
             
            }
            
        
};

exports.updatepass = async (req, res) => {
    const email = req.body.email;
    console.log(email);

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const updatedUser = await Userdb.findOneAndUpdate(
            { email: email },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        if (updatedUser) {
            res.render('successpage.ejs',{messages:"User Registered"});
        }
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).send(err);
    }
};

exports.getuser = async(req,res)=>{
    const users = await Userdb.find()
    res.send(users)
}

exports.block = async(req,res)=>{
    const id = req.params.id;
    const user = await Userdb.findById(id);
    const result = await Userdb.findByIdAndUpdate({_id:id},{$set:{blocked:true}},{new:true})
    res.redirect('/admin/usermgmt')
}
exports.unblock = async(req,res)=>{
    const id = req.params.id;
    const result = await Userdb.findByIdAndUpdate({_id:id},{$set:{blocked:false}},{new:true})
    res.redirect('/admin/usermgmt')
}