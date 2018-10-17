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

// middelware for cros
app.use(function(req, res, next) {
	// modififes the header on the response to let the broswer know what it can and can't do.
	// restricts the api to the domains which are allowed to access the api. * means everyone allowed
	res.header("Access-Control-Allow-Origin", "*");
	// tells the browser which headers are permited/allowed
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	// check for a pref-light request, pref-light requests come with req.method=Options
	if (req.method === "OPTIONS") {
		// req.method=options isn't handeld by any of our routes, so let's handle it here!
		// return response with header to let the browser know the methods allowed in this api
		res.header("Access-Control-Allow-Method", "GET POST PUT DELETE");
		return res.status(200).json({});
	}
	next();
});

// questions routes
app.use("/questions/", routes);

// when no route matches the route requsted
// this middleware will send 404 errors to error handler. without this middleware
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
	console.log("server has started on port:" + port);
});
