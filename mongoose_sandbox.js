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
		size: String,
		color: { type: String, default: "orange" },
		mass: { type: Number, default: "10" },
		name: { type: String, default: "nick" }
	});

	// pre "save" hocks let you do something to the document before it's saved
	AnimalSchema.pre("save", function(next) {
		if (this.mass >= 100) {
			this.size = "big";
		} else if (this.mass >= 5) {
			this.size = "medium";
		} else {
			this.size = "smalll";
		}
		next();
	});

	//static methods are a coustme method we can call on the model
	//costume find query to find animals by size
	AnimalSchema.statics.findBySize = function(size, callback) {
		// this == Animal
		return this.find({ size }, callback);
		// callback will be passed the find result
	};

	// instance methods are custome methods we can call on the instance
	// instance method to find all animals with the same color as the instance
	AnimalSchema.methods.findBySameColor = function(callback) {
		// this == instance/document
		// search the animal model for animals with same color as current animal
		return this.model("Animal").find({ color: this.color }, callback);
	};

	// create mongoose model
	const Animal = mongoose.model("Animal", AnimalSchema);

	const cat = new Animal({
		type: "cat",
		size: "small",
		color: "blue",
		mass: 50,
		name: "muphin"
	});

	const whale = new Animal({
		type: "whale",
		size: "big",
		mass: 3444,
		name: "fig"
	});

	const animalData = [
		{
			type: "mouse",
			color: "gray",
			mass: 3.2,
			name: "marvin"
		},
		{
			type: "bird",
			color: "white",
			mass: 6.4,
			name: "slick"
		},
		{
			type: "wolf",
			color: "black",
			mass: 45.4,
			name: "Iron"
		},
		cat,
		whale
	];

	Animal.remove({}, function(err) {
		if (err) console.error("some err", err);
		Animal.create(animalData, function(err, animals) {
			if (err) console.error("error when creating new instance");

			animals.forEach(function(animal) {
				console.log(
					`${animal.name} the ${animal.color} ${animal.type} is a ${
						animal.size
					}`
				);
			});

			// Animal.find({}, function(err, all) {
			// 	console.log(err);
			// });
			// Animal.findBySize("small", function(err, animal) {
			// 	console.log(
			// 		`${animal.name} the ${animal.color} ${animal.type} is a ${
			// 			animal.size
			// 		}`
			// 	);
			// });

			// Animal.findOne({ type: "cat" }, function(err, cat) {
			// 	cat.findBySameColor(function(err, animals_with_same_color_as_cat) {
			// 		console.log(animals_with_same_color_as_cat);
			// 	});
			// });

			db.close(function() {
				console.log("db connection closed");
			});
		});
	});
});
