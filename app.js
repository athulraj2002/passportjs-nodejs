const express = require('express');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');


const app = express();


require('./config/passport')(passport);
//Mongo Init
const mongoId = require('./config/config').mongoURI;
mongoose.connect(mongoId, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('Mongodb connected'))
    .catch(error => console.log(error));


app.use(express.static("public"));
app.use(expressLayout);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Router initialize
app.use('/', indexRouter);
app.use('/users', userRouter);


//Setting up PORT
const PORT = process.env.PORT || 5000;







app.listen(PORT, console.log(`App listening on port ${PORT}`));