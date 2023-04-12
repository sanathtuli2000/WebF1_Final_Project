/****************************************************************************** 
* ITE5315 – Final_Project 
* I declare that this assignment is my own work in accordance with Humber Academic Policy. * 
No part of this assignment has been copied manually or electronically from any other source * 
(including web sites) or distributed to other students. 
* 
* Name: __Sanath Tuli_ Student ID: __N01473612__ Date: _20th March, 2023_____ 
* 
* 
*******************************************************************************/

const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { celebrate, Joi } = require('celebrate');
const bcrypt = require('bcryptjs')
var cookie = require('cookie-parser')
const jsonwt = require('jsonwebtoken')
const passport = require('passport')
const passportjwt = require('passport-jwt')
const jsonwtStrategy = passportjwt.Strategy;
const extractjwt = passportjwt.ExtractJwt;
const settings = require('../../config/settings')

// Import sale schema
const Sale = require('../../models/Sale')

const Person = require('../../models/Person')

passport.use(new jsonwtStrategy({
    jwtFromRequest: extractjwt.fromAuthHeaderAsBearerToken,
    secretOrKey: settings.secret
},
function(jwtpayload, cb) {
    console.log(jwtpayload.id);
}));

router.use(cookie())
//Step 2.1
router.post('/add', (req, res) => {
    //Checks if oid already exists or not
    Sale
        .findOne({ _id: mongoose.Types.ObjectId(req.body.oid) })
        .then(sale => {
            if (sale) {
                console.log(sale);
                res.status(400).send('Object ID already exists!')
            } else {

                const sale = Sale({
                    _id: req.body._id,
                    saleDate: req.body.date,
                    items: [{
                        _id: req.body.item_id,
                        name: req.body.item_name,
                        tags: req.body.item_tags,
                        price: req.body.item_price,
                        quantity: req.body.item_quantity
                    }],
                    storeLocation: req.body.storeLocation,
                    customer: {
                        gender: req.body.customer_gender,
                        age: req.body.customer_age,
                        email: req.body.customer_email,
                        satisfaction: req.body.customer_satisfaction
                    },
                    couponUsed: req.body.couponUsed,
                    purchaseMethod: req.body.purchaseMethod
                })

                // add new document to the collection.
                sale
                    .save()
                    .then(sale => res.send(sale))
                    .catch(err => res.send(err.message))
            }
        })
        .catch(err => res.send(err))
})

// Step 2.6 Extra Challenge
router.get('/val', celebrate({
    query: Joi.object({
        page: Joi.number().integer().min(1),
        perPage: Joi.number().integer().min(1),
        storeLocation: Joi.string().allow(''),
    })
}), async(req, res) => {
    const { page, perPage, storeLocation } = req.query;

    const query = {};
    if (storeLocation) {
        query.storeLocation = storeLocation;
    }

    const options = {};
    if (page && perPage) {
        options.limit = Number(perPage);
        options.skip = (Number(page) - 1) * Number(perPage);
    }

    try {
        const sales = await Sale.find(query, {}, options).lean();
        console.log(sales);

        res.render('hbs_result', { sales: sales });
    } catch (error) {
        res.status(500).send(error);
    }
});

//Step 2.5
// router.get('/', async(req, res) => {
//     const { page, perPage, storeLocation } = req.query;

//     const query = {};
//     if (storeLocation) {
//         query.storeLocation = storeLocation;
//     }

//     const options = {};
//     if (page && perPage) {
//         options.limit = Number(perPage);
//         options.skip = (Number(page) - 1) * Number(perPage);
//     }

//     try {
//         const sales = await Sale.find(query, {}, options);
//         res.send(sales);
//     } catch (error) {
//         console.log(query, options);
//         res.status(500).send(error);
//     }
// });

//Step 2.6 Extra Challenge
// router.get('/val', celebrate({
//     query: Joi.object({
//         page: Joi.number().integer().min(1),
//         perPage: Joi.number().integer().min(1),
//         storeLocation: Joi.string().allow(''),
//     })
// }), async(req, res) => {
//     const { page, perPage, storeLocation } = req.query;

//     const query = {};
//     if (storeLocation) {
//         query.storeLocation = storeLocation;
//     }

//     const options = {};
//     if (page && perPage) {
//         options.limit = Number(perPage);
//         options.skip = (Number(page) - 1) * Number(perPage);
//     }

//     try {
//         const sales = await Sale.find(query, {}, options);
//         res.send(sales);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

//Step 2.7
router.get('/get/:_id', (req, res) => {
    Sale
        .findOne({ _id: req.params._id })
        .then(sale => res.send(sale))
        .catch(err => console.log(err))
})


//Step 2.8
router.put('/update/:_id', (req, res) => {
    Sale
        .findOne({ _id: mongoose.Types.ObjectId(req.params._id) })
        .then(sale => {
            if (!sale) {
                res.status(400).send('Object ID does not exists!')
            } else {
                Sale.updateOne({ isbn: req.params._id }, {
                        $set: {
                            _id: req.body._id,
                            saleDate: req.body.date,
                            items: [{
                                _id: req.body.item_id,
                                name: req.body.item_name,
                                tags: req.body.item_tags,
                                price: req.body.item_price,
                                quantity: req.body.item_quantity
                            }],
                            storeLocation: req.body.storeLocation,
                            customer: {
                                gender: req.body.customer_gender,
                                age: req.body.customer_age,
                                email: req.body.customer_email,
                                satisfaction: req.body.customer_satisfaction
                            },
                            couponUsed: req.body.couponUsed,
                            purchaseMethod: req.body.purchaseMethod
                        }
                    })
                    .exec()
                    .then(() => {
                        res.status(201).send('Update successfull!')
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }

        })
})

router.delete('/delete/:_id', (req, res) => {
    Sale
        .findOne({ _id: mongoose.Types.ObjectId(req.params._id) })
        .then(sale => {
            if (!sale) {
                res.status(400).send('Object ID does not exists!')
            } else {
                Sale.deleteOne({ _id: req.params._id })
                    .exec()
                    .then(() => {
                        res.status(201).send('Sale Record Deleted.')
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
})
router.get("/hbs_sales", async(req, res) => {
    const sale = await Sale.find({}).lean();
    console.log(typeof sale);
    res.render(
        'hbs_sales', {
            salesData: sale,
        }
    )
});
router.get("/hbs_result", async(req, res) => {
    const sale = await Sale.find({}).lean();
    console.log(typeof sale);
    res.render(
        'hbs_sales', {
            salesData: sale,
        }
    )
});

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
});

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

});

// Private route to get all user details
router.post('/get', passport.authenticate('jwt', { session: false }), async(req, res) => { // middleware from passport-jwt
    // passport.authenticate('jwt', { session: false }),
    // const jwt_token = req.header.authorization;
    // const token = jwt_token && jwt_token.split(' ')[1];
    // const cursor = await Person.find()
    const user = (req.user.username);
    res.redirect('/api/sale/hbs_display?username=' + user, )
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