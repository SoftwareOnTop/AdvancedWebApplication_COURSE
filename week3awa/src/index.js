"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app = (0, express_1.Router)();
app.get("/hello", function (req, res) {
    res.json({ msg: "Hello world!" });
});
app.get("/echo/:id", function (req, res) {
    var id = req.params.id;
    res.json({ msg: id });
});
app.post("/sum", function (req, res) {
    var result = 0;
    for (var i = 0; i < req.body.numbers.length; i++) {
        result += req.body.numbers[i];
    }
    res.json({ sum: result });
});
exports.default = app;
