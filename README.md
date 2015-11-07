# Chrome app for thinkcopter
This is a branch of browser-serialport [https://github.com/garrows/browser-serialport], which is a chrome app that reads and displays serialport data. It has been modified to parse Mindflex data and post that data to a website via socket.io.

# Build Project:

## For safety, make sure you are on a laptop, and not plugged into a wall while trying the following hack

* run
```
gulp build
```
to create the 'chrome-app' directory

* From chrome://extensions, check 'developer-mode'
* Then choose 'load unpacked extension' and choose the generated ' chrome-app' directory
* Plug in your hacked mindflex headet via usb. Info on hacking a mindflex headset is here[http://www.frontiernerds.com/brain-hack]
* Power on the headset
* In extensions, click 'Launch'
* The app will pop up
* Click 'Connect'
* EEG data will begin to print out
* Put the headset on, and wait for a good connection
* See your eeg data print out in realtime

* 'The Sever URL/IP & Port for not 80' text field gives you the option of posting this data to a website using socket.io.  In order for this to work, you must have socket.io on the website's server. In order to achieve real-time communication with the frontend, we post data from this chrome app to our server, the server then posts events to the front end. I'm sure there's a few ways to do this, and we're still working on the documentation - if you have questions, feel free to ask - have fun!



## Behavior of Thinkcopter.com
Reads data from mindflex or neurosky headset via serial port

→ Forwards data to thinkcopter.com, which sends commands to a drone based on
  brain activity level
  
→ Browser displays a graph with brain activity

Uses [browser-serialport](https://github.com/garrows/browser-serialport) to
read serialport data.

*Todo* 

→ Brain data is stored to a database _(what are we using it for?)_

