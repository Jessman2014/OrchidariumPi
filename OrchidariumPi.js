var request = require('request');
var SerialPort = require('serialport');
var moment = require('moment');
var url = "http://plantwatcherbot.azurewebsites.net/api/";

var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});

// Open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message);
})

function syncArduino(){
    var currentSeconds = Math.floor(new Date() / 1000) - (3600 * 6);
    var timeStr = "T" + currentSeconds;
    
    port.write(timeStr, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('sync message written');
    });
};

function sendData(action, data){
    var options = {
        uri: 'http://plantwatcherbot.azurewebsites.net/api/' + action,
        method: 'POST',
        json: data
      };
      
      request(options, function (error, response, body) {
        if (error)
            console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body:', body); // Print the HTML for the Google homepage.
      });
};

const Readline = SerialPort.parsers.Readline;
const parser = new Readline();
port.pipe(parser);
parser.on('data', function(newlineStr){
    var newline = newlineStr.replace(/(\n|\r)+$/, '');
    if (newline === "waiting for sync message"){
        syncArduino();
    }
    else {
        var data = JSON.parse(newline);
        //console.log("successfully read json data");
        var DateAdded = moment().format();
        if (data.dateRecorded){
            var arduinoDate = data.dateRecorded;
            DateAdded = moment.unix(arduinoDate).format();
        }
        data.DateAdded = DateAdded;
        if (data.Humidity && data.TemperatureF){
            console.log("sensor data");
            sendData("SensorReadings", data);
        }
        else if (data.Message) {
            console.log("event data");
            sendData("Events", data);
        }
        else {
            console.log("odd message");
        }
    }
});

/*
if 'TemperatureF' in data and 'Humidity' in data:
                print('valid data')
                data['Id'] = 0
                data['SoilMoisture'] = 0
        data['DateAdded'] = str(datetime.datetime.now())
and look for events
*/