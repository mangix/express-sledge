var parser = require("../lib/parser");

parser({
    "/": {
        "controller": "index",
        "method": "execute",
        "result": {
            "success": "index.jade",
            "error": "error.jade"
        }
    }
}, __dirname + "/routes");
