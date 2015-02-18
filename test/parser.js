var expect = require("chai").expect;
var parser = require("../index");
var express = require("express");
var rootPath = require("path").join(__dirname, "./actions");

describe("parser", function () {
    it("should throw an exception when action can't be found", function () {
        expect(function () {
            parser(express(), {
                "some_pattern": {
                    "action": "some_unknown_action"
                }
            }, rootPath);
        }).to.throw(Error);

    });


    it("should add a handler when no sub router set", function () {
        var app = express();

        var config = {
            "pattern_with_out_sub": {
                "action": "./single",
                "result": {
                    "success": "test.jade"
                }
            }
        };

        parser(app, config, rootPath);


    });
});