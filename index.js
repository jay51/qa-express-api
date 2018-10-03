"use strict";

const express = require("express");
const app = express();

// Applecation level middelware
app.use(function(req, res, next) {
	console.log("first midd");
	req.myMsg = "hello middelware";
	next();
});

// Applecation level middelware mounted to a route
app.use("/dif/:id", function(req, res, next) {
	// req.params hold route values in url
	console.log("second midd ID:", req.params.id);
	// To show that you can pass data from one route or middelware to another
	console.log("second midd myMsg:", req.myMsg);
	// req.query is query for searching items.
	console.log("second midd color query-string:", req.query.color);
	next();
});

const port = process.env.PORT || 3000;
app.listen(port, function(err) {
	console.log("server has started");
});
