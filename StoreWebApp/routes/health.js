var express = require('express');
var app = express();
var router = express.Router();

router.get('/', function (req, res, next) {
	res.json({status: 'UP'});
});

app.use("/health", router);

module.exports = app;