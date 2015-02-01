/**
 * Created by mangix on 1/31/15.
 */

var parse = require("./lib/parser");
module.exports = function (app, config, baseRoutePath) {
    parse(config, baseRoutePath).forEach(function (router) {
        app.use(router.url, router.controller);
    });
};