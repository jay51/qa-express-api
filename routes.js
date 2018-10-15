"use strict";

const router = require("express").Router();
const Question = require("./models");

// This is a params meddelware for qID
router.param("qID", function(req, res, next, id) {
	Question.findById(id, function(err, question) {
		if (err) return next(err);
		if (!question) {
			error = new Error("Not Found");
			res.status = 404;
			return next(err);
		}
		req.question = question;
		return next();
	});
});

// This is a params meddelware for aID
router.param("aID", function(req, res, next, id) {
	// find answer inside answers list
	req.answer = req.question.answers.id(id);
	if (!req.answer) {
		error = new Error("Not Found");
		res.status = 404;
		return next(err);
	}
	return next();
});

// GET /questions
router.get("/", function(req, res, next) {
	Question.find({})
		.sort({ createdAt: -1 })
		.exec(function(err, questions) {
			if (err) return next(err);
			res.json(questions);
		});
});

// POST /questions
router.post("/", function(req, res, next) {
	const question = new Question(req.body);
	question.save(function(err, question) {
		if (err) return next(err);
		res.status(201);
		res.json(question);
	});
});

// GET /questions/:qID
router.get("/:qID", function(req, res, next) {
	console.log("question ID:", req.question);
	if (res.question) return res.json(res.question);
	else {
		Question.findById(req.params.qID, function(err, question) {
			if (err) return next(err);
			res.json(question);
		});
	}
});

// POST /questions/:qID/answers
router.post("/:qID/answers", function(req, res) {
	req.question.answers.push(req.body);
	req.question.save(function(err, question) {
		if (err) return next(err);
		res.status(201);
		res.json(question);
	});
});

// PUT /questions/:qID/answers/aID
router.put("/:qID/answers/:aID", function(req, res) {
	// call instance method on answer
	req.answer.update(req.body, function(err, result) {
		if (err) return err;
		res.json(result);
	});
});

// DELETE /questions/:qID/answers/aID
router.delete("/:qID/answers/:aID", function(req, res) {
	// remove is a mongoose method
	// req.answer is defined and passed in the params middelware
	req.answer.remove(function(err) {
		// req.question is defined and passed in the params middelware
		req.question.save(function(err, question) {
			if (err) return err;
			res.json(question);
		});
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
			// set a variable
			req.vote = req.params.dir;
			next();
		}
	},
	function(req, res, next) {
		// req.answer is defined and passed down in the params middelware
		req.answer.vote(req.vote, function(err, question) {
			if (err) return err;
			res.json(question);
		});
	}
);

module.exports = router;
