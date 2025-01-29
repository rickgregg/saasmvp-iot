//app.js
const express = require('express')
const ws = require('ws')
const app = express()
const port = 3000

const raspi = require('raspi');
const I2C = require('raspi-i2c').I2C;
const tmp102Address = 0x48
const tmp102TempReg = 0x00
const gpio = require('raspi-gpio');
const LOW = 0;
const HIGH = 1;

//Set up a headless websocket server that prints any events that come in
const wsServer = new ws.Server({ noServer: true })
wsServer.on('connection', socket => {
  socket.on('message', function message(data, isBinary) {
    const msg = isBinary ? data : data.toString()
    //decode incoming websocket message and take action
    console.log(msg)
  })
})

//set up node server
const server = app.listen(port, () => {
	console.log(`Nodejs listening on port ${port}`)
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
    let temp = ''
    i2c.readWord(tmp102Address, tmp102TempReg, (err,data) => {
      if(err == null){
        temp = data.toString(16)
        temp = ((((Number('0x' + temp.slice(2,4) + temp.slice(0,1)))*.0625)*1.8)+32).toFixed(2)
        console.log(temp.toString() + ' F')
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

    //test endpoint rest api's
    getCommand('update')
    getCommand('config')
    postCommand()

    //send data to websocket endpoint
    const client = new ws('ws://192.168.1.13:3000')
    client.on('open', () => {
      const msg = ({message: 'IoT Monitoring Loop -> Endpoint ' + Date.now()})  //json
      client.send(JSON.stringify(msg))
    })

    //

  });//eo raspi.init()
}, 3000)


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
    const response = await fetch(url)
    if(!response.ok){
      throw new Error(`Response status: ${response.status}`)
    }
    const json = await response.json()
    console.log(json)
  }catch(error){
    console.log(error)
  }
}

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
