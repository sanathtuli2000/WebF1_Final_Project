const express = require('express')
const bcrypt = require('bcryptjs')
var cookie = require('cookie-parser')
const jsonwt = require('jsonwebtoken')
const passport = require('passport')
const passportjwt = require('passport-jwt')
const jsonwtStrategy = passportjwt.Strategy;
const extractjwt = passportjwt.ExtractJwt;

// getting setting
const settings = require('../../config/settings')

passport.use(new jsonwtStrategy({
        jwtFromRequest: extractjwt.fromAuthHeaderAsBearerToken,
        secretOrKey: settings.secret
    },
    function(jwtpayload, cb) {
        console.log(jwtpayload.id);
    }));

const router = express.Router()

const Person = require('./../../models/Person')

router.use(cookie())

// Route to register a user. URL : /api/auth/register
router.post('/register', (req, res) => {
    // check if username is already in collection.
    Person
        .findOne({ username: req.body.username })
        .then(person => {
            if (person) {
                res.render(
                    'hbs_register', {
                        username_already_exists: 'Username already exists!'
                    }
                )
            } else {

                const person = Person({
                    name: req.body.name,
                    username: req.body.username,
                    password: req.body.password
                })

                // encrypting the password using bcryptjs
                bcrypt.genSalt(10, (err, salt) => {
                    // salt is provided in salt variable.
                    bcrypt.hash(person.password, salt, (err, hash) => {
                        if (err) {
                            return res.status(400).send('Not Registered, Contact Admin!')
                        } else {
                            // hashed password
                            person.password = hash

                            // add new person with hashed password.
                            person
                                .save()
                                .then(person => res.render(
                                    'hbs_register', {
                                        output: 'Successfully added!'
                                    }
                                ))
                                .catch(err => res.send(err.message))
                        }
                    })
                })
            }
        })
        .catch(err => res.send(err))
})

// Route to login a user. URL : /api/auth/login
router.post('/login', (req, res) => {
    username = req.body.username
    password = req.body.password

    // check if username is already in collection.
    Person
        .findOne({ username: req.body.username })
        .then(person => {
            if (person) {
                // compare the password
                bcrypt
                    .compare(password, person.password)
                    .then(
                        (isCompared) => {
                            if (isCompared) {
                                // res.cookie('session_id', '123')
                                // res.send('Login Success')

                                // generate JWT
                                const payload = {
                                    id: person.id,
                                    name: person.name,
                                    username: person.username
                                }

                                // jsonwebtoken method used to create token.
                                jsonwt.sign(payload, settings.secret, { expiresIn: 3600 },
                                    (err, token) => {
                                        res.render(
                                            'hbs_login', {
                                                output: 'Login Successfull!',
                                                jwt_token: token
                                            }
                                        )

                                    }
                                )
                            } else {
                                res.render(
                                    'hbs_login', {
                                        output: 'Password incorrect!'
                                    }
                                )
                            }
                        }
                    )
                    .catch()
            } else {
                res.render(
                    'hbs_login', {
                        output: 'User does not exist!'
                    }
                )
            }
        })

})

// function validateCookie(req, res, next) {
//     const {cookies} = req;

//     if('session_id' in cookies) {
//         if(cookies.session_id == 123) {
//             next()
//         }else{
//             res.status(403).send('Not Authorized')
//         }
//     }
// }

// Private route to get all user details
router.post('/get', passport.authenticate('jwt', { session: false }), async(req, res) => { // middleware from passport-jwt
    // passport.authenticate('jwt', { session: false }),
    // const jwt_token = req.header.authorization;
    // const token = jwt_token && jwt_token.split(' ')[1];
    // const cursor = await Person.find()
    const user = (req.user.username);
    res.redirect('/api/auth/hbs_display?username=' + user, )
})

router.get("/hbs_validate", async(req, res) => {
    res.render(
        'hbs_validate'
    )
});

router.get("/hbs_login", async(req, res) => {
    res.render(
        'hbs_login'
    )
});

router.get("/hbs_register", async(req, res) => {
    res.render(
        'hbs_register'
    )
});


router.get("/hbs_display", async(req, res) => {
    res.render(
        'hbs_display'
    )
});

router.get("/hbs_token_auth_failed", async(req, res) => {
    res.render(
        'hbs_token_auth_failed'
    )
});

module.exports = router