//iot
//NOTE: If ypu start IoT device (localhost:3001) without starting Endpoint first (localhost:3000) you will get ECONNREFUSED Error
const express = require('express')
const ws = require('ws');
const app = express()
const port = 3001

/// https://masteringjs.io/tutorials/express/websockets
// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', function message(data, isBinary) {
    const msg = isBinary ? data : data.toString()
    //decode incoming data and process accordingly
    console.log(msg)
  })
});

//IoT Home Page
app.get('/', (req, res) => {
  res.sendFile("/home/rgregg/saasmvp-iot/iot/index.html")
})

//set up node server
const server = app.listen(port, () => {
  console.log(`IoT listening on port ${port}`)
})

//set up websocket server
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});

//** IoT MONITORING LOOP **
setInterval( () => {

  //send data to WebSocket endpoint
  const client = new ws('ws://localhost:3000');
  client.on('open', () => {
    const msg = ({message: "IoT Monitoring Loop -> Endpoint: " + Date.now()}) //json
    client.send(JSON.stringify(msg));
  });
 
}, 1000)