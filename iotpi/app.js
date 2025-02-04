//app.js
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

let scale = "F" //"F" - fahenheit, "C" - Celsius
const ipaddr = ""
let ts = ""
let temp = ""
let tempr = {"temperature": temp, "scale": scale, "ipaddr": ipaddr, "ts": ts, }

//Set up a headless websocket server that prints any events that come in
const wsServer = new ws.Server({ noServer: true })
wsServer.on('connection', socket => {
  socket.on('message', function message(data, isBinary) {
    const msg = isBinary ? data : data.toString()
    //decode incoming websocket message and take action
    const command = JSON.parse(msg)
    //const command = {"cmd": "scale", "scale": document.getElementById("scale").value, "ts": Date.now()}
    switch (command.cmd){
      case "scale":
        scale = command.scale
        break
      default:
        //error
    }
  })
})

//set up node server
const server = app.listen(port, () => {
  console.log(`Node listening on port ${port}`)
  //IoT Initialization
  tempr.ipaddr = getIp()
  getCommand('config')
})

//set up websocket server by upgrading node server with websocket capabilities
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request)
  })
})

//** IoT MONITORING LOOP **
setInterval( () => {
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
        console.log(temp.toString() + '' + scale)
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

    //send data to websocket endpoint server
    const client = new ws('ws://192.168.1.13:3000')
    client.on('open', () => {
      client.send(JSON.stringify(tempr))
    })

    //

  });//eo raspi.init()
}, 1000)

//get the configuration file for the iot device (cmd) = 'config'
//get a software update file for the iot device (cmd) = 'update'
const getCommand = async (cmd) => {
  let url = 'http://192.168.1.13/iot'
  switch(cmd) {
    case 'update':
      url = url + '/update'
      break;
    case 'config':
      url = url + '/config'
      break;
    default:
      //not found
  }

  try {
    const response = await fetch(url, {
      headers: {
        'x-iot-ip': tempr.ipaddr
      }
    })
    if(!response.ok){
      throw new Error(`Response status: ${response.status}`)
    }
    const json = await response.json()
    console.log(json)
  }catch(error){
    console.log(error)
  }
}

//send bulk data from iot device to endpoint
const postCommand = async () => {
  try {
    const response = await fetch('http://192.168.1.13/iot/data', {
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

const getIp = () => {
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
