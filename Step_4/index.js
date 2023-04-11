/****************************************************************************** 
* ITE5315 – Assignment 3 
* I declare that this assignment is my own work in accordance with Humber Academic Policy. * 
No part of this assignment has been copied manually or electronically from any other source * 
(including web sites) or distributed to other students. 
* 
* Name: __Sanath Tuli_ Student ID: __N01473612__ Date: _20th March, 2023_____ 
* 
* 
*******************************************************************************/

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
require('dotenv').config();

const port = process.env.PORT || 8000

const app = express()

// setup handlebars
app.engine(
    '.hbs',
    exphbs.engine({
        extname: '.hbs',
    })
)

app.set(
    'view engine',
    '.hbs'
)


// middleware for bodyparser
app.use(bodyParser.urlencoded({ extended: false }))

// get settings
const settings = require('./config/settings')

// mongo db url
const db = settings.mongoDBUrl

// attempt to connect with DB
// Step 2.1
mongoose
    .connect(db)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.log(err))

// Get profile routes
const sale = require('./routes/api/sale')

app.get('/', (req, res) => {
    res.send('Project is Running')
})

// actual routes
app.use('/api/sale', sale)

app.listen(port, () => console.log(`App running at port : ${port}`))