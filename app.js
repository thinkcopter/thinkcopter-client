/* From browser-serialport
 * https://github.com/garrows/browser-serialport */

var spLib = require('./serialport.js');
var SerialPort = spLib.SerialPort;
var SerialPortList = spLib.SerialPortList;

var io = require("socket.io-client");
var socket = io.connect('http://thinkcopter.com');


SerialPortList(function(err, ports) {
	var portsPath = document.getElementById("portPath");

	if (err) {
		console.log("Error listing ports", err);
		portsPath.options[0] = new Option(err, "ERROR:" + err);
		portsPath.options[0].selected = true;
		return;
	} else {
		for (var i = 0; i < ports.length; i++) {
			portsPath.options[i] = new Option(ports[i].comName, ports[i].comName);

			if (ports[i].comName.toLowerCase().indexOf("usb") !== -1) {
				portsPath.options[i].selected = true;
			}
		}

		var connectButton = document.getElementById("connect");
		connectButton.onclick = function() {
			var port = portsPath.options[portsPath.selectedIndex].value;
			var baudrateElement = document.getElementById("baudrate");
			var baudrate = baudrateElement.options[baudrateElement.selectedIndex].value;
			connect(port, baudrate);
		};
	}
});



function connect(port, baudrate) {
	var baud = 9600;
	if (baudrate) {
		baud = baudrate;
	}

	var sp = new SerialPort(port, {
	    baudrate: baud,
	    buffersize: 1
	}, true);

	var output = document.getElementById("output");
	document.getElementById("settings").style.display = "none";

	sp.on("open", function() {
		document.getElementById("connected-container").style.display = "block";
		output.textContent += "Connection open\n";
	});

	sp.on("error", function(string) {
		output.textContent += "\nError: " + string + "\n";
	});

	// sp.on("data", function(data) {
	// 	//console.log("Data", data);
	// });

var brstr = '';
sp.on("dataString", function(string) {
	output.textContent += string;
  brstr += string;
  if (string.search('\r') !== -1) {
    socket.emit('brainData', {data: brstr});
    console.log(brstr);
    brstr = '';
  }
});

	function send() {
		var line = input.value;
		input.value = "";
		sp.writeString(line + "\n");
	}


	var input = document.getElementById("input");
	var sendButton = document.getElementById("send");
	sendButton.onclick = send;
	input.onkeypress = function(e) {
		if (e.which == 13) { // Enter was pressed
			send();
		}
	};

}



