
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const port = 7000
const route = require('./Routes/route');
const bodyParser = require('body-parser');
const { connect, connection } = require('mongoose');
//-----------------------------------
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { createModulerLogger } = require("./LoggerServices/loggerservices");
const logger = createModulerLogger("app.js")
//-------------------------------------database configration---------------------------------------
 connect('mongodb+srv://mendiratta2000:mendiratta@nftmarketplace.pf01l6q.mongodb.net/test');

const mongodbconfig = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}
connection.on('connected', () => logger.info('Database is Connected Succesfully'));

connection.on('connection', () => logger.error('Error is Occuring on Database'));

// const uri = `mongodb://${process.env.DB_HOST}/${process.env.DATABASE_NAME}`
// connect(uri, mongodbconfig).catch(error => {
//     logger.error("Error is Occuring on Database")
// })


//---------------------------------------------
app.use('/apis', route);
app.get('', (req, res) => {
    logger.info("app is running successfully");
    res.send("app is running successfully");

});

app.listen(7000, () => {
    console.log(`Server is Running on Port  http://localhost:${port}/`);
});

