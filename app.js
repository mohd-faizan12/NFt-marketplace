require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = 7000;
const route = require("./Routes/route");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//-----------------------------------
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { createModulerLogger } = require("./LoggerServices/loggerservices");
const logger = createModulerLogger("app.js");
//-------------------------------------database configration---------------------------------------

const uri = `mongodb://${process.env.DB_HOST}/${process.env.DATABASE_NAME}`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", (connected) => {
  console.log("Connected to db");

  app.listen(7000, () => {
    console.log(`Server is Running on Port  http://localhost:${port}/`);
  });
});
mongoose.connection.on("error", function (err) {
  throw new Error(err);
});

//---------------------------------------------
app.use("/apis", route);
app.get("", (req, res) => {
  logger.info("app is running successfully");
  res.send("app is running successfully");
});
