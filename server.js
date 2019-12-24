const net = require('net')
const uuidv4 = require('uuid/v4');

const port = process.argv[2]
let clientsList = []

function broadCast(msg, id) {
  clientsList.forEach(client => {
    if (id && id == client.id) return 
    client.write(msg)
  })
}

const server = net.createServer((socket) => {
  // FIXME: not on create server but on client connecting to server
  // should generate an spicific id for that client
  // TODO: add an on client connected to the server event
  socket.id = uuidv4()
  socket.on('data', (e) => {
    const msg = `client ${socket.id}: ${e.toString()}`
    broadCast(msg, socket.id)
    process.stdout.write('> ')
  })

  clientsList.push(socket)

  socket.write(`Welcome to Chat! online now: ${clientsList.length}`)
  const msg = `client ${socket.id} joined! online now: ${clientsList.length}`
  console.log(msg)
  broadCast(msg, socket.id)
  process.stdin.pipe(socket)

  socket.on('close', () => {
    clientsList = clientsList.filter(client => client.id != socket.id)
    console.log(`client ${socket.id} left! online now: ${clientsList.length}`)
    broadCast(`client ${socket.id} left! online now: ${clientsList.length}`)
  })
})

server.listen(port, () => {
  console.log('socket server running on port', port)
})
