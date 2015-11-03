
//=======================================//

var express = require('express'),
        http = require('http'),
        path = require('path');

var util = require('util');

var kafka = require('kafka-node');
Producer = kafka.Producer,
Client = kafka.Client,
client = new Client(process.env.ZK_IP + ':2181');

var producer = new Producer(client);
var app = express();
app.set('port', 8125);

producer.on('ready', function() {
console.log('Ready\n');
});

//======================================//

app.post('/v1/import', function(req, res) {
    var body = '';

    req.on('data', function(chunk) {
        body += chunk;
    });

    req.on('end', function(){

        var data = JSON.parse(body);
        console.log(data)
        var batchSize = data.batch.length;

        for(i = 0; i < batchSize; i++){

            var theEvent = data.batch[i];
            console.log('/*** Sending Event ***/');
            console.log("Item " + i + " in batch    " + JSON.stringify(data.batch[i]) + '\n'); 
            producer.send([ {topic: 'uShip.Events', messages: JSON.stringify(data.batch[i]), partition: 0}],
                function(err, data) {
                    if (err) console.log("ERROR => " + err);      
                }
            )
        }

    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});