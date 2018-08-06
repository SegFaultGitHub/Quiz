"use strict";

var express = require('express');
var router = express.Router();
var clone = require("clone");

var questions = require("./questions.json");

function shuffle(array) {
    var result = [];
    var temp = clone(array);
    while (temp.length) {
        var index = Math.floor(Math.random() * temp.length);
        result.push(temp.splice(index, 1)[0]);
    }
    return result;
}

function checkExistance(req, res, next) {
    if (!questions[req.params.id]) return res.sendStatus(404);
    else {
        req.question = clone(questions[req.params.id]);
        return next();
    }
}

router.get('/question/random', function (_, res) {
    var ids = Object.keys(questions);
    var id = ids[Math.floor(Math.random() * ids.length)];

    var question = clone(questions[id]);
    question.choices = shuffle(question.choices);

    return res.send(question);
});

router.get('/question/:id', checkExistance, function (req, res) {
    req.question.choices = shuffle(req.question.choices);

    return res.send(req.question);
});

router.get("/hint/:id/:index", checkExistance, function (req, res) {
    var index = Number(req.params.index);
    if (index === NaN) return res.sendStatus(400);
    return res.send(req.question.hints[index]);
});

router.post("/answer/:id", checkExistance, function (req, res) {
    if (!req.body.answer) return res.sendStatus(400);

    var index = req.question.choices.map(function (item) {
        return item.toLowerCase();
    }).indexOf(req.body.answer.toLowerCase());

    if (index === -1) return res.sendStatus(400);
    else return res.send(index === 0);
});

module.exports = router;