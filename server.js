const net = require('net');
const port = process.argv[2];

function genRan(){
  return (Math.random() * 1000000000000000000).toString().substr(0, 6);
}

function broadCast(msg, id) {
  if(id){
    clients.map(c => {
      if(id != c.id){
        c.write(msg);
      }
    })
  } else {
    clients.map(c => c.write(msg));
  }
}

let clients = [];


const server = net.createServer((socket) => {
  socket.id = genRan();
  socket.on('data', e => {
    let msg = `client ${socket.id}: ` + e.toString();
    console.log(msg);
    broadCast(msg, socket.id);
    process.stdout.write("> ");
  });

  clients.push(socket);
  socket.write(`Welcome to Chat! online now: ${clients.length}`);
  let msg = `client ${socket.id} joined! online now: ${clients.length}` 
  console.log(msg);
  broadCast(msg, socket.id);
  process.stdin.pipe(socket);

  socket.on('close', () => {
    clients = clients.filter(c => c.id != socket.id);
    console.log(`client ${socket.id} left! online now: ${clients.length}`);
    broadCast(`client ${socket.id} left! online now: ${clients.length}`);
  })
});

server.listen(port, () => {
  console.log("socket server running on port", port);
})
