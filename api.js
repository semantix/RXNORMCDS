var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	router = express.Router(),
	connection  = require('express-myconnection'),
    mysql = require('mysql');

// First Router path
router
	.use(bodyParser.json())
	.route('/rxnormtable')
	.get(function (req, res) {
            //console.log('11111DEEPAKDEEPAKDEEPAK');
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

router
.param('tableName', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .route('/tdetails/:tableName')
        .get(function (req, res) {
            
            //console.log('router DEEPAKDEEPAKDEEPAK');
        	//console.log('tableName=' + req.params.tableName);
		
            var connection1 = mysql.createConnection({
  				host     : 'localhost',
        		user     : 'root',
        		password : 'admin',
        		database : 'rxnormcds',
		});

		connection1.connect();

		var tn = req.params.tableName;

        var query = connection1.query('select count(*) from ' + tn, function (err, rows, fields) {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            connection1.end();
            res.json(rows);
          });
        })
        .put(function (req, res) {
            var contact = req.body;
            delete contact.$promise;
            delete contact.$resolved;
            db.update(req.dbQuery, contact, function (err, data) {
                res.json(data[0]);
            });
        })
        .delete(function (req, res) {
            db.delete(req.dbQuery, function () {
                res.json(null);
            });
        });

module.exports = router;