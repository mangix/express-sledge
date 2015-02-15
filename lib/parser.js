/**
 * Created by mangix on 1/31/15.
 *
 * Parse JSON config to Express.Router
 */

var express = require("express");
var path = require("path");
var DEFAULT_METHOD = "execute";
var SUB_KEY = "subs";


/**
 * parse json config
 * @param router{express.Router}
 * @param config{Object} , json config object , format like './config.json'
 * @param baseRoutePath{String} , base path for the controllers
 * */
var parser = module.exports = function (router, config, baseRoutePath) {

    //parse all objects to router
    Object.keys(config).forEach(function (pattern) {
        var cfg = config[pattern];

        var controller = parseOne(pattern, cfg, baseRoutePath);

        if (controller && controller.controller) {
            router.use(controller.url, controller.controller);
        }

        if (cfg[SUB_KEY] && cfg[SUB_KEY].length) {

            var expressRouter = express.Router();

            router.use(pattern, expressRouter);

            parser(expressRouter, cfg[SUB_KEY], baseRoutePath);
        }
    });
};


/**
 * parse a single router
 * @returns {Object} {
 *      url:url,
 *      controller:controller
 * }
 * */
var parseOne = function (pattern, config, baseRoute) {
    if (!config.controller) {
        //if no controller , return
        return null;
    }

    //the method to be executed of the controller when http request comes, not the "GET" or "POST" type
    var method = config.method || DEFAULT_METHOD;

    //views options
    var views = config.result;

    //get the controller file , using path.join
    var action = require(path.join(baseRoute, config.controller));

    if (!action || !action[method]) {
        return null;
    }

    method = action[method];

    var controller = {};
    controller.url = pattern;
    controller.controller = function (req, res) {
        //add this method to Express.Request , call this method to determine which view to render
        res.result = function (code, data) {
            //find view
            if (views[code]) {
                res.render(views[code], data);
            } else {
                //TODO throw an error of no view found
            }
        };

        //call the origin method
        method.apply(method, Array.prototype.slice.call(arguments, 0));
    };

    return controller;
};
