var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	router = express.Router(),
	connection  = require('express-myconnection'),
    mysql = require('mysql');

var connection1 = mysql.createConnection({
                host     : 'localhost',
                user     : 'root',
                password : 'admin',
                database : 'rxnormcds',
        });

connection1.connect();


router
    .use(bodyParser.json())
    .route('/scds')
    .get(function (req, res, next) 
    {
        var queryStr = 'select a.SCD_rxcui, a.review_status, b.DF_str ' +
                          ' from scd_review a, scd_df b ' +
                          ' where a.SCD_rxcui = b.SCD_rxcui and ' +
                          ' a.review_status = "Incomplete" ' +
                          ' order by a.review_priority, a.SCD_rxcui limit 5';

        var query = connection1.query(queryStr  ,function (err, rows, fields) 
        {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //connection1.end();
            res.json(rows);
         });
    });

    router
    .param('cui2', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .route('/scdproposed/:cui2')
    .get(function (req, res, next) 
    {
        var cui = req.params.cui2;

        var cond = '';
        if (cui)
            cond = ' a.SCD_rxcui = "' + cui + '" ';

        var queryStr = ' select DISP_N_rxt, ROUTE_rxt, NEWDF_rxt ' +
                       ' from scd_rxterms ' +
                       ' where SCD_rxcui = "' + cui +'"';

        var query = connection1.query(queryStr  ,function (err, rows, fields) 
        {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //connection1.end();
            res.json(rows);
         });
    });

router
    .param('cui1', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .route('/scd/:cui1')
    .get(function (req, res, next) 
    {
        var cui = req.params.cui1;

        var cond = '';
        if (cui)
            cond = ' where scd_df.SCD_rxcui = "' + cui + '" ';

        var queryStr =  ' select scd_df.SCD_rxcui, scd_df.SCD_str, scd_df.DF_rxcui, scd_df.DF_str, ' +
                        '        scd_rxterms.ROUTE_rxt, scd_rxterms.NEWDF_rxt ' +
                        ' from scd_df ' +
                        ' join scd_rxterms on ( scd_df.SCD_rxcui = scd_rxterms.SCD_rxcui ) ' +
                        cond ;

        var query = connection1.query(queryStr  ,function (err, rows, fields) 
        {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //connection1.end();
            res.json(rows);
         });
    });

router
    .param('cui', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .route('/scdcomments/:cui')
        .get(function (req, res) 
        {
            //db.findOne(req.dbQuery, function (err, data) {
             //   res.json(data);    
            //});
        })
        .put(function (req, res) 
        {
            var comment = req.body;
            delete comment.$promise;
            delete comment.$resolved;

            var updateQuery = 'INSERT INTO scd_comments (SCD_rxcui, SCD_property, SCD_reviewer, SCD_comment) VALUES (' +
                '"1000001"' + ',' +
                '"Dose Form: Drug Form"' + ',' +
                '"Kelly DB"'+ ',' +
                '"testComment from program"' +
                ') ON DUPLICATE KEY UPDATE `SCD_comment` = '+
                '"testComment4 from program"';

                var query = connection1.query(updateQuery  ,function (err, rows, fields) 
                                        {
                                            if(err){
                                                console.log(err);
                                                return next("Mysql error, check your query");
                                            }

                                            res.json(rows);
                                        });
        })
        .delete(function (req, res) {
            //db.delete(req.dbQuery, function () {
              //  res.json(null);
            //});
        });

router
	.use(bodyParser.json())
	.route('/rxnormtable')
	.get(function (req, res, next) {
            //console.log('11111DEEPAKDEEPAKDEEPAK');

		//connection1.connect();

        var query = connection1.query('show tables',function (err, rows, fields) {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //connection1.end();
            res.json(rows);
         });
	});

router
.param('tableName', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .route('/tdetails/:tableName')
        .get(function (req, res, next) {
            
            //console.log('router DEEPAKDEEPAKDEEPAK');
        	//console.log('tableName=' + req.params.tableName);
		

		//connection1.connect();

		var tn = req.params.tableName;

        var query = connection1.query('select count(*) from ' + tn, function (err, rows, fields) {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //connection1.end();
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