/**
 * Created by mangix on 1/31/15.
 *
 * Parse JSON config to Express.Router
 */

var express = require("express");
var path = require("path");
var DEFAULT_METHOD = "execute";


module.exports = function (config, baseRoutePath) {
    var routers = [];
    Object.keys(config).forEach(function (url) {
        var cfg = config[url];
        if (cfg.subs && Object.keys(cfg.subs).length) {

        } else {
            routers.push(parseOne(url, cfg, baseRoutePath));
        }
    });

    return routers;

};


var parseOne = function (url, config, baseRoute) {
    if (config.controller) {
        var method = config.method || DEFAULT_METHOD;
        var views = config.result;

        var action = require(path.join(baseRoute, config.controller));
        if (action && action[method]) {
            method = action[method];
            return {
                url: url,
                controller: function (req, res) {
                    res.result = function (code, data) {
                        //find view
                        if (views[code]) {
                            res.render(views[code], data);
                        }
                    };

                   method.apply(method, Array.prototype.slice.call(arguments, 0));
                }
            }
        }
    }
};

