 // From browser-serialport
 /* https://github.com/garrows/browser-serialport */

var spLib = require('./serialport.js');
var SerialPort = spLib.SerialPort;
var SerialPortList = spLib.SerialPortList;

var io = require("socket.io-client");

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
			var server = document.getElementById("server").value;
			console.log('server: ' + server);
			var port = portsPath.options[portsPath.selectedIndex].value;
			var baudrateElement = document.getElementById("baudrate");
			var baudrate = baudrateElement.options[baudrateElement.selectedIndex].value;
			connect(port, baudrate,server);
		};
	}
});

function connect(port, baudrate, server) {
	var baud = 9600;
	if (baudrate) {
		baud = baudrate;
	}
	var socket = io.connect(server)
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

	var brstr = '';
	sp.on("dataString", function(string) {
		output.textContent += string;
		brstr += string;
		if (string.search('\r') !== -1) {
			// brstr.replace('\n', '');
			brstr = brstr.replace('\r', '');
			brstr = brstr.replace('\n', '');
			socket.emit('brainData', brstr);
			console.log(brstr);
			brstr = '';
		}
	});
}
