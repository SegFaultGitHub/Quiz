"use strict";

var express = require("express");
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.listen(1234);

app.use("/quiz", require("./quiz.js"));