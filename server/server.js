const http = require('http');

const server = http.createServer();
const port = 8080;
server.listen(port);

console.log('Server started');

const io = require('socket.io').listen(server);

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  console.log('User connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`))
