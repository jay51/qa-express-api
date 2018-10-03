"use strict";

const router = require("express").Router();

// GET /questions
router.get("/", function(req, res) {
	// return all questions
	res.json({
		response: "You sent me a GET request"
	});
});

// POST /questions
router.post("/", function(req, res) {
	// return all questions and body
	res.json({
		response: "You sent me a POST request",
		body: req.body
	});
});

// GET /questions/:id
router.get("/:id", function(req, res) {
	// return questions with id
	res.json({
		response: "You sent me a GET request for ID " + req.params.id
	});
});

module.exports = router;
