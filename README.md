[![github](https://img.shields.io/badge/github%20repo-black?logo=github)](https://github.com/rickgregg/saasmvp-iot)
[![license](https://img.shields.io/github/license/nuxt/nuxt.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/rickgregg/saasmvp-iot/blob/main/LICENSE.txt)
# Internet-of-Things (IoT) SaaS MVP
**saasmvp-iot** is a work-in-progress reference implementation that teaches how an [Internet-of-Things (IoT)](https://en.wikipedia.org/wiki/Internet_of_things) device behind a firewall can  communicate with a web server on the public Internet. This simple implementation serves as a basis for **Minimally Viable Product (MVP) IoT Software-as-a-Service (SaaS)** applications. The software uses [Node](https://nodejs.org/en), [Express](https://expressjs.com/), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [REST APIs](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/) and [WebSockets](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets) on both the IoT device and the Endpoint Server. The reference implementation IoT hardware is a low-cost [Raspberry Pi Zero 2W](https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/). The IoT device sends temperature readings to the Endpoint Server once per second. In turn, the Endpoint Server client browser dashboard can send a message to the IoT device to change the temperature scale. The dashboard displays near real time temperature updates from the IoT device. Additionally, the software maintains connectivity between the IoT device and the Endpoint Server in the case of a power or communications interruption. The Endpoint Server can run as a stand-alone Node server for local host testing or inside a [Docker](https://www.docker.com/) container containing a [nginx](https://nginx.org/en/) proxy for use in network testing.

# The saasmvp Project
**saasmvp-iot** is an open source project available under the MIT license and is sponsored by The saasmvp Project. The saasmvp Project allows you to spin up a SaaS Minimally Viable Product Fast. Quickly Discover your Customer. No Assembly Required. Find out more and get documentation for [**The saasmvp Project**](https://saasmvp.org). 

## Contributing to saasmvp-iot
**saasmvp-iot** has several [open areas of investigation, research and development](#Open-Areas-for-Further-Research-and-Development) available for community members. If you are interested in contributing to **saasmvp-iot**, let’s have a discussion. <a href="mailto:support@saasmvp.org?&subject=Contributing to saasmvp-iot&body=Please%20contact%20me.%20I%20am%20interested%20in%20contributing%20to%20the%20saasmvp-iot%20project.">Contact</a> **The saasmvp Project** and we’ll schedule a time to talk. 

## Documentation
Get documentation in this README file for **saasmvp-iot**. You can find the documentation here for [**The saasmvp Project**](https://saasmvp.org).

# saasmvp-iot
The **saasmvp-iot** project GitHub repository contains three directories:
1.	The **endpoint** directory contains the Endpoint Server.
2.	The **iot** directory has a simulated IoT device that is used to demonstrate the fundamental use of WebSockets and the REST API with the Endpoint Server.
3.	The **iotpi** directory contains the software that is installed on the Raspberry Pi Zero 2W which tranforms it into an IoT device. The softwware implements both 1) dynamic registration of the IoT device with the Endpoint Server; and 2) connectivity maintenance in the case of a power or communications failure with the Endpoint Server. You can learn more in the section of this document entitled [Dynamic IoT Registration and Communication Connection Maintenance](#Dynamic-IoT-Registration-and-Communication-Connection-Maintenance).

You can clone the GitHub repository to your local machine using the following command from your terminal: `https://github.com/rickgregg/saasmvp-iot.git`

## Requirements
The **saasmvp-iot** project needs to be run on a Linux Operating System using one of the following:
1. Windows 10/11 with the [Windows Subsystem for Linux (WSL) 2.0](https://learn.microsoft.com/en-us/windows/wsl/about) installed.
2. Native MAC OS.
3. A Linux distribution. Ubuntu 22.04 is recommended.

## endpoint
Once the **saasmvp-iot** project has been cloned to your local PC, navigate to the endpoint directory (`./endpoint`)using your terminal. Install the dependencies required to run the **saasmvp-iot** software by performing the following steps from your local PC terminal:

1.	**Update Linux using the command:** `sudo apt-get update && sudo apt-get upgrade`
2.	**Install Node using the command:** `sudo apt install nodejs`
3.	**Install npm using the command:** `sudo apt install npm`
4.	**Install the Node dependencies with the command:** `npm install`

5.	**Download and install Docker Desktop.** The Endpoint Server builds and configures a nginx proxy server that is connected in a Docker Network to the Node server that runs the Endpoint Server software. The Endpoint Server is made available on your local machine at http port 80. The Endpoint Server provides a browser client on http port 80 consisting of a near real time dashboard to control the IoT device temperature scale (Fahrenheit, Celsius) and display temperature updates from the IoT device. **CAUTION: There is currently no security mechanisms implemented in saasmvp-iot** including TLS/SSL, REST API security, or WebSocket security (wss). Security will be addressed as the project progresses. 

6.	**Build the Docker Containers.** Build and run the Endpoint Server Docker container by running the following command from the terminal in the endpoint directory:  `docker compose up –-build -d`
7.	You should see the following in the Docker Desktop console by navigating to Containers, Endpoint:

```
2025-02-09 13:27:36 nginx    | /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
2025-02-09 13:27:36 nginx    | /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
2025-02-09 13:27:36 nginx    | /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
2025-02-09 13:27:36 nginx    | 10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
2025-02-09 13:27:36 nginx    | 10-listen-on-ipv6-by-default.sh: info: /etc/nginx/conf.d/default.conf differs from the packaged version
2025-02-09 13:27:36 nginx    | /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
2025-02-09 13:27:36 nginx    | /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
2025-02-09 13:27:36 nginx    | /docker-entrypoint.sh: Configuration complete; ready for start up
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: using the "epoll" event method
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: nginx/1.21.6
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: built by gcc 10.2.1 20210110 (Debian 10.2.1-6) 
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: OS: Linux 5.15.167.4-microsoft-standard-WSL2
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: start worker processes
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: start worker process 30
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: start worker process 31
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: start worker process 32
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: start worker process 33
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: start worker process 34
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: start worker process 35
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: start worker process 36
2025-02-09 13:27:36 nginx    | 2025/02/09 19:27:36 [notice] 1#1: start worker process 37
2025-02-09 13:27:36 nodeapp  | Endpoint listening on port 3000
```

8.	**Open your Browser.** Navigate to `http://localhost`, you will see the IoT Endpoint Server dashboard. Observe the message `“Awaiting IoT Endpoint Registration …”` with the spinning progress indicator. The Endpoint Server is waiting for the IoT device to register with and receive any initialization data from the IoT Endpoint Server. Please refer to the iotpi section of this document for further information. Once the IoT device has completed this handshake, you will see the IoT device temperature data forwarded in near real time to the dashboard once per second. You will now see the following on the dashboard and in the Docker Desktop by navigating to Containers, Endpoint:

```
2025-02-09 13:39:45 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129986136}
2025-02-09 13:39:46 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129987138}
2025-02-09 13:39:47 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129988141}
2025-02-09 13:39:48 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129989138}
2025-02-09 13:39:49 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129990140}
```
From the dashboard, change the temperature scale from Fahrenheit to Celsius. This action commands the IoT device to change the temperature scale. You will now see the following on the dashboard and in the Docker Desktop by navigating to Containers, Endpoint:

```
2025-02-09 13:39:50 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129991140}
2025-02-09 13:39:51 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129992140}
2025-02-09 13:39:52 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129993151}
2025-02-09 13:39:53 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129994148}
2025-02-09 13:39:54 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129995170}
```

9.	**Stop Docker.** Stop the Docker container by navigating to Containers, Endpoint and clicking on the stop button (blue square button with embedded white square). This simulates the loss of connectivity with the IoT Endpoint Server. Please refer to the **iotpi** section of this document for further information. The IoT device continues to collect temperature information along with attempting to re-establish communication with the Endpoint Server. 

10.	**Start Docker.** Start the Docker container by navigating to Containers, Endpoint and clicking on the start button (blue square button with embedded white right triangle). The IoT device will automatically re-establish communication with the Endpoint Server and continue to report temperature data to the Endpoint Server and dashboard.

## iot
The **iot** folder (`./iot`) contains an **IoT test stub** that simulates an IoT device, is independent of any hardware; and runs on your local machine to demonstrate and exercise the use of the REST APIs and WebSockets. The IoT test stub does not provide for automatic registration of the IoT device with the Endpoint Server nor does it maintain a connection with the Endpoint Server in the case of a power or communications failure. Please refer to the **iotpi** section for more information on automatic registration and connection maintenance.  

Having previously cloned the **saasmvp-iot** project to your local PC from GitHub, navigate to the **iot** directory (`./iot`)using your terminal. Install the dependencies required to run the **saasmvp-iot** software by performing the following steps from your local PC terminal:

1.	**Update Linux, Install Node and npm.** Make sure that you have already updated your Linux distribution and have previously installed Node and npm. Refer to steps 1-3 in the section entitled **endpoint** if you have not done so. There is no need to have Docker running for this demonstration.

2.	**Install Node Dependencies.** Install the dependencies with the command: `npm install`

3.	**Start the Endpoint Server first.** The Endpoint Server runs on `http://localhost:3000`. From a terminal in the endpoint folder, start the Endpoint Server from the command line by entering: `node app.js`

4.	**Check the Endpoint Server.** You should see the message in the terminal  `Endpoint listening on port 3000`

5.	**Start the IoT test stub second.** The IoT test stub runs on `http://localhost:3001`. From a terminal in the **iot** folder, start the IoT test stub using the following command: `node app.js`

6.	**Check the IoT test stub Server.** You should see the message in the terminal `IoT listening on port 3001`

7.	You should see something like the following messages in the Endpoint Server terminal:
```
{"message":"IoT Monitoring Loop -> Endpoint: 1739139290959"}
{"message":"IoT Monitoring Loop -> Endpoint: 1739139291928"}
{"message":"IoT Monitoring Loop -> Endpoint: 1739139292927"}
{"message":"IoT Monitoring Loop -> Endpoint: 1739139293930"}
{"message":"IoT Monitoring Loop -> Endpoint: 1739139294930"}
{"message":"IoT Monitoring Loop -> Endpoint: 1739139295928"}
{"message":"IoT Monitoring Loop -> Endpoint: 1739139296929"}
```
These messages are the result of the IoT test stub establishing a WebSocket connection with the Endpoint Server. Messages are sent once per second from the IoT test stub to the Endpoint Server. Interrupting the Endpoint Server with a `Ctrl+C` causes a ECONNREFUSED communication error on the IoT test stub terminal to be displayed. This error is handled in the **iotpi** software that runs on the Raspberry Pi Zero 2W.

8.	Open a browser on your local machine and navigate to `http://localhost:3001`. This is the user interface for the IoT test stub and can be used to exercise both the REST APIs and the WebSockets.

9.	The **Get Firmware Update** button sends a HTTP GET request to the Endpoint Server’s `/iot/update` **REST API** endpoint. The Endpoint Server replies and displays a simple message and Linux epoch timestamp. An example is `“GET Firmware Update 1739140147053”`. The IoT firmware update functionality is not currently implemented in either the Endpoint Server or IoT device software and is an open area for further development.

10.	The **GET Configuration File** button sends a HTTP GET request to the Endpoint Server’s `/iot/config` **REST API** endpoint. The Endpoint Server replies and displays a simple message `“IoT Configuration”`. Automatic registration and initialization of the IoT device is available in the Raspberry Pi Zero 2W **iotpi** software and has not been implemented in the IoT test stub.

11.	The **POST Data to Endpoint** button sends a HTTP POST request to the Endpoint Server’s `/iot/data` **REST API** endpoint. The Endpoint Server terminal displays the message `“{ iot: 1739141244398 }”` and replies to the IoT test stub browser with a simple message and Linux epoch timestamp like `“POST loopback 1739141244398”`. The motivation behind including a REST API POST mechanism is to allow a large amount of data to be sent in batch mode from the IoT device to the Endpoint Server. A further area of open research and development would be the inclusion of streams in the architecture to allow for near real time audio and video to be sent from the IoT device to the Endpoint Server.

12.	The **WebSocket – Send Real-Time Data** button sends a **WebSocket** message from the IoT test stub to the Endpoint Server which is displayed in the Endpoint Server terminal and the Endpoint Server client browser like `{"message":"IoT -> Endpoint: 1739141995976"}`

## iotpi
The **iotpi** folder (`./iotpi`) contains the software that transforms the Raspberry Pi Zero 2W into an Internet-of-Things (IoT) device that can communicate with an Endpoint Server. The IoT device acts as a Node server which runs a program (`app.js`) that acquires temperature sensor data and controls the IoT device. The **iotpi** software implements both 1) dynamic registration of the IoT device with the Endpoint Server; and 2) connectivity maintenance in the case of a power or communications failure with the Endpoint Server. You can learn more in the section of this document entitled [Dynamic IoT Registration and Communication Connection Maintenance](#Dynamic-IoT-Registration-and-Communication-Connection-Maintenance).  

### Raspberry Pi Zero 2W
A [Raspberry Pi Zero 2W](https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/) was chosen for the IoT device because of it’s low cost and limited capabilities to stress the performance of the reference implementation. The Raspberry Pi Zero 2W has built in Wi-Fi networking to support testing behind a firewall. Since the goal of this project was to use JavaScript wherever possible, the npm libraries [raspi](https://www.npmjs.com/package/raspi), [raspi-gpio](https://www.npmjs.com/package/raspi-gpio), and [raspi-i2c](https://www.npmjs.com/package/raspi-i2c) provide support for interfacing the Raspberry Pi hardware with the Node server running on port 3000 of the Raspberry Pi. If you are using hardware other than Raspberry Pi, you can obtain broader JavaScript hardware support from [Johnny-Five](https://johnny-five.io/).

### Raspberry Pi Temperature Sensor Circuit
The Raspberry Pi Zero 2W has a [40 pin GPIO header](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html#gpio) that provide General Purpose I/O (GPIO) pins which can be configured as either general-purpose input, general-purpose output, or as one of up to six special alternate settings, the functions of which are pin-dependent. For our IoT device, GPIO12 was configured as an output port pin used to drive an LED heartbeat indicator showing that the Node server is running **iotpi**. GPIO2 and GPIO3 were configured to support the [I2C two wire communication protocol](https://www.abelectronics.co.uk/kb/article/1090/i2c-part-1-introducing-i2c) by providing the I2C SDA (serial data) and SCL (serial clock) respectively. A temperature sensor using a [Texas Instruments TMP102](https://www.ti.com/product/TMP102) was made available by interfacing a [SparkFun Digital Temperature Sensor Breakout - TMP102](https://www.sparkfun.com/sparkfun-digital-temperature-sensor-breakout-tmp102.html) to the I2C bus. The I2C bus can be used to interface a wide variety of compatible hardware and sensors to the Raspberry Pi.

#### Prototype Board
You will need to build the Raspberry Pi Temperature Sensor Circuit using a prototype board and connect the circuit to the correct Raspberry Pi GPIO pins. The following is a material list of the items you will need. You can get these items from [SparkFun Electronics](https://www.sparkfun.com/).

| QTY | SKU | Description |
|-----|-----|-------------|
| 1 | COM-10632 | Diffused LED - Red 10mm |
| 1 | PRT-00116 | Break Away Headers - Straight |
| 1 | PRT-12002 | Breadboard - Self-Adhesive (White) |
| 1 | PRT-12794 | Jumper Wires - Connected 6" (M/F, 20 pack) |
| 1 | PRT-14491 | Resistor 10K Ohm 1/4 Watt PTH - 20 pack (Thick Leads) |
| 1 | SEN-13314 | SparkFun Digital Temperature Sensor Breakout - TMP102 |

#### Wiring the Prototype Boad
You can follow the steps below to wire the Temperature Sensor Circuit. The table illustrates the interface between the Raspberry Pi Zero 2W 40 pin GPIO header and the prototype board.

| Raspberry Pi Zero 2W 40 pin GPIO header | Prototype Board |
|-----------------------------------------|-----------------|
| 3V3, pin 1 (3.3v)                       | Power (3.3v) | 
| GPIO12, pin 32 (output)                 | LED | 
| GPIO2, pin 3 (SDA)                      | TMP102 SDA, pin 3 | 
| GPIO3, pin 5 (SDL)                      | TMP 102 SDL, pin 4 |  
| GND, pin 6                              | Ground | 

Use the following steps to wire your prototype board:
1.	Take a jumper wire from the Raspberry Pi 40-pin header pin 1 (3.3v) and connect it to the breadboard’s `+` (Power) rail.

2.	Place a jumper wire from the Raspberry Pi 40-pin header pin 6 (GND) and connect it to the breadboard’s `–` (Ground) rail.
3.	Connect the cathode of the LED to the Ground rail.
4.	Connect the anode of the LED to one end of a 10k ohm resistor.
5.	Connect the other end of the 10k ohm resistor to GPIO12, pin 32 using a jumper wire.
6.	Create a 6 pin straight header by breaking off a group of 6 pins from the straight breakaway header.
7.	Solder the 6 pin straight header onto the SparkFun Digital Temperature Sensor Breakout - TMP102. Solder the header on the side of the breakout board that contains the TMP102.
8.	Press the assembled temperature sensor into one column on the breadboard (e.g. column f) so that all pins span 6 rows (e.g. rows 19, 20, 21, 22, 23, 24).
9.	Connect pin 1 of the TMP102 to the Ground (`-`) rail.
10.	Connect pin 2 of the TMP102 to the Power (`+`) rail.
11.	Connect pin 3 of the TMP102 to GPIO2, pin 3 using a jumper wire.
12.	Connect pin 4 of the TMP102 to GPIO3, pin 5 using a jumper wire.


### Testing the Sensor Circuit Hardware
The **iotpi** folder provides two python scripts to test the prototype board hardware. The python script `blink.py` will blink the LED once per second. You can execute the script by navigating to the **iotpi** directory (`./iotpi`) on the Raspberry Pi terminal using either SSH or from the keyboard, mouse and display connected to the Raspberry Pi. From the Raspberry Pi terminal execute the command  `python blink.py` and observe the LED. If you don’t see the LED blinking approximately once per second, re-check the steps you followed to wire the prototype board.

The python script `tmp102.py` will capture the temperature from the TMP102 and blink the LED once per second displaying the temperature reading on the console. You can execute the script by navigating to the **iotpi** directory (`./iotpi`) on the Raspberry Pi terminal using either SSH or from the keyboard, mouse and display connected to the Raspberry Pi. From the Raspberry Pi terminal execute the command  `python tmp102.py` and observe the LED and console. If you don’t see the LED blinking and the temperature being reported approximately once per second to the console, re-check the steps you followed to wire the prototype board.

If you would like to investigate the various functions that the [TMP102](https://www.ti.com/product/TMP102) provides as well as gaining a familiarity with the I2C bus, you can use the [I2C tools in Linux](https://www.abelectronics.co.uk/kb/article/1092/i2c-part-3-i2c-tools-in-linux) from the command line. For example, you can get a listing of all the I2C devices connected to your Raspberry Pi by using by entering the command `i2cdetect -y 1` from the Raspberry Pi terminal. You should see a map of all the active I2C addresses connected to the I2C bus. In this case, the only device connected to the I2C bus is the TMP102 which reveals its default address as `0x48`.

You can also read the temperature of the [TMP102](https://www.ti.com/product/TMP102) by using the command `i2cget -y 1 0x48 0x00 w` from the terminal. The temperature register of the TMP102 is configured as a 12-bit read-only register. Byte 1 is the most significant byte followed by byte 2, the least significant byte. The iotpi software is used to convert the 2 bytes returned to a temperature value. The conversion algorithm can be found in the TMP102 datasheet.


### Installing the Raspberry Pi Operating System
The Raspberry Pi Zero 2W uses a microSD card to store the operating system and provides additional storage for programs and utilities. For this project, a 32GB microSD card was used. [The Raspberry Pi Imager](https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-the-operating-system) is a tool that helps you download and write images to the microSD card on macOS, Windows, and Linux. Imager includes many popular operating system images for Raspberry Pi. 

1. Using the Imager, 1) choose Raspberry Pi Zero 2W as the Raspberry Pi Device, 2) select the Raspberry Pi OS (64-bit) which is a port of Debian Bookworm with the Raspberry Pi Desktop; and 3) choose the storage location that will be used to write the operating system to the microSD card. In this case, a Windows PC was used to write the image to the microSD card mounted as a generic SD card using the Imager. `Press the Next button`.

2. You will now see a dialog box entitled `“Use OS customization?”` `Press the “NO” button`. You will get a warning that `“All existing data … will be erased. Are you sure you want to continue?”` `Press the “YES” button` to flash the microSD card with the operating system.

#### Boot the Raspberry Pi Zero 2W
Connect the Raspberry Pi Zero 2W to a display, keyboard and mouse. Once the microSD card has been flashed with the operating system, insert the microSD card into the Raspberry Pi Zero 2W microSD card reader. Power on the Raspberry Pi Zero 2W.  You will see a screen “Welcome to the Raspberry Pi Desktop” which begins the process of setting up the Raspberry Pi Zero 2W. A screen notifying you that “there are a few things to set up” will appear next. Go ahead and press the Next button and follow these steps:

1.	Set your country, language and time zone. Optionally select the use of the English language (if desired) and use US keyboard (if desired). Press the Next button.

2.	Create a user by setting a username and password. You will use these credentials to set up remote access to the Raspberry Pi Zero 2W using Secure Shell (SSH). Press Next when done.
3.	Select a Wi-Fi Network from the list. Press Next.
4.	Enter the password for the Wi-Fi Network. Press Next.
5.	Choose Browser. Both Chrome and Firefox web browsers are preinstalled on the Raspberry Pi. However, Raspberry Pi Zero 2W does not have enough resources to run either browser effectively. As a result, no browser was used on the IoT device for this project. Press the Next button.
6.	Update the Software. Press the Skip button. We are going to perform this step from the command line.
7.	Setup Complete. Press the Restart button. The new settings will take effect.

#### Update the Operating System, Install Node and npm
Once the Raspberry Pi Zero 2W reboots, open a terminal by clicking on the terminal icon in the top left of the menu bar. Enter the following commands:

1.	Use the `sudo apt-get update` command from the terminal to get operating system updates.

2.	Use the `sudo apt-get upgrade` command from the terminal to upgrade the operating system with the updates. This may take some time, be patient.
3.	Install Node by using the `sudo apt install nodejs` command from the terminal. Once done, make sure Node has been installed by entering `node -v` from the command line which should display the version of Node that has been installed. This may take some time, be patient.
4.	Install the Node Package Manager, npm, by using the `sudo apt install npm` command from the terminal. Once done, make sure npm has been installed by entering `npm -v` from the command line which should display the version of npm that has been installed. This may take some time, be patient.
5.	Close the terminal


### Configuring the Raspberry Pi Zero 2W Hardware
It’s now time to configure the Raspberry Pi Zero 2W to enable SSH and I2C. From the top left of the menu bar select the Raspberry icon, Preferences, Raspberry Pi Configuration. This opens the Raspberry Pi Configuration dialog box. Select the Interfaces tab. Perform the following steps:

1.	Turn on SSH
2.	Turn on I2C
3.	Press the OK button. The configuration will be updated. No reboot is necessary.


### Set Up SSH
You can remotely control your Raspberry Pi from another device on your local network using [Secure Socket (SSH)](https://www.raspberrypi.com/documentation/computers/remote-access.html#ssh) which provides secure access to the Raspberry Pi from a remote terminal. We will also use Secure Copy Protocol (SCP) to move files back and forth between your local PC and the Raspberry Pi. Perform the following steps:

1.	Hover over the network icon in the Raspberry Pi Zero 2W system tray, and a tooltip will appear. This tooltip displays the name of the network you’re currently connected to and your IP address.

2.	Open a terminal window **on your local PC** and enter the following command, replacing the `<ip address>` placeholder with the IP address of the Raspberry Pi you’re trying to connect to and `<username>` with your username: `ssh <username>@<ip address>`
3.	When the connection works, you will see a security warning. Type `“yes”` to continue. You will only see this warning the first time you connect.
4.	Enter your account `<password>` when prompted.
5.	You should now see the Raspberry Pi command prompt: `<username>@raspberrypi:~ $`
6.	You are now connected to the `/home/<username>` directory of the Raspberry Pi remotely, and can execute commands.


### Installing iotpi
Navigate to the **saasmvp-iot** directory on your local PC where you cloned the saasmvp-iot GitHub repository . You should see three directories (/endpoint, /iot, /iotpi) and two files LICENSE.txt and README.md (this file). 

1.	From the local PC terminal run the command:
`scp -r ./iotpi <username>@<ip address>:/home/<username>/iotpi` to copy the **iotpi** folder to the Raspberry Pi Zero 2W.

2.	If you ever need to copy the **iotpi** folder back to your PC’s local directory use the following command:
`scp -r <username>@<ip address>:/home/<username>/iotpi .` (don’t forget the trailing period).

3.	From the Raspberry Pi Zero 2W terminal, navigate to the **iotpi** folder and run the command `npm install` to install the Node dependencies required to run **iotpi**.

#### Set the IoT Device Endpoint Server IP Address
Navigate to the **iotpi** directory (`./iotpi`) and edit the file `app.js` by entering the command `nano app.js`. Find the variable `endpointIP` and set the variable to the IP address of **your** Endpoint Server (e.g. '192.168.1.13'). Press `Ctrl+X`. You will then see the message `Save modified buffer?` Be sure to type `Y` to save the modified file.

#### Running iotpi 
You can now run the Node server IoT application on the Raspberry Pi Zero 2W. Navigate to the **iotpi** directory (`./iotpi`) from a remote terminal using SSH or directly to the terminal on the the Raspberry Pi Zero 2W using the attached display, keyboard and mouse. Perform the following steps:

1.	Enter the command `sudo node app.js` from the command line in the **iotpi** directory. Make sure the Docker desktop is not currently running the Endpoint Server.

2.	With the Endpoint Server paused, the terminal on the Raspberry Pi Zero 2W displays a timestamp and the message `“Awaiting IoT Endpoint Connection …”` over and over until a connection with the Endpoint Server is established. Stop the IoT application by pressing `Ctrl+C` on the Raspberry Pi terminal.

3.	Start the Endpoint Server in the Docker Desktop by pressing the blue square button with the embedded white triangle. 

4.	Again, Enter the command `sudo node app.js` from the command line in the **iotpi** directory. You will see the following output on the terminal display:

```
2025-02-10T23:07:58.710Z Node Up and Running on Port 3000
2025-02-10T23:07:59.220Z Awaiting IoT Endpoint Connection ...
….
2025-02-10T23:08:02.417Z Awaiting IoT Endpoint Connection ...
{
  message: 'IoT Configuration',
  iotip: '192.168.1.19',
  ts: 1739228882268
}
2025-02-10T23:08:02.641Z IoT Connected to the Endpoint.
2025-02-10T23:08:02.974Z Temperature: 80.94F
2025-02-10T23:08:04.201Z Temperature: 80.94F
2025-02-10T23:08:04.818Z Temperature: 81.05F
2025-02-10T23:08:05.755Z Temperature: 80.94F
```

Here’s what is happening. 1) the IoT Node Server and IoT application (app.js) starts on port 3000; 2) The IoT device is waiting to establish a connection with the Endpoint Server; 3) The IoT device uses a HTTP GET request to the Endpoint Server REST API `/iot/config` endpoint with the IP address of the IoT device in the “x-iot-ip” HTTP header of the GET request. The use of the “x-iot-ip” header allows for dynamic registration of the IoT device with the Endpoint Server from behind a firewall. The Endpoint Server returns a json message to the IoT device with a confirmation message, echoing the IoT IP address back to the IoT device, and a Linux epoch timestamp. Additional initialization and configuration data could be included in this json message; 4) a near real-time bi-directional [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) communication path is opened between the IoT device and the Endpoint Server and the message `“IoT connected to the Endpoint”` is displayed. The npm library [ws](https://www.npmjs.com/package/ws) was used in **saasmvp-iot** to provide both the client and server WebSocket implementation; 5)  Temperature data from the IoT sensor circuit on the prototype board is collected approximately once per second and sent in near real-time to the Endpoint Server. The IoT device WebSocket is also listening for near real-time commands from the Endpoint Server. The Endpoint Server client browser dashboard can be used to send a command to the IoT device to toggle the temperature scale from Fahrenheit to Celsius and vice-versa. Not entirely pragmatic, but a simple demonstration of providing a command to an IoT device using WebSocket to change the IoT behavior. 

5.	A shell script (`iot-post-test.sh`) is available in the **iotpi** directory (`./iotpi`) to exercise the HTTP POST REST API interaction between the IoT device and the Endpoint Server. From the Raspberry Pi terminal, navigate to the **iotpi** directory and enter the command `./iot-post-test.sh` to send a HTTP POST REST API message to the Endpoint Server with a simple json body `{iot: ts}` where ts is the timestamp of the Linux epoch. If the Endpoint Server is running and everything is working correctly, you will see the json message `{“message”: “POST loopback <ts>”}` displayed on the Raspberry Pi terminal where ts is the timestamp of the Linux epoch echoed back to the IoT device from the Endpoint Server.

#### Dynamic IoT Registration and Communication Connection Maintenance 

The following steps can be used to explore the use of dynamic IoT Endpoint Server registration which includes a primer on how communications are established and maintained between the IoT device and the Endpoint Server in the case of a connectivty issue or power failure.

1)	Using Docker Desktop navigate to Containers, Endpoint and make sure the Endpoint Server is running.

2)	With the Endpoint Server running, open a terminal on the Raspberry Pi Zero 2W IoT device and start the IoT device (`./home/<username>/iotpi/sudo node app.js`).

3)	After observing the expected interaction between the IoT device and the Endpoint Server, stop the IoT device. From the IoT terminal execute a `Ctrl+C` command. Keep the Endpoint Server running.

4)	Start the IoT device (`./home/<username>/iotpi/sudo node app.js`) and observe the behavior of [Running **iotpi** step 4](#running-iotpi). The interested reader may want to examine the `getIotIP()`, `getCommand()` and `regIotDevice()` functions in **iotpi** `app.js` code that implements 1) dynamic IoT registration with the Endpoint Server; and 2) the establishment and maintenance of connectivity in the case of a power failure or Endpoint Server communication error.

5)	Now leaving the IoT device running, stop the Endpoint Server by navigating to the Docker Desktop Containers, Endpoint and stop the Endpoint Server by pressing the blue square button with the embedded white square on the right top menu.

6)	In the IoT device terminal console, you should see something like the following:

```
2025-02-11T01:31:56.259Z Temperature: 79.93F
2025-02-11T01:31:57.257Z Temperature: 79.93F
2025-02-11T01:31:58.260Z Temperature: 79.93F
2025-02-11T01:31:59.260Z Temperature: 79.93F
2025-02-11T01:31:59.593Z IoT Endpoint Communication Failure. Attempting Restart ...
2025-02-11T01:31:59.647Z IoT Endpoint Communication Failure. Attempting Restart ...
…
```
The temperature messages are normal and customary when there isn’t a communication problem. However, should the IoT device loose connectivity with the Endpoint Server, you will see the `“IoT Endpoint Communication Failure. Attempting Restart ...”` message in the IoT console. The IoT device will endlessly attempt to re-establish communication with the Endpoint Server by repeatedly trying to re-register the IoT device with the Endpoint Server. 

7)	Start the Endpoint Server by navigating to the Docker Desktop, Containers, Endpoint and start the Endpoint Server by pressing the blue square button with the embedded white triangle on the right top menu.

8)	In the IoT device terminal console, you should see something like the following:
```
…
2025-02-11T01:32:15.282Z IoT Endpoint Communication Failure. Attempting Restart ...
2025-02-11T01:32:16.341Z IoT Endpoint Communication Failure. Attempting Restart ...
2025-02-11T01:32:17.277Z Temperature: 79.93F
2025-02-11T01:32:18.278Z Temperature: 79.93F
2025-02-11T01:32:19.281Z Temperature: 79.93F
2025-02-11T01:32:20.285Z Temperature: 79.93F
```

