const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const randtoken = require('rand-token')

let refreshTokens = {}
const SECRET = "SECRETO_PARA_ENCRIPTACION"
// Load User model
const User = require('../models/User.model');

module.exports = function (passport) {
    console.log('first');

    refreshTokens = {}
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match user
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    const payload = { message: 'That email is not registered' }
                    return done(null, payload, { message: 'That email is not registered' });
                }
                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        console.log('asdadas');

                        var token = jwt.sign(user.toObject(), SECRET, { expiresIn: 300 })
                        var refreshToken = randtoken.uid(256);
                        refreshTokens['tokens'] = { token:  token, refreshToken: refreshToken };
                        // console.log(user);
                        const payload = { user, ...refreshTokens }

                        // console.log(payload);

                        return done(null, payload);
                    } else {

                        return done(null, user, { message: 'Password incorrect' });
                    }
                });
            });
        })
    );

    // passport.use('jwt-strategy',
    //     new JwtStrategy(opts, function (jwtPayload, done) {
    //         //If the token has expiration, raise unauthorized
    //         console.log(jwtPayload);

    //         var expirationDate = new Date(jwtPayload.exp * 1000)
    //         if (expirationDate < new Date()) {
    //             return done(null, false);
    //         }
    //         var user = jwtPayload
    //         done(null, user)
    //     }));

    // jwt.serializeUser(function (user, done) {
    //     done(null, user.username)
    // })

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};


var opts = {}
// module.exports = function (jwt) {
//     // Setup JWT options
//     console.log('second');

//     opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
//     opts.secretOrKey = "SECRETO_PARA_ENCRIPTACION"

//     jwt.use('jwt-strategy',
//         new JwtStrategy(opts, function (jwtPayload, done) {
//             //If the token has expiration, raise unauthorized
//             console.log(jwtPayload);

//             var expirationDate = new Date(jwtPayload.exp * 1000)
//             if (expirationDate < new Date()) {
//                 return done(null, false);
//             }
//             var user = jwtPayload
//             done(null, user)
//         }));

//     jwt.serializeUser(function (user, done) {
//         done(null, user.username)
//     })
// }