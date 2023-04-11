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

// Import sale schema
const Sale = require('../../models/Sale')

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



module.exports = router