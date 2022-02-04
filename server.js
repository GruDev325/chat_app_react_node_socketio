const express = require("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const passport = require("passprot");
const cors = require("cors");

const app = express();

// Port that the webserver listens to 
const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`Server running on port ${PORT}`))

const io = require("socket.io").listen(server);

// Body Parser middleware to parse request bodies

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());