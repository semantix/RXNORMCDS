var express = require('express'),
    api = require('./api'),
    app = express();

app
    .use(express.static('./public'))
    .use('/api', api)
    .get('*', function(req,res){
        // Whatever request comes send back the main html file.
        res.sendfile('main.html');
    })
    .listen(3000);
