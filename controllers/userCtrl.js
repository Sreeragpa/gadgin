var Userdb = require('../models/userModel')
const bcrypt = require('bcrypt')





exports.create = async (req,res)=>{
    const existingUser = await Userdb.findOne({email:req.body.email})
        
            if(existingUser){
                res.send("User Already Exists")
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
                            res.send("User Added")
                        })
                        .catch(err=>{
                            res.status(500).send(err)
                        })
                }catch(err){
                    console.log("erorooroor");
                }
                
             
            }
            
        
}
