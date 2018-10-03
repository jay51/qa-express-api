"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes");

const checkJson = function(req, res, next) {
	if (req.body) {
		console.log("The sky is", req.body.color);
	} else {
		console.log("There's no body property");
	}
	next();
};
// befor using body parser the req.body don't exist
app.use(checkJson);
// body parser middel for json parser
app.use(bodyParser());
// now req.body exist
app.use(checkJson);

// questions routes
app.use("/questions/", routes);

const port = process.env.PORT || 3000;
app.listen(port, function(err) {
	console.log("server has started");
});
