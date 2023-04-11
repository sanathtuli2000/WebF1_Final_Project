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

const mongoose = require('mongoose');
var Schema1 = mongoose.Schema
const SaleSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    saleDate: {
        $date: {
            $numberLong: String,
        },
    },
    items: [{
        name: String,
        tags: [String],
        _id: { type: mongoose.Schema.Types.ObjectId },
        price: {
            $numberDecimal: String
        },
        quantity: Number,

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

module.exports = Sale = mongoose.model('Sale', SaleSchema);