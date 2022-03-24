// parent.js
var child_process = require('child_process');
var done      = 0;


  var mqtt = child_process.fork('./MQTT');
  
  mqtt.on('message', function(message) {
    console.log('[parent] received message from child:', message);
    
    
  });
mqtt.on ("connect",["mqttx_4702dd23","Nashon","1234","my_data"],"connect" )
mqtt.send( );
  


