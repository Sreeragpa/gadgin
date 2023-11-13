var Userdb = require('../models/userModel')
const bcrypt = require('bcrypt')





exports.create = async (req,res)=>{
    const existingUser = await Userdb.findOne({email:req.body.email})
        
            if(existingUser){
                // res.send("User Already Exists")
                res.render("userlogin.ejs",{messages:{error:"User Already exists"}})
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
                            res.redirect("/login")
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
            res.render('successpasschange.ejs');
        }
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).send(err);
    }
};
