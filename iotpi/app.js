/*
** app.js
** iotpi - Raspberry Pi Zero 2W IoT Node Server
**
** richard l. gregg
** The saasmvp Project
** https://saasmvp.org
** February 8, 2025
*/
const express = require('express')
const ws = require('ws')
const os = require('os')
const app = express()
const port = 3000

const raspi = require('raspi');
const I2C = require('raspi-i2c').I2C;
const tmp102Address = 0x48
const tmp102TempReg = 0x00
const gpio = require('raspi-gpio');
const LOW = 0;
const HIGH = 1;

let scale = "F" //"F" - Fahrenheit, "C" - Celsius
const ipaddr = ""
let ts = ""
let temp = ""
let tempr = {"temperature": temp, "scale": scale, "ipaddr": ipaddr, "ts": ts, }
let initFlag = false
let connErr = false
let logFlag = true

//Endpoint Server IP Address
const endpointIP = '192.168.1.13'

//configure a headless websocket server, decode incoming websocket message and take action
const wsServer = new ws.Server({ noServer: true })
wsServer.on('connection', socket => {
  socket.on('message', function message(data, isBinary) {
    const msg = isBinary ? data : data.toString()
    //example command: const command = {"cmd": "scale", "scale": document.getElementById("scale").value, "ts": Date.now()}
    const command = JSON.parse(msg)
    switch (command.cmd){
      case "scale":
        //change the temperature scale
        scale = command.scale
        break
      default:
        //error
    }
  })
})

//set up node server
const server = app.listen(port, () => {
  if (logFlag) console.log(new Date(), `Node Up and Running on Port ${port}`)
  tempr.ipaddr = getIotIP()
  regIotDevice()
})

//set up websocket server by upgrading node server with websocket capabilities
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request)
  })
})

//** IoT LOOP **
setInterval( () => {
  iotLoop(initFlag)
}, 1000 )

//main IoT monitoring and control function
const iotLoop = (initFlag) => {
  if(initFlag){
    raspi.init(() => {
      //https://github.com/nebrius/raspi-i2c
      //read temperature
      const i2c = new I2C();
      i2c.readWord(tmp102Address, tmp102TempReg, (err,data) => {
        if(err == null){
          temp = data.toString(16)
          if(scale == "F"){
            //fahrenheit
            temp = ((((Number('0x' + temp.slice(2,4) + temp.slice(0,1)))*.0625)*1.8)+32).toFixed(2)
          } else {
            //celsius
            temp = ((Number('0x' + temp.slice(2,4) + temp.slice(0,1)))*.0625).toFixed(2)
          }
          tempr.temperature = temp
          tempr.scale = scale
          tempr.ts = Date.now()
          if (logFlag && !connErr) console.log(new Date(), 'Temperature: ' + temp.toString() + '' + scale)
        }
      })

      //https://github.com/nebrius/raspi-gpio
      //heartbeat led
      const gpio12 = new gpio.DigitalOutput('P1-32')
      if (gpio12.value == HIGH){
        gpio12.write(LOW)
      }else{
        gpio12.write(HIGH)
      }

      /*
      ** Establish connectivity between the IoT device and the Endpoint Server WebSocket
      **
      ** NOTE: by putting this in the init loop, connectivity can be automatically re-established
      ** when a connection that has already been established between the IoT device and the Endpoint Server
      ** and subsequently broken by the Endpoint Server is re-established by the Endpoint Server.
      */
      const client = new ws('ws://' + endpointIP + ':3000')
      client.on('open', () => {
        connErr = false
        client.send(JSON.stringify(tempr))
      })
      client.on('close', () => {
        connErr = true
        if (logFlag) console.log(new Date(), 'IoT Endpoint Communication Failure. Attempting Restart ...')
      })
      client.on('error', () => {
        //
      })

      //

    });//eo raspi.init()
  }//eo if(InitFlag)
}

//get the configuration file for the iot device (cmd) = 'config'
//get a software update file for the iot device (cmd) = 'update'
const getCommand = async (cmd) => {
  let url = 'http://' + endpointIP + '/iot'
  switch(cmd) {
    case 'update':
      url = url + '/update'
      break;
    case 'config':
      //IoT dynamic registration and initialization
      url = url + '/config'
      break;
    default:
      //not found
  }

  try {
    const response = await fetch(url, {
      headers: {
        //endpoint dynamic IoT registration header
        'x-iot-ip': tempr.ipaddr
      }
    })
    if(!response.ok){
      throw new Error(`Response status: ${response.status}`)
    }
    const json = await response.json()
    console.log(json)
  }catch(error){
    return false
  }
  return true
}

//send bulk data from iot device to endpoint
const postCommand = async () => {
  try {
    const response = await fetch('http://' + endpointIP + '/iot/data', {
      method: 'POST',
      body: JSON.stringify({iot: Date.now()}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if(!response.ok){
      throw new Error(`Response states: ${response.status}`)
    }
    const json = await response.json()
    console.log(json)
  } catch(error) {
    console.log(error)
  }
}

//get IoT IP address for dynakic registration with Endpoint Server
const getIotIP = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
              addresses.push(iface.address);
          }
      }
  }
  return addresses[0]
}

//register IoT device with Endpoint Server
const regIotDevice = async () => {
  if(!await getCommand('config')){
    if (logFlag) console.log(new Date(), 'Awaiting IoT Endpoint Connection ...')
    regIotDevice()
  } else {
    initFlag = true
    if (logFlag) console.log(new Date(), 'IoT Connected to the Endpoint.')
    return true
  }
}
