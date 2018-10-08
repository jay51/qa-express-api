"use strict";

const mongoose = require("mongoose");

mongoose.connect(
	"mongodb://localhost:27017/sandbox",
	{ useNewUrlParser: true }
);
const db = mongoose.connection;

db.on("error", function(err) {
	console.error("connection error", err);
});

db.once("open", function() {
	console.log("db connection successful");
	// All DB communication goes here!

	const Schema = mongoose.Schema;
	const AnimalSchema = new Schema({
		type: String,
		size: String,
		color: String,
		mass: Number,
		name: String
	});

	// create mongoose model
	const Animal = mongoose.model("Animal", AnimalSchema);

	const cat = new Animal({
		type: "cat",
		size: "small",
		color: "blue",
		mass: 50,
		name: "muphin"
	});

	cat.save(function(err) {
		if (err) console.log("save Failed", err);
		else console.log("saved!");
		db.close(function() {
			console.log("db closed!");
		});
	});
});
