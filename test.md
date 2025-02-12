# Introduction
**saasmvp-iot** is a work-in-progress reference implementation that teaches how an [Internet-of-Things (IoT)](https://en.wikipedia.org/wiki/Internet_of_things) device behind a firewall can  communicate with a web server on the public Internet. This simple implementation serves as a basis for **Minimally Viable Product (MVP) IoT Software-as-a-Service (SaaS)** applications. The software uses [Node](https://nodejs.org/en), [Express](https://expressjs.com/), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [REST APIs](https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/) and [WebSockets](https://developer.mozilla.org/en-US/docs/Glossary/WebSockets) on both the IoT device and the Endpoint Server. The reference implementation IoT hardware is a low-cost [Raspberry Pi Zero 2W](https://www.raspberrypi.com/products/raspberry-pi-zero-2-w/). The IoT device sends temperature readings to the Endpoint Server once per second. In turn, the Endpoint Server client browser dashboard can send a message to the IoT device to change the temperature scale. The dashboard displays near real time temperature updates from the IoT device. Additionally, the software maintains connectivity between the IoT device and the Endpoint Server in the case of a power or communications interruption. The Endpoint Server can run as a stand-alone Node server for local host testing or inside a [Docker](https://www.docker.com/) container containing a [nginx](https://nginx.org/en/) proxy for use in network testing.

# The saasmvp Project
**saasmvp-iot** is an open source project available under the MIT license and is sponsored by The saasmvp Project. The saasmvp Project allows you to spin up a SaaS Minimally Viable Product Fast. Quickly Discover your Customer. No Assembly Required. Find out more and get documentation for [**The saasmvp Project**](https://saasmvp.org). 

## Contributing to saasmvp-iot
**saasmvp-iot** has several open areas [link to open areas below] of investigation, research and development available for community members. If you are interested in contributing to saasmvp-iot, let’s have a discussion. Contact The saasmvp Project and we’ll schedule a time to talk. [put in the code to open up an email client with the subject line “Contributing to saasmvp-iot”]

## Documentation
Get documentation in this README file for **saasmvp-iot**. You can find the documentation here for [**The saasmvp Project**](https://saasmvp.org).

# saasmvp-iot
The **saasmvp-iot** project GitHub repository consists of three directories:
1.	The **endpoint** directory contains the Endpoint Server.
2.	The **iot** directory has a simulated IoT device that is used to demonstrate the fundamental use of WebSocket’s and the REST API with the Endpoint Server.
3.	The **iotpi** directory contains the software that is installed on the Raspberry Pi Zero 2W and implements both 1) dynamic registration of the IoT device with the Endpoint Server; and 2) the maintenance of connectivity in the case of a power or communications failure with the Endpoint Server.
You can clone the GitHub repository to your local machine using the following command from your terminal: https://github.com/rickgregg/saasmvp-iot.git

## endpoint
Once the saasmvp-iot project has been cloned to your local PC, navigate to the endpoint directory using your terminal. Install the dependencies required to run the saasmvp-iot software by performing the following steps from your local PC terminal:
1.	Update Linux using the command: sudo apt-get update && sudo apt-get upgrade
2.	Install Node using the command: sudo apt install nodejs
3.	Install npm using the command: sudo apt install npm
4.	Install the dependencies with the command: npm install
5.	Download and install Docker Desktop. The Endpoint Server builds and configures a nginx proxy server that is connected in a Docker Network to the Node server that runs the Endpoint Server software. The Endpoint Server is made available on your local machine at http port 80. The Endpoint Server provides a browser client on http port 80 consisting of a near real time dashboard to control the IoT device temperature scale (Fahrenheit, Celsius) and display temperature updates from the IoT device. CAUTION: There is currently no security mechanisms implemented in saasmvp-iot including TLS/SSL, REST API security, or WebSocket security (wss). Security will be addressed as the project progresses. 
6.	Open Docker Desktop. Build and run the Endpoint Server Docker container by running the following command from the terminal in the endpoint directory:  docker compose up –-build -d
7.	You should see the following in the Docker Desktop by navigating to Containers, Endpoint:
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

8.	If you open your browser and navigate to http://localhost, you will see the IoT Endpoint Server dashboard. Observe the message “Awaiting IoT Endpoint Registration …” with the spinning progress indicator. The Endpoint Server is waiting for the IoT device to register with and receive any initialization data from the IoT Endpoint Server. Please refer to the iotpi section of this document for further information. Once the IoT device has completed this handshake, you will see the IoT device temperature data forwarded in near real time to the dashboard once per second. You will now see the following on the dashboard and in the Docker Desktop by navigating to Containers, Endpoint:

2025-02-09 13:39:45 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129986136}
2025-02-09 13:39:46 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129987138}
2025-02-09 13:39:47 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129988141}
2025-02-09 13:39:48 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129989138}
2025-02-09 13:39:49 nodeapp  | {"temperature":"76.89","scale":"F","ipaddr":"192.168.1.19","ts":1739129990140}

From the dashboard, change the temperature scale from Fahrenheit to Celsius. This action commands the IoT device to change the temperature scale. You will now see the following on the dashboard and in the Docker Desktop by navigating to Containers, Endpoint:

2025-02-09 13:39:50 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129991140}
2025-02-09 13:39:51 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129992140}
2025-02-09 13:39:52 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129993151}
2025-02-09 13:39:53 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129994148}
2025-02-09 13:39:54 nodeapp  | {"temperature":"24.94","scale":"C","ipaddr":"192.168.1.19","ts":1739129995170}

9.	Stop the Docker container by navigating to Containers, Endpoint and clicking on the stop button (blue square button with embedded white square). This simulates the loss of connectivity with the IoT Endpoint Server. Please refer to the iotpi section of this document for further information. The IoT device continues to collect temperature information along with attempting to re-establish communication with the Endpoint Server. 
10.	Start the Docker container by navigating to Containers, Endpoint and clicking on the start button (blue square button with embedded white right triangle). The IoT device will automatically re-establish communication with the Endpoint Server and continue to report temperature data to the Endpoint Server and dashboard.

## iot
Blind. Deaf and Dumb.

## iotpi
Blind. Deaf and Dumb
Need an introduction the comprises a wholistic discussion of both hardware and software!
Reference the discussion in the section entitled Dynamic IoT Registration and Communication Connection Maintenance

### Raspberry Pi Zero 2W
Blind. Deaf and Dumb.

### Raspberry Pi Temperature Sensor Circuit
Blind. Deaf and Dumb.

#### Prototype Board
Blind. Deaf and Dumb.

#### Wiring the Prototype Boad
Blind. Deaf and Dumb.

#### Steps
Blind. Deaf and Dumb.

### Testing the Sensor Circuit Hardware
Blind. Deaf and Dumb.

### Installing the Raspberry Pi Operating System
Blind. Deaf and Dumb.

#### Boot the Raspberry Pi Zero 2W
Blind. Deaf and Dumb.

#### Update the Operating System, Install Node and npm
Blind. Deaf and Dumb.

### Configuring the Raspberry Pi Zero 2W Hardware
Blind. Deaf and Dumb.

### Set Up SSH
Blind. Deaf and Dumb.

### Installing iotpi
Blind. Deaf and Dumb.

#### Running iotpi
Blind. Deaf and Dumb.

#### Dynamic IoT Registration and Communication Connection Maintenance
Blind. Deaf and Dumb.

## Open Areas for Further Research and Development
Blind. Deaf and Dumb.

## Support
Blind. Deaf and Dumb.

## License
Blind. Deaf and Dumb.
