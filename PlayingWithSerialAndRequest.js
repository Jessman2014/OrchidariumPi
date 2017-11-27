var request = require('request');
var url = "http://plantwatcherbot.azurewebsites.net/api/";
var requestData = {
    "Message": "Test2",
    "DateAdded": "11-26-2017 21:35"
};
request({
    url: url + "Events",
    method: "POST",
    headers: {
        "content-type": "application/json",
        },
    json: requestData
//  body: JSON.stringify(requestData)
    }, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });


    var SerialPort = require('serialport');
    var port = new SerialPort('/dev/ttyACM0', {
      baudRate: 9600
    });

    var currentSeconds = Math.floor(new Date() / 1000);
    var timeStr = "T" + currentSeconds;

    port.write(timeStr, function(err) {
        if (err) {
          return console.log('Error on write: ', err.message);
        }
        console.log('message written');
      });
       
      // Open errors will be emitted as an error event
      port.on('error', function(err) {
        console.log('Error: ', err.message);
      })

    const Readline = SerialPort.parsers.Readline;
    const parser = new Readline();
    port.pipe(parser);
    parser.on('data', console.log);

    port.on('readable', function () {
        console.log('Data:', port.read());
      });

      port.open(function (err) {
        if (err) {
          return console.log('Error opening port: ', err.message);
        }
       
        // Because there's no callback to write, write errors will be emitted on the port:
        port.write('main screen turn on');
      });
       
      // The open event is always emitted
      port.on('open', function() {
        // open logic
      });


       // if the client disconnects:
socket.on('disconnect', function () {
	myPort.write('x');
        console.log('user disconnected');
    	connected = false;
  });

  // listen for new serial data:  
port.on('data', function (data) {
    console.log(data);
	//var serialData = JSON.parse(data);
	//console.log(serialData);
});

function showPortOpen() {
    console.log('port open. Data rate: ' + myPort.baudRate);
 }
  
 function readSerialData(data) {
    console.log(data);
 }
  
 function showPortClose() {
    console.log('port closed.');
 }
  
 function showError(error) {
    console.log('Serial port error: ' + error);
 }

myPort.on('open', showPortOpen);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);