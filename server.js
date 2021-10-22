const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app')();

const PORT = 3011;

const httpServer = http.createServer(app);

httpServer.listen(PORT);
console.log(`Listening on port ${PORT}`);
