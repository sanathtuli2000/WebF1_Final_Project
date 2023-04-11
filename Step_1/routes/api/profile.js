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
const exphbs = require('express-handlebars')

const saleData = require('../../models/saleData')

router.get('/', (req, res) => res.send('Profile related routes'))

router.get('/get', async(req, res) => {

    // without cursor.
    const sale = await saleData.find({});
    try {
        res.send(sale);
        console.log(sale);
    } catch (error) {
        res.status(500).send(error);
    }

    // with cursor
    // const cursor = await Person.find()
    // cursor.forEach(function(myDoc) {
    //     console.log( myDoc ); 
    // })
})

module.exports = router