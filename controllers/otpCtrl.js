const otpGen = require('../services/otpGenerator');
// MAIL
const nodemailer  = require('nodemailer');
const Mailgen = require('mailgen');
// MAIL
const Otpdb = require('../models/otpVerification')
const Userdb = require('../models/userModel')
let fpasss;
exports.getOtp = async (req, res) => {
    const email = req.body.email;
    fpasss= req.query.forgotpass;
    if (req.query.forgotpass == 1) {
        const type = 'fpass'
        req.session.fpass = true;
        const isUser = await Userdb.findOne({ email: email })
        if (isUser) {
            sendEmail(type)
        } else {
            req.session.error = true;
            res.redirect('/forgotpass');
        }
    } else {
        const type = 'newreg'
        req.session.fpass = false;
        const isUser = await Userdb.findOne({ email: email })
        if (isUser) {
            req.session.error = true;
            res.redirect('/register');
        } else {
            sendEmail(type)
        }
    }





    function sendEmail(type) {
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
            .then(async () => {
                const newOtpdb = await new Otpdb({
                    userId: otp,
                    otp: otp,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 59000,
                })
                await newOtpdb.save()
                req.session.email = req.body.email;

                res.redirect('/otpreg')
                // res.render('otpreg.ejs', { email: req.body.email });
            })
            .catch((error) => {
                console.log(otp, email);
                return res.status(500).json({ error });

            });
    }


};

exports.checkOtp = async (req, res) => {
    try {
        let { otp, email } = req.body;
        if (!otp) {
            // throw Error("Empty OTP not allowed")
            res.render('otpreg.ejs', { messages: { error: "Empty OTP not allowed" } })
        } else {
            const otpVerify = await Otpdb.findOne({ otp });
            if (otpVerify) {

                const { expiresAt } = otpVerify;
                const savedOtp = otpVerify.otp;

                if (expiresAt < Date.now()) {
                    try {
                        await Otpdb.deleteOne({ otp: otp });
                        console.log('Document deleted successfully');
                    } catch (error) {
                        console.error('Error deleting document:', error);
                    }
                    // throw new Error({message:"OTP has expired"});
                    res.render('otpreg.ejs', { messages: { error: "OTP has expired" }, email: email });

                } else if (savedOtp == otp) {
                    console.log(req.session.fpass);
                    if (fpasss==1) {
                        console.log('heheheheheheh');
                        res.render('newpass.ejs', { email: email })
                    } else {
                        res.render('finalreg.ejs', { email: email })
                    }
                }

            } else {
                console.log("OTP ERRORROR");
                res.render('otpreg.ejs', { messages: { error: "Invalid OTP" }, email: email });
            }
        }
    } catch (err) {
        res.json({ err });
    }
}

