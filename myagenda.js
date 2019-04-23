
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

	function surprise(){
		alert("Do you really think this gif is clickable?");
		alert("What do you want?");
		alert("You thought I would give you a surprise?");
		alert("No way!");
		alert("btw, you look enthusiastic and passionate on your stuff today!")
	}

	function showDay(){
		document.getElementById("weekday").hidden = false;
		document.getElementById("week").hidden = true;
		fetchData(this.id);
		timer = setInterval(load, 3000);
	}

	function fetchData(mode){
		theDay = mode;
		let url = "http://localhost:3000?day=" + mode; 
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

	function clear(){
		document.getElementById("timeBegin").value = "";
		document.getElementById("timeEnd").value = "";
		document.getElementById("plan").value = "";
	}

		//this function send parameter to the "post" 
	function submit(){
		let url = "http://localhost:3000?day=" + theDay;
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

	function load(){
		document.getElementById("display").innerHTML = "";
		fetchData(theDay);
	}

})()