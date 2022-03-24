const mqtt = require('mqtt')

const host = 'broker.emqx.io'
const port = '1883'
// const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client=mqtt;

process.on ("message", function(action, message,unsername, ){

  client.publish(topic, message, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
});

process.on ("connect", function(clientId, username,password, topic){
  client.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: username,
    password: password,
    reconnectPeriod: 1000,
  })
  client.on('connect', () => {
    console.log('Connected')
    client.subscribe([topic], () => {
      console.log(`Subscribe to topic '${topic}'`)
    })});  
  
});

client.on('message', (topic, payload) => {
  // console.log('Received Message:', topic, payload.toString())
  process.send(payload.toString())
})