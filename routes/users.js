const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User.model');
const passport = require('passport')
const { forwardAuth } = require('../config/authGurad');

router.get('/login', forwardAuth, (req, res) => res.render('login'));
router.get('/signup', forwardAuth, (req, res) => res.render('signup'));

router.post('/signup', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    else if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    else if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('signup', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email already exists' })
                    res.render('signup', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name, email, password
                    });

                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You can now Log In')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                        })
                    )

                }
            }).catch(error => console.error(error));
    }

});

router.post('/login', (req, res, next) => {
    let errors = [];
    let data = null;
    if (req.body.email == '' || req.body.password == '') {
        errors.push({ msg: 'Username or password not found' });
        // res.render('login', {
        //     errors
        // })

        res.status(400).json({ error: true, msg: 'Username or password not found' });
    } else {
        passport.authenticate('local', { session: false })(req, res, next => {
            data = req.user
            if (req.authInfo.message) {
                errors.push({ msg: req.authInfo.message })

                res.status(400).json({ error: true, msg: req.authInfo.message });
                // res.render('login', {
                //     errors
                // })
            } else {
                // res.redirect()
                // req.flash('error_msg', 'Please log in ');
            //    return res.render('dashboard',{
            //         user: data.user
            //     });
                res.status(200).json({ error: false, data: data.tokens, msg: 'Login Success' });
            }
        });
    }

});

// passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/users/login',
//     failureFlash: true
// })


// console.log(req);

// res.status(200).json({
// 	err: null,
// 	msg: `Welcome`,
// 	data: 'asdasdasdaad',
// });

//User Login
// router.post('/login', passport.authenticate('jwt', { session: false }),
//     function(req, res) {
//         res.send(req.user.profile);
//     }
// );
// router.post('/login', (req, res, next) => {
//     passport.authenticate('jwt', { session: false }), (req, res, next);
//     // let user = {
//     //     'email': req.body.email,
//     // }
//     // console.log(req.body);

//     // var token = jwt.sign(user, SECRET, { expiresIn: 300 })
//     // var refreshToken = randtoken.uid(256);

//     // refreshTokens[refreshToken] = res.json({ token: 'JWT ' + token, refreshToken: refreshToken })

// });
// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;