const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());


const server = app.listen(3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });
  app.get('/', (req, res) => {
    res.render('index', {
      title: 'Control'
    });

  });

  app.post('/mqtt/connect', (req, res) => {
    res.render('index', {
      title: 'Control'
    });
    var topic = req.body.mqtt_topic;
    var client_id=req.body.mqtt_name;
    var client_id=req.body.Client_id;
    var username=req.body.username;
    var password=req.body.Password;
  
    
    console.log("name", topic, "client ID:", client_id, "Username", username, "Password", password);
    // console.log(req)

  });

  
