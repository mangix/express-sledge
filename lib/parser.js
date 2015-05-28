/**
 * Created by mangix on 1/31/15.
 *
 * Parse JSON config to Express.Router
 */

var express = require("express");
var path = require("path");
var DEFAULT_METHOD = "execute";
var SUB_KEY = "subs";
var winston = require("winston");


/**
 * parse json config
 *
 * @param router{express.Router}
 * @param config{Object} , json config object formatting like './config.json'
 * @param baseRoutePath{String} , base path for the actions
 * */
var parser = module.exports = function (router, config, baseRoutePath) {

    //parse all objects to router
    Object.keys(config).forEach(function (pattern) {
        var cfg = config[pattern];

        var controller = parseOne(pattern, cfg, baseRoutePath);

        if (controller && controller.action) {
            router.all(controller.url, controller.action);
        }

        if (cfg[SUB_KEY] && Object.keys(cfg[SUB_KEY]).length) {

            var expressRouter = express.Router();

            parser(expressRouter, cfg[SUB_KEY], baseRoutePath);

            router.use(pattern, expressRouter);
        }
    });
};


/**
 * parse a single router
 * @returns {Object} {
 *      url:url,
 *      action:action
 * }
 * */
var parseOne = function (pattern, config, baseRoute) {
    if (!config.action) {
        //if no action , return
        winston.error("Parse Router Error: action required");
        return null;
    }

    //the method to be executed of the action when http request comes, not the "GET" or "POST" type
    var method = config.method || DEFAULT_METHOD;

    //views options
    var views = config.result;

    //get the action file , using path.join
    var action;
    var actionFilePath = path.join(baseRoute, config.action);
    try {
        action = require(actionFilePath);
    }catch(e){
        winston.error("Parse Router Error: action file:"+ actionFilePath+" not found");
        throw e;
    }

    if (!action || !action[method]) {
        winston.error("Parse Router Error: method "+ method+" not found in "+ actionFilePath);
        return null;
    }

    method = action[method];

    var controller = {};
    controller.url = pattern;
    controller.action = function (req, res) {
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
