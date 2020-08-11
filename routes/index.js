const express = require('express');
const router = express.Router();
const authGurad = require('../config/authGurad');
const passport = require('passport')



router.get('/', (req, res) => res.render('welcome'));
router.get('/dashboard', (req, res) =>
    res.render('dashboard', {
        user: req.user
    })
);
// router.get('/dashboard', (req, res,next ) => {
//     console.log('asdadsaasdaasaa');
//     passport.authenticate('jwt-strategy', { session: false })(req, res, next => {


//     })
// });

module.exports = router;