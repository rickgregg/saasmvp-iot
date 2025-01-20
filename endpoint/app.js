//endpoint
const express = require('express')
const ws = require('ws');
const cors = require('cors');
const app = express()
const port = 3000

//need CORS to allow localhost (endpoint, IoT devices) port addresses
app.use(cors())

// https://masteringjs.io/tutorials/express/websockets
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

//Endpoint Home Page
app.get('/', (req,res) => {
  res.sendFile("/home/rgregg/saasmvp-iot/endpoint/index.html")
})

//REST GET route - called by IoT fetch()
app.get('/iot/update', (req, res) => {
  res.json({message: "GET Firmware Update " + Date.now()})
})

//REST GET route - called by IoT fetch()
app.get('/iot/config', (req, res) => {
  res.json({message: "GET Configuration File " + Date.now()})
})

//REST POST route - called by IoT fetch()
app.use(express.json())
app.post('/iot/data', (req, res) => {
  let data = req.body
  console.log(data)

  res.json({message: "Data POSTED to Endpoint " + data.iot})
})

//`server` is a vanilla Node.js HTTP server
const server = app.listen(port, () => {
  console.log(`Endpoint listening on port ${port}`)
})

// upgrade the vanilla `server` using the same WebSocket upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
//
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});