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
		type: { type: String, default: "goldfish" },
		size: { type: String, default: "small" },
		color: { type: String, default: "orange" },
		mass: { type: Number, default: "10" },
		name: { type: String, default: "nick" }
	});

	// create mongoose model
	const Animal = mongoose.model("Animal", AnimalSchema);

	// remove everything in the Animal model
	Animal.deleteMany({}, function(err) {
		if (err) console.log(err);

		const cat = new Animal({
			type: "cat",
			size: "small",
			color: "blue",
			mass: 50,
			name: "muphin"
		});

		const anotherAnimal = new Animal({}); // goldfish

		const whale = new Animal({
			type: "whale",
			size: "big",
			mass: 3444,
			name: "fig"
		});

		cat.save(function(err) {
			if (err) console.log("save Failed", err);
			else console.log("saved!");

			anotherAnimal.save(function(err) {
				if (err) console.log("save Failed", err);

				whale.save(function(err) {
					if (err) console.log("save Failed", err);

					// find animals
					Animal.find({}, function(err, animals) {
						console.log(animals);
						// animals.forEach(function(anim) {
						// 	console.log(`${anim.name} the ${anim.color} ${anim.type}`);
						// });
					});

					db.close(function() {
						console.log("db closed!");
					});
				});
			});
		});
	});
});
