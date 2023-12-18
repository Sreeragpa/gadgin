const axios = require('axios');
const Userdb = require('../models/userModel');
const Cartdb = require('../models/cartModel')

exports.homepage = (req, res) => {

    axios.all([
        axios.get(`http://localhost:${process.env.PORT}/api/products`),
        axios.get(`http://localhost:${process.env.PORT}/api/getcategory`),

    ])

        .then(axios.spread((response1, response2) => {
            if (req.session?.passport?.user) {
                const user = Userdb.findOne({ _id: req.session.passport.user }, { blocked: 1, _id: 0 })
                    .then((user) => {
                        if (user.blocked == 'true') {
                            req.flash('userblocked', "Your account is Blocked");
                        }
                        res.render("homepage", { products: response1.data, category: response2.data })

                    })
            } else {
                res.render("homepage", { products: response1.data, category: response2.data })
            }

        }))
        .catch((error) => {
            res.status(500).render('errorpage500.ejs');
        })



}


exports.login = (req, res) => {
    // req.flash('success',"User Registered");
    res.render("userlogin.ejs")
}
exports.register = (req, res) => {
    if (req.session.error) {
        req.session.error = false;
        res.render('emailreg.ejs', { messages: { error: "Email taken" } });
        return;
    }
    res.render("emailreg.ejs")
}
exports.forgotpass = (req, res) => {
    if (req.session.error) {
        req.session.error = false;
        res.render('forgotpass.ejs', { messages: { error: "Email not registered" } });
        return;
    }
    res.render('forgotpass.ejs')
}

exports.logout = async (req, res, next) => {

    try {
        const userId = req.session.passport.user;
        delete req.session.passport.user;
        await Userdb.findByIdAndUpdate({ _id: userId }, { $set: { status: 'inactive' } })
        res.redirect("/login");
    } catch (error) {
        next(error)
    }



}
exports.otpreg = (req, res) => {
    if (req.session.email) {
        res.render('otpreg.ejs', { email: req.session.email })
        // req.session.destroy();
    } else {
        res.render('errorpage.ejs');
    }


}
exports.otpregfpass = (req, res) => {
    if (req.session.email) {
        res.render('otpregfpass.ejs', { email: req.session.email })
        req.session.destroy();
    } else {
        res.render('errorpage.ejs');
    }


}
exports.changepassword = (req, res) => {
    if (req.session?.email) {
        res.render('newpass.ejs', { email: req.session.email });
        req.session.destroy()
    } else {
        res.render('errorpage.ejs');
    }

}
exports.newaccount = (req, res) => {
    if (req.session?.email) {
        res.render('finalreg.ejs', { email: req.session.email });
        req.session.destroy()
    } else {
        res.render('errorpage.ejs');
    }
}



exports.userAccount = async (req, res) => {
    try {
        const userId = req.session.passport.user;
        if (userId) {
            const user = await Userdb.findById(userId);
            res.render('useraccountpage.ejs', { user: user });
        } else {
            res.redirect('/login')
        }
    } catch (err) {
        res.redirect('/login');
    }


}

exports.cart = async (req, res) => {

    const userid = req.session.passport.user;
    axios.get(`http://localhost:3001/api/user/getCart/${userid}`)
        .then(function (response) {
            if (response.data && response.data.length > 0) {
                const quantityerror = response.data.some(element => {
                    return element.cartItemsWithDetails[0].quantity == 0
                });
                res.render("cartpage.ejs", { cartitems: response.data, items: 'true', quantityerror })
            } else {
                res.render("cartpage.ejs", { items: 'false', quantityerror: true })
            }

        }).catch((err) => {
            console.error(err);
            res.redirect('/');
        })


}
exports.orderSummary = async (req, res, next) => {
    try {
        const userid = req.session.passport.user;
        const address = await axios.get(`http://localhost:3001/api/user/getaddress/${userid}`);
        if (req.params.type == 'cart') {
            const cartItems = await axios.get(`http://localhost:3001/api/user/getCart/${userid}`)
            res.render('ordersummarypage.ejs', { addresses: address.data, cartitems: cartItems.data });
        } else {
            try {
                const product = await axios.get(`http://localhost:3001/api/getproduct/${req.params.type}`)
                res.render('ordersummarypage.ejs', { addresses: address.data, cartitems: false, product: product.data });
            } catch (error) {
                console.error("Error in orderSummary:", error);
                res.status(500).send({ error: "Internal Server Error" });
            }

        }
    } catch (error) {
        console.error("Error in orderSummary:", error);
        // res.status(500).send({ error: "Internal Server Error" });
        next(error)
    }


}