Once the Endpoint Server has regained connectivity with the network, the IoT device will automatically re-register itself with the Endpoint Server and the normal and customary temperature messages will be reported to the console.


## Open Areas for Further Research and Development
**saasmvp-iot** has several open areas of investigation, research and development available for community members including, but not limited to, the following. If you are interested in contributing to **saasmvp-iot**, let’s have a discussion. <a href="mailto:support@saasmvp.org?&subject=Contributing to saasmvp-iot&body=Please%20contact%20me.%20I%20am%20interested%20in%20contributing%20to%20the%20saasmvp-iot%20project.">Contact</a> **The saasmvp Project** and we’ll schedule a time to talk. 

1.	**Security.** There are currently no security mechanisms implemented in **saasmvp-iot** including TLS/SSL, REST API security, or WebSocket security (wss). 

2.	**Firmware Updates.** There is currently no mechanism other than a simple Endpoint Server GET request to check for, retrieve and correctly install an IoT software update.

3.	**Streams.** A further area of open research and development would be the inclusion of streams in the architecture to allow for near real time audio and video to be sent from the IoT device to the Endpoint Server.

4.	**Multiple IoT Devices.** The reference implementation is currently limited to one IoT device. Support for multiple IoT devices is an open area of research and development.

5.	**Testing with a Public Internet Server.** All testing to date has been on an internal network. In order to test on a public network, the appropriate security mechanisms must be in place.

6.	**saasmvp framework Integration.** Architectural integration with [The saasmvp Project](https://saasmvp.org/) [saasmvp framework](https://github.com/rickgregg/saasmvp-framework)
.

## Support
FREE individual support is available for [**registered users**](https://saasmvp.org/reference/framework/support.html) at **support@saasmvp.org**. [**Public support**](https://github.com/rickgregg/saasmvp-iot/issues) is available anytime.

## License
[**MIT**](https://github.com/rickgregg/saasmvp-iot/blob/main/LICENSE.txt)
Copyright (c) 2025, The saasmvp Project

