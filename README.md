# express-sledge

[![Build Status](https://travis-ci.org/mangix/express-sledge.svg?branch=master)](https://travis-ci.org/mangix/express-sledge)

A simple way to config URL , Controller , View of express based web app

### how to use

- write a config file `router.json` , config url,controller,view

```js

	{
    	"/": {
        	"action": "index",
        	"method": "execute",
        	"result": {
            	"success": "/view/index.jade",
            	"error": "/view/error.jade"
        	}
    	},
    	"/product": {
            "subs": {
                "/intro": {
                    "action": "product/intro",
                    "result": {
                        "success": "/view/product/intro.jade",
                        "error": "/view/product/error.jade"
                    }
                },
                "/:productId": {
                    "action": "product/detail",
                    "result": {
                        "success": "/view/product/detail.jade"
                    }
                }
            }
        }
    }

```

- in app.js 
 
	```js
	
	    var sledge = require("express-sledge");
		sledge(app, require("./router.json"),path.join(__dirname, "routes"));
	
	```
	
- write a controller , `index.js`

	```js
	
		exports.execute = function(req,res){
			//just like express.router function
			
			//this will render the configured view
			res.result("success",{data:""});
			
			//if something goes wrong , you can render the error view
			res.result("error");
			
			//you can also call the any methods of  express.Response
			res.send("welcome");
			
		}
	
	```

- Finish ! visit localhost:3000

For more details , run `./example/bin/www` .



### API

- sledge(urlPattern , config , baseControllerPath);

	- `urlPattern` any pattern supported by express

	- `config` Object , see [lib/config.json](./lib/config.json)

	- `baseControllerPath` path of routers directory. `require("path").join(__dirname , "routes")`
	
	This will parse the config to express.Router and add function `result` to `express.Response` . You can use this function to choose which view to render.  Of course , you can still use express.Response.render or other functions.


	

