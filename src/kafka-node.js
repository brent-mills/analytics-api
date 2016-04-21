
//=======================================//

var express = require('express'),
        http = require('http'),
        path = require('path');

var util = require('util');

var kafka = require('kafka-node');
Producer = kafka.Producer,
Client = kafka.Client,
client = new Client(process.env.ZK_HOST + ':2181');

var producer = new Producer(client);
var app = express();
app.set('port', 8125);
var bodyParser = require('body-parser')
app.use( bodyParser.json() );

producer.on('ready', function() {
    //console.log('Ready\n');
});

//======================================//
app.use(function(err, req, res, next) {
    //console.error(err);
    res.send("error in post body");
});

app.post('/v1/import', function(req, res) {
    var batch = req.body.batch;
    //console.log(batch)

    //console.log('/*** Sending Events ***/');

    var messages;
    if (batch) {
        messages = [];
        for (var i = 0; i < batch.length; i++) {
            messages[i] = JSON.stringify(batch[i]);
        }
    }
    else {
        messages = [JSON.stringify(req.body)];
    }
    producer.send([{topic: 'uShip.Events', messages: messages, partition: 0}],
        function(err, body) {
            //if (err) console.log("ERROR => " + err);
        }
    );
    res.end("yes");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});