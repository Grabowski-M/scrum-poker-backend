const http = require('http');
const app = require('./src/app')();

const httpServer = http.createServer(app);

httpServer.listen(3011);
