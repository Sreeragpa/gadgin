const otpGen = require('../services/otpGenerator');
// MAIL
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
// MAIL
const Otpdb = require('../models/otpVerification')

exports.getOtp = (req, res) => {
    const email = req.body.email;
    let otp = otpGen();
    // Send Mail
    const EMAIL = process.env.EMAIL;
    const PASS = process.env.PASS;
    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASS,
        },
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'GADGIN',
            link: 'https://mailgen.js/',
        },
    });

    let response = {
        body: {
            name: email,
            table: {
                data: [
                    {
                        OTP: otp,
                    },
                ],
            },
            outro: 'Looking forward to doing more business',
        },
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: EMAIL,
        to: email,
        subject: 'OTP',
        html: mail,
    };

    transporter
        .sendMail(message)
        .then(async() => {
           const newOtpdb = await new Otpdb({
                userId:otp,
                otp:otp,
                createdAt:Date.now(),
                expiresAt: Date.now() + 59000,
            })
            await newOtpdb.save()

            res.render('otpreg.ejs', { email: req.body.email });
        })
        .catch((error) => {
            console.log(otp,email);
            return res.status(500).json({ error });
           
        });

};

exports.checkOtp = async(req,res)=>{
    try{
        let {otp,email} = req.body;
        if(!otp){
            throw Error("Empty OTP not allowed")
        }else{
            const otpVerify = await Otpdb.findOne({otp});
            console.log(otpVerify);
            const {expiresAt} = otpVerify;
            const savedOtp = otpVerify.otp;
            console.log(expiresAt);

            if(expiresAt < Date.now()){
                await Otpdb.deleteOne({otp});
                throw new Error({message:"OTP has expired"});
            }else{
                if(savedOtp!=otp){
                    throw new Error({message:"Invalid OTP"})
                }else{
                    res.render('finalreg.ejs',{email:email})
                }
            }
        }
    }catch(err){
        res.json({err});
    }
}

