
require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const route = require('./Routes/route');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));    
app.use(bodyParser.json());

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://mendiratta2000:mendiratta@nftmarketplace.pf01l6q.mongodb.net/test');

mongoose.connection.on('connected', connected => {
    console.log('Connected to db');
});


app.use('/apis', route);
app.get('', (req, res) => {
    console.log("app is running successfully ");
    debugger;
});

app.listen(7000, () => {
    console.log("Server is listening on port number 7000");
});

