const express = require('express');
const dbConnect = require('./configs/dbConnect');
const app = express();
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000;
const path = require('path')
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')
const passport = require('./configs/passport-config');
const session = require('express-session')
const flash = require('express-flash')

dbConnect();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname,'public')))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false

}))
app.use(passport.initialize())
app.use(passport.session())



app.use('/',userRoutes)
app.use('/',authRoutes)


app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})
