var express = require('express'),
	app = express();

var bodyParser = require('body-parser'),
	router = express.Router();

var connection  = require('express-myconnection'),
    mysql = require('mysql');

// First Router path
router
	.use(function (req, res, next) {
		// If user id is not supplied then just set it to 1 (default)
		//if (!req.user) req.user = {id: 1};  
		next();
	})
	.use(bodyParser.json())
	.route('/rxnormtable')
	.get(function (req, res) {
            console.log('11111DEEPAKDEEPAKDEEPAK');
		var connection1 = mysql.createConnection({
  				host     : 'localhost',
        		user     : 'root',
        		password : 'admin',
        		database : 'rxnormcds',
		});

		connection1.connect();

        var query = connection1.query('show tables',function (err, rows, fields) {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            connection1.end();
            res.json(rows);
         });
	});

// First Router path
router
	.get('/tdetails/:tableName', function (req, res) {

        console.log('router DEEPAKDEEPAKDEEPAK');
        console.log('tableName=' + req.paramas.tableName);
		
            res.json(req.params.tableName);
 //        });
	});

module.exports = router;