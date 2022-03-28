'use strict';
let report_generator=require("./test_one.js")
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let multer = require('multer');
let fs = require('fs-extra');
const { exit } = require("process");

let UPLOAD_LOCATION = path.join(__dirname, 'uploads');
fs.mkdirsSync(UPLOAD_LOCATION);
var unique_slaves=[]

const upload = multer({
    dest: 'uploads/' // this saves your file into a directory called "uploads"
}); 

  
const server = app.listen(3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });

app.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Modbus Report'
  });
});

app.post('/filter', function (req, res) {
    let item=req.body.dropDown
    let functioncodes=[]
    let offsets=[]
    let numberofregisters=[]
    let device_info=header.Device_details[item]
   
    
    for (var i=0;i<Object.keys(device_info).length;i++){
        functioncodes.push(device_info[i]["functioncode"])
        offsets.push(device_info[i]["offset"])
        numberofregisters.push(device_info[i]["numberofregisters"])
       
        
    } 

    return res.render('slave_info', {
        selection:"Slave ID:"+item,
        addresses:unique_slaves,
        functioncode:functioncodes,
        offset:offsets,
        numberofregisters:numberofregisters,
        title: 'Modbus Report'
    });
    
  });

  app.post('/upload', upload.single('file'),async (req, res) => {
    console.log(req.file.path)
    console.log("Generating report")
    res.render("loading")
    // res.send("Working On It")
    await report_generator.generate_report(req.file.path)
  });
app.get('/result', (req, res) => {
    
    const fs = require('fs');
    fs.readFile('Header_report.json', (err, data) => {
        if (err) throw err;
        globalThis.header = JSON.parse(data);
        // console.log(header);
        unique_slaves=header.Unique_slaves
        globalThis.requests=header.Requests
        globalThis.responses=header.Responses
        // res.end()
        res.render("index",{
            selection:"No selection",
            addresses:unique_slaves,
            requests:requests,
            responses:responses,
            title: 'Modbus Report'
    
        });
        console.log("Rendered")
    });

    // res.redirect("/complete");
    
    
//     while(generatingreport){
        
//         if (fs.existsSync('Header_report.json')){
// generatingreport=false;
//         }
//     }
            
            
                
        

    // res.sendFile(__dirname + '/success.html');
});
app.get('/complete', function (req, res, next) {
    
  });
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;