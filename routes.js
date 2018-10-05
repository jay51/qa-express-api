"use strict";

const router = require("express").Router();

// GET /questions
router.get("/", function(req, res) {
	// return all questions
	// const o = obj.prop; // this will throw error status code 500
	res.json({
		response: "You sent me a GET request"
	});
});

// POST /questions
router.post("/", function(req, res) {
	// create  question
	res.json({
		response: "You sent me a POST request",
		body: req.body
	});
});

// GET /questions/:qID
router.get("/:qID", function(req, res) {
	// return questions with qID
	res.json({
		response: "You sent me a GET request for qID " + req.params.qID
	});
});

// POST /questions/:qID/answers
router.post("/:qID/answers", function(req, res) {
	// create new answer
	res.json({
		response: "You sent me a POST request for new answer",
		questionId: req.params.qID,
		body: req.body
	});
});

// PUT /questions/:qID/answers/aID
router.put("/:qID/answers/:aID", function(req, res) {
	// edit  answer
	res.json({
		response: "You sent me a put request for edit answer",
		questionId: req.params.qID,
		answerId: req.params.aID,
		body: req.body
	});
});

// DELETE /questions/:qID/answers/aID
router.delete("/:qID/answers/:aID", function(req, res) {
	// delete  answer
	res.json({
		response: "You sent me a delete request  answer",
		questionId: req.params.qID,
		answerId: req.params.aID
	});
});

// post /questions/:qID/answers/vote-:dir
router.post(
	"/:qID/answers/:aID/vote-:dir",
	function(req, res, next) {
		if (req.params.dir.search(/^(up|down)$/) === -1) {
			const err = new Error("Not Foound");
			err.status = 404;
			next(err);
		} else {
			next();
		}
	},
	function(req, res) {
		// post  vote
		res.json({
			response: "You sent me a POST request for edit answer",
			questionId: req.params.qID,
			answerId: req.params.aID,
			vote: req.params.dir
		});
	}
);

module.exports = router;
