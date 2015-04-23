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
                          ' a.review_status = "Incomplete" and' +
                          ' a.review_priority < 100 ' +
                          ' order by a.review_priority, a.SCD_rxcui limit 25';

        var query = connection1.query(queryStr  ,function (err, rows, fields) 
        {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            else
            {
                for (var i=0; i < rows.length;i++)
                {
                    var uq = 'update scd_review set review_status = "In Progress" where SCD_rxcui = "' + rows[i].SCD_rxcui + '"';
                    var qr = connection1.query(uq, function (err, rows2, fields)
                    {
                        if(err){
                                    console.log(err);
                                    return next("Mysql error in update, check your query");
                                }
                    }); 
                }
            }

            res.json(rows);
         });
    });

    router
    .param('df', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .param('route', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .param('ndf', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .route('/terms')
    .get(function (req, res, next) 
    {
        var queryStr = ' select * from terms';

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

    
            var cond1 = 'false';
            var cond2 = 'false';
            var cond3 = 'false';
            var proposedValues = [];
    
            if (rows[0])
            {
                /*
                console.log("DF_str:" + (rows[0]['DF_str'])?rows[0]['DF_str']:"DF_str is not defined");
                console.log("ROUTE_rxt:" + (rows[0]['ROUTE_rxt'])?rows[0]['ROUTE_rxt']:"ROUTE_rxt is not defined");
                console.log("NEWDF_rxt:" + (rows[0]['NEWDF_rxt'])?rows[0]['NEWDF_rxt']:"NEWDF_rxt is not defined");
                */

                cond1 = ((rows[0]['DF_str'])&&(rows[0]['DF_str'].trim() != ''))?
                    (' mappings.orig_term_source = "NDFRT" and mappings.orig_term_name = "' + rows[0]['DF_str'] + '"'):'false';

                cond2 = ((rows[0]['ROUTE_rxt'])&&(rows[0]['ROUTE_rxt'].trim() != ''))?
                    (' mappings.orig_term_source = "RxTerms" and mappings.orig_term_name = "' + rows[0]['ROUTE_rxt'] + '"'):'false';

                cond3 = ((rows[0]['NEWDF_rxt'])&&(rows[0]['NEWDF_rxt'].trim() != ''))?
                    (' mappings.orig_term_source = "RxTerms" and mappings.orig_term_name = "' + rows[0]['NEWDF_rxt'] + '"'):'false';
    

                var propQuery = ' select mappings.orig_term_name, mappings.orig_term_source, ' +
                        ' proposed_attribs.id as prop_attrib_id, ' +
                        ' proposed_attribs.category as prop_attrib_categ, ' +
                        ' proposed_attribs.attribute as prop_attrib_attrib, ' +
                        ' terms.id as prop_term_id, ' +
                        ' terms.parent_id as prop_term_parent_id, ' +
                        ' terms.name as prop_term_name ' +
                    ' from mappings ' +
                        ' join proposed_attribs ' +
                            ' on ( mappings.proposed_attrib_id = proposed_attribs.id ) ' +
                        ' join terms ' +
                            ' on ( mappings.proposed_term_id = terms.id ) ' + 
                    ' where ( ' + cond1 + ' )  or ( ' + cond2 + ' ) or ( ' + cond3 + ' ) ';

                var innerQuery = connection1.query(propQuery  ,function (err2, rows2, fields2) 
                {
                        if(err2){
                            console.log(err2);
                            return next("Mysql error, check your query");
                        }

                    var propValues = [[0,''],
                                    [1,''],
                                    [2,''],
                                    [3,''],
                                    [4,''],
                                    [5,''],
                                    [6,''],
                                    [7,''],
                                    [8,''],
                                    [9,'']];

                    var updateWithConflict = false;
                    proposedValues = [];
                    for (var m=0; m < rows2.length;m++)
                    {

                        var conflict = false;
                        var orig_term_name = rows2[m]['orig_term_name'];
                        var orig_term_source = rows2[m]['orig_term_source'];
                        var prop_attrib_id = rows2[m]['prop_attrib_id'];
                        var prop_attrib_categ = rows2[m]['prop_attrib_categ'];
                        var prop_attrib_attrib = rows2[m]['prop_attrib_attrib'];
                        var prop_term_id = rows2[m]['prop_term_id'];
                        var prop_term_parent_id = rows2[m]['prop_term_parent_id'];
                        var prop_term_name = rows2[m]['prop_term_name'];
                        
                        /*
                        console.log("Entry " + m + "\n");
                        console.log("\torig_term_name:" + orig_term_name);
                        console.log("\torig_term_source:" + orig_term_source);
                        console.log("\tprop_attrib_id:" + prop_attrib_id);
                        console.log("\tprop_attrib_categ:" + prop_attrib_categ);
                        console.log("\tprop_attrib_attrib:" + prop_attrib_attrib);
                        console.log("\tprop_term_id:" + prop_term_id);
                        console.log("\tprop_term_parent_id:" + prop_term_parent_id);
                        console.log("\tprop_term_name:" + prop_term_name);
                        */

                        var propValueIndex = parseInt(prop_attrib_id) - 1;

                        if (propValues[propValueIndex][1] == '')
                            propValues[propValueIndex][1] = prop_term_name;
                        else
                        {
                            var prevValue = propValues[propValueIndex][1];

                            //console.log ("Comparing " + prevValue + " with " + prop_term_name);
                            if (prevValue != prop_term_name)
                            {
                                if (prevValue.indexOf(":::") != -1)
                                {
                                    var tokens = prevValue.split(":::");
                                    for (var h = 0; h < tokens.length; h++)
                                        if (tokens[h] != prop_term_name)
                                        {
                                            conflict = true;
                                            updateWithConflict = true;
                                        }
                                }
                                else
                                {
                                    conflict = true;
                                    updateWithConflict = true;
                                }
                            }

                            if (conflict)
                            {
                                propValues[propValueIndex][1] = 
                                    propValues[propValueIndex][1] + ":::" + prop_term_name;
                            }
                        }

                        //console.log("value at " + propValueIndex + " :" + propValues[propValueIndex][1]);
                    };

                    if (conflict)
                    {
                        //console.log ("FOUND CONFLICT: Setting status to Conflict for cui:" + cui);
                        var updateQuery = 'update scd_review set review_status = "Conflict" where SCD_rxcui = "' + cui + '" ';

                        var uquery = connection1.query(updateQuery  ,function (err3, rows3, fields3) 
                                {
                                    if(err3){
                                        console.log(err3);
                                        return next("Mysql error, check your query");
                                    }
                                });
                    }

                    proposedValues.push({"prop1":propValues[0][1].replace(/:::/gi, ", "),
                                        "prop2":propValues[1][1].replace(/:::/gi, ", "),
                                        "prop3":propValues[2][1].replace(/:::/gi, ", "),
                                        "prop4":propValues[3][1].replace(/:::/gi, ", "),
                                        "prop5":propValues[4][1].replace(/:::/gi, ", "),
                                        "prop6":propValues[5][1].replace(/:::/gi, ", "),
                                        "prop7":propValues[6][1].replace(/:::/gi, ", "),
                                        "prop8":propValues[7][1].replace(/:::/gi, ", "),
                                        "prop9":propValues[8][1].replace(/:::/gi, ", "),
                                        "prop10":propValues[9][1].replace(/:::/gi, ", "),
                                        "conflict": conflict,
                                        "DF_str": rows[0]['DF_str'],
                                        "ROUTE_rxt": rows[0]['ROUTE_rxt'],
                                        "NEWDF_rxt": rows[0]['NEWDF_rxt'],
                                        "SCD_str": rows[0]['SCD_str']});

                    //console.log("\n------------\nPROPS=" + ":" + JSON.stringify(propValues));
                    //console.log("\n------------\nROWS=" + ":" + JSON.stringify(rows));
                    //console.log("\n------------\nPROPOSEDVALUES=" + ":" + JSON.stringify(proposedValues));

                    res.json(proposedValues);
                });
            }
    
            //console.log("\n------------\nAT THE END --ROWS=" + ":" + JSON.stringify(rows));
            //res.json(rows);
        });
    });

    router
    .param('cui1', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .route('/scdreviewstatus/:cui3')
    .get(function (req, res, next) 
    {
        var cui = req.params.cui3;

        //console.log("cui:" + cui);

        var cond = '';
        if (cui)
            cond = ' where SCD_rxcui = "' + cui + '" ';
        else
            return next('GET: ReviewStatus: Supplied cui is not defined.');

        //console.log("cond:" + cond);

        var queryStr =  'select review_status from scd_review ' + cond ;

        //console.log("query:" + queryStr);

        var query = connection1.query(queryStr  ,function (err, rows, fields) 
        {
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //connection1.end();
            res.json(rows);
         });
    })
    .put(function (req, res, next) 
        {
            var status = req.body;

            //console.log(status);

            delete status.$promise;
            delete status.$resolved;

            //var pcui = req.params.cui3;

            if (!status)
                return next('PUT: ReviewStatus: Supplied Status is not defined');

            if (status.cui3)
                cond = ' where SCD_rxcui = "' + status.cui3 + '" ';
            else
                return next('PUT: ReviewStatus:Supplied cui is not defined.');

            var updateQuery = 'update scd_review set review_status = "' + status.status +'"' + cond;

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
    .param('cui', function (req, res, next) {
        //req.dbQuery = { id: parseInt(req.params.id, 10) };
        next();
    })
    .route('/scdcomments/:cui')
        .get(function (req, res, next) 
        {
            var cui = req.params.cui;

            console.log("cui:" + cui);

            var cond = '';
            if (cui)
                cond = ' where SCD_rxcui = "' + cui + '" ';
            else
                return next('GET: Comments: Supplied cui is not defined.');

            //console.log("cond:" + cond);

            var queryStr =  'select * from scd_comments ' + cond + ' order by SCD_updated, SCD_created DESC ';

            //console.log("query:" + queryStr);

            var query = connection1.query(queryStr  ,function (err, rows, fields) 
            {
                if(err){
                    console.log(err);
                    return next("Mysql error, check your query");
                }

                //connection1.end();
                console.log(rows);
                res.json(rows);
             });
        })
        .put(function (req, res, next) 
        {
            var comment = req.body;
            delete comment.$promise;
            delete comment.$resolved;

            //console.log("comment to add:" + comment);
            if (comment.cmtText[0].trim() == '')
            {
                //console.log("Skipping.. Value is blank for '" + comment.cui[0] + "':'" + comment.property[0] + "'");
                res.json("");
            }
            else
            {
                var updateQuery = 'INSERT INTO scd_comments (SCD_rxcui, SCD_property, SCD_reviewer, SCD_comment, SCD_created) VALUES (' +
                    '"'+ comment.cui[0]+'",' +
                    '"' + comment.property[0] +'",' +
                    '"' + comment.reviewer[0] + '",' +
                    '"'+ comment.cmtText[0] + '",' +
                    ' NOW() ' +
                    ') ON DUPLICATE KEY UPDATE `SCD_comment` = '+
                    '"' + comment.cmtText[0] +'", SCD_updated = NOW() ';

                    var query = connection1.query(updateQuery  ,function (err, rows, fields) 
                                            {
                                                if(err){
                                                    console.log(err);
                                                    return next("Mysql error, check your query");
                                                }

                                                res.json(rows);
                                            });
            }
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