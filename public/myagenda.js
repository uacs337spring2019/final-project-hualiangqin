/*
Author: Ryan Qin
cs337 19 spring
Instructor: Allison Obourn
Assignment 11(final project): myagenda.js
Description: there are eight blocks, including Monday to Sunday and a exact one
click on Monday to Sunday block, the page will change, user can then type in the time
and the event and click submit button. Once the submit button is clicked, the information
will show up on the display board below. When user click on the back button, it page will go
back to the eight blocks 
*/

(function() {
	"use strict"
	let theDay = "";
	let timer = null;

	window.onload = function() {
		document.getElementById("weekday").hidden = true;
		let back = document.getElementById("back");
		back.onclick = goBack;
		document.getElementById("picture").onclick = surprise;
		document.getElementById("Monday").onclick = showDay;
		document.getElementById("Tuesday").onclick = showDay;
		document.getElementById("Wednesday").onclick = showDay;
		document.getElementById("Thursday").onclick = showDay;
		document.getElementById("Friday").onclick = showDay;
		document.getElementById("Saturday").onclick = showDay;
		document.getElementById("Sunday").onclick = showDay;
		document.getElementById("submit").onclick = submit;
	}

	//purpose: this function go back to the page that contains eight blocks
	//and stop the timer
	function goBack() {
		document.getElementById("display").innerHTML = "";
		document.getElementById("weekday").hidden = true;
		document.getElementById("week").hidden = false;
		if (timer != null){
			clearInterval(timer);
		}
	}

	//purpose: this function responde to different error
	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		}else if (response.status == 404) {
			return Promise.reject(new Error("Sorry, we couldn't find the page"));
		}else if (response.status == 410) {
			return Promise.reject(new Error("Sorry, there was no data for the chosen state"));
		}else {
			return Promise.reject(new Error(response.status+": "+response.statusText));
		}
	}

	//purpose: this function pop alerts when the user click on the gif block
	function surprise(){
		alert("Do you really think this gif is clickable?");
		alert("What do you want?");
		alert("You thought I would give you a surprise?");
		alert("No way!");
		alert("btw, you look enthusiastic and passionate on your stuff today!")
	}

	//purpose: this function start a timer and change the page
	function showDay(){
		document.getElementById("weekday").hidden = false;
		document.getElementById("week").hidden = true;
		fetchData(this.id);
		timer = setInterval(load, 3000);
	}

	//purpose: this function fetch data from text files
	//and call the function displayData to display the data on a div
	function fetchData(mode){
		theDay = mode;
		let url = "http://myagenda-hualiang.herokuapp.com?day=" + mode; 
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {
				let data = JSON.parse(responseText);
				displayData(data, mode);
			})
			.catch(function(error) {
				console.log(error);
				
			});
	}

	//purpose: this function display the fetched data on the display board
	function displayData(data, day) {
		console.log(data);
		let h2 = document.createElement("h2");
		h2.innerHTML = day;
		h2.className = "title";
		document.getElementById("display").appendChild(h2);
		let list = data["weekday"];
		if (list.length > 0){
			for (let i=0; i < list.length; i++) {
				let aEvent = list[i];
				if (aEvent["time"] != ""){
					let time = aEvent["time"] += ": ";
					let event = aEvent["event"];
					let p = document.createElement("p");
					p.innerHTML = time + event;
					document.getElementById("display").appendChild(p);
				}
			}
		}
	}

	//purpose: this function clear the input box
	function clear(){
		document.getElementById("timeBegin").value = "";
		document.getElementById("timeEnd").value = "";
		document.getElementById("plan").value = "";
	}

	//purpose: this function send parameters to the "post" 
	function submit(){
		let url = "https://myagenda-hualiang.herokuapp.com/?day=" + theDay;
		let timeBegin = document.getElementById("timeBegin").value;
		let timeEnd = document.getElementById("timeEnd").value;
		let plan = document.getElementById("plan").value;
		clear();
		let agenda =  {begin: timeBegin,
						end: timeEnd,
						event: plan};
		let fetchOptions = {
			method : 'POST',
			headers : {
				'Accept': 'application/json',
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify(agenda)
		};
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
			})
			.catch(function(error) {
		});
	}

	//purpose: this function clear the display board and fetchData
	function load(){
		document.getElementById("display").innerHTML = "";
		fetchData(theDay);
	}

})()
