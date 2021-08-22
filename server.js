const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const PORT = 7071;
const wss = new WebSocket.Server({ port: PORT });
console.log(`Websockets waiting for connections on port ${PORT}`);

wss.on('connection', (ws) => {
  const id = uuidv4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  const clients = new Map();
  clients.set(ws, metadata);

  console.log(clients);
});
