"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes");
const logger = require("morgan");
const mongoose = require("mongoose");

app.use(logger("dev"));
app.use(bodyParser.json());

// connecting DB

mongoose.connect(
	"mongodb://localhost:27017/qa",
	{ useNewUrlParser: true }
);
const db = mongoose.connection;

db.on("error", function(err) {
	console.error("Connection Error:", err);
});

db.once("open", function() {
	console.log("db connection successful");
});

// questions routes
app.use("/questions/", routes);

// when no route matches the route requsted
//  this middleware will send 404 errors to error handler. without this middleware
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
});

// Error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

const port = process.env.PORT || 3000;
app.listen(port, function(err) {
	console.log("server has started");
});