exports.checkoutPage = async (req, res, next) => {
    const orderid = req.session.pendingorderid;
    const userid = req.session.passport.user;
    // delete req.session.pendingorderid; 
    let mrp = 0;
    let price = 0;
    let discount = 0;
    let count = 0;
    if (!orderid) {
        res.redirect('/');
    } else {
        try {
            const orderdetails = await axios.get(`http://localhost:${process.env.PORT}/api/user/getorders/${userid}/${orderid}`)
            // console.log(orderdetails.data);
            orderdetails.data[0].orderitems.forEach(product => {
                for (let i = 0; i < product.quantity; i++) {
                    mrp += product.mrp;
                    price += product.price;
                }
                discount = mrp - price;
                count += product.quantity;
            });
    
    
            const productpricedetails = {
                mrp: mrp,
                price: price,
                discount: discount,
                count: count
            }
            if (orderid) {
                res.render('checkoutpage.ejs', { orderid: orderid, productpricedetails: productpricedetails });
            } else {
                res.end()
            }
        } catch (error) {
            next(error)
        }
     

    }



}

exports.paymentCheck = async (req, res, next) => {
    const paymentmethod = req.body.paymentmethod;
    // const orderid = req.params.id;
    const orderid = req.session.pendingorderid;
    const userid = req.session.passport.user;
    delete req.session.pendingorderid;

    if (!orderid) {
        res.redirect('/');
    } else {
        try {
            const order = await axios.get(`http://localhost:3001/api/user/getorders/${userid}/${orderid}`);

            if (order) {
                if (paymentmethod == 'cod') {
                    const codsuccess = await axios.get(`http://localhost:3001/api/user/cod/success/${userid}/${orderid}`)
                    if (codsuccess.data) {
                        // const ress = await axios.get(`http://localhost:3001/api/user/cart/clearafterpurchase?userid=${userid}`);
                        await Cartdb.findOneAndUpdate({userid:userid},{$unset:{cartitems:""}});

                        res.render('paymentstatuspage.ejs', { paymentstatus: "Order Success", orderdetails: order.data[0] });
                        
                        // res.send("Order Placed Succesfully")
                    } else {
                        res.render('paymentstatuspage.ejs', { paymentstatus: "Order Failed" })
                    }
    
                } else if (paymentmethod == 'card') {
                    res.send("Card payment is not available now")
                }
            } else {
                res.send('Error')
            }
        } catch (error) {
            next(error)
        }
       
    }


}


exports.manageAddress = async (req, res, next) => {
    const id = req.session.passport.user;
    // if(!req.session?.isAddress)

    axios.get(`http://localhost:${process.env.PORT}/api/user/getaddress/${id}`)
        .then((response) => {
            res.render('manageaddress.ejs', { addresses: response.data });
        })
        .catch((err) => {
            console.error(err);
            // res.redirect('/');
            next(error)
        })


    // res.render('manageaddress.ejs')

}

exports.userOrders = async (req, res, next) => {
    const orderid = 'false';
    const userid = req.session.passport.user;
    const page = parseInt(req.query.page) || 1;
    try {
        const result = await axios.get(`http://localhost:${process.env.PORT}/api/user/getorders/${userid}/${orderid}?page=${page}`);
        if (result) {
            // console.log(result.data);
            const { order, pageCount, currentPage } = result.data;
            res.render('userorderspage.ejs', { orders: order, currentPage: currentPage, pageCount: pageCount })
        }

    } catch (error) {
        next(error)
    }

}

exports.editAccount = async (req, res, next) => {
    const id = req.session.passport.user;
    try {
        const userinfo = await Userdb.findOne({ _id: id }, { name: 1, phone: 1, profileimg: 1 })
        if (userinfo) {
            res.render('useredit.ejs', { userinfo: userinfo });
        }
    } catch (error) {
        next(error)
    }
  

}

exports.orderitemInfo = async (req, res) => {
    const orderid = req.params.id;
    const userid = req.session.passport.user;
    try {
        const orders = await axios.get(`http://localhost:${process.env.PORT}/api/user/getorders/${userid}/${orderid}`);
        res.render('userorderssingle', { orders: orders.data[0] })
    } catch (error) {
        next(error)
    }
 
}