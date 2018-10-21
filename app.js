var express = require('express');
var accountServices = require('./accountServices');
var bodyParser = require('body-parser');
var app = new express();
var routes = require('./routes');
app.listen(8080);
app.use(bodyParser.json());
var accountServicesInstance = new accountServices({});
routes(app, accountServicesInstance);
console.log("server started")