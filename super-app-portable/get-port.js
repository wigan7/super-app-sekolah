const net = require('net');
const server = net.createServer();
server.listen(0, () => {
  console.log(server.address().port);
  server.close();
});
