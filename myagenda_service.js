/*
Author: Ryan Qin
*/

const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(express.static("public"));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers",
	"Origin, X-Requested-With, Content-Type, Accept");

	next();
});

/*
Purpose: this function reads the file and extract out the name and comment
of each line in the file messages.txt and convert it in the form of json
*/
function readFile(filename){
	let file = fs.readFileSync(filename, "utf8");
	let lines = file.trim().split("\n");
	let agenda = {};
	let list = [];
	for (let i = 0; i < lines.length; i++){
		let line = lines[i].split("::");
		let time = line[0];
		let event = line[1];

		let aEvent = {};
		aEvent["time"] = time;
		aEvent["event"] = event;
		list.push(aEvent);
	}
	console.log(list);
	agenda["weekday"] = list;
	return agenda;
}

/*
Purpose: this function append a new line in the messages.txt file
*/
function writeFile(filecontent, day){
	let filename = day + ".txt"
	fs.appendFile(filename, filecontent, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("The file was saved!");
	})	
}


app.post('/', jsonParser, function(req, res){
	let day = req.query.day;
	let timeBegin = req.body.begin;
	let timeEnd = req.body.end;
	let plan = req.body.event;
	if (timeBegin != "" && timeEnd != "" && plan != ""){
		let timePeriod = timeBegin + "--" + timeEnd;
		let filecontent = timePeriod + "::" + plan + "\n"; 
		writeFile(filecontent, day); 
	}
});

app.get('/', function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
	let day = req.query.day;
	let filename = day + ".txt";
	let json = readFile(filename);
	res.send(JSON.stringify(json));
});


app.listen(3000);


