"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
	text: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	votes: { type: Number, default: 0 }
});

// UPDATE ANSWER
// THIS IS EQUEVLENT TO AnswerSchema.method.update = function(){}
AnswerSchema.method("update", function(updates, callback) {
	// Answer === this
	//Copy updates into (this) object and override updateAt with new Date()
	Object.assign(this, updates, { updatedAt: new Date() });
	// save changes to question document
	this.parent().save(callback);
});

//UPDATE VOTES ON ANSWER
AnswerSchema.method("vote", function(vote, callback) {
	if (vote === "up") {
		this.votes += 1;
	} else {
		this.votes -= 1;
	}
	// save changes
	this.parent().save(callback);
});

const QuestionSchema = new Schema({
	text: String,
	createdAt: { type: Date, default: Date.now },
	answers: [AnswerSchema]
});

// SORT ANSWERS BEFORE SAVING TO ANSWERS ARRAY
QuestionSchema.pre("save", function(next) {
	this.answers.sort(function(a, b) {
		// -negative -> a before b
		// 0 -> no change
		// +positive -> a after b
		if (a.votes === b.votes) {
			// if votes are equal then sort by updatedAt date
			return b.updatedAt - a.updatedAt;
		}

		// if a.votes larget then b.votes it will return a negative which will put a before b
		// if b.votes larget then a.votes it will return a postive which will put b before a
		return b.votes - a.votes;
	});
	next();
});

// const Question = mongoose.model("Question", QuestionSchema);

module.exports = mongoose.model("Question", QuestionSchema);
