const express = require('express');
const router = express.Router();
const authGurad = require('../config/authGurad');

router.get('/', (req, res) => res.render('welcome'));
router.get('/dashboard', authGurad.ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.user
    })
);

module.exports = router;