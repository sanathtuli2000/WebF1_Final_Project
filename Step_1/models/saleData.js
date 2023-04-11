/****************************************************************************** 
* ITE5315 – Final Project 
* I declare that this assignment is my own work in accordance with Humber Academic Policy. * 
No part of this assignment has been copied manually or electronically from any other source * 
(including web sites) or distributed to other students. 
* 
* Name: Sanath Tuli_ Student ID: __N01473612__ Date: 5th April, 2023_____ 
* Name: Vivian Rishi Student ID: __N01495807__ Date: 5th April, 2023_____ 
* Name: Murtuza Barodawala  Student ID: __N01484449__ Date: 5th April, 2023_____ 
* 
*******************************************************************************/

const mongoose = require('mongoose');
var Schema1 = mongoose.Schema
const SaleSchema = new mongoose.Schema({

    _id: {
        $oid: {
            type: Schema1.ObjectId,
            required: true
        },
    },
    saleDate: {
        $date: {
            $numberLong: String,
        },
    },
    items: [{
        name: String,
        tags: [String],
        price: {
            $numberDecimal: String
        },
        quantity: Number,
        _id: false

    }],
    storeLocation: String,
    customer: {
        gender: String,
        age: String,
        email: String,
        satisfaction: Number
    },
    couponUsed: Boolean,
    purchaseMethod: String
});

const Sale = mongoose.model('Sale', SaleSchema);
module.exports = Sale;