const net = require('net');
const port = process.argv[2];

const client = net.createConnection({
  port,
  host: 'localhost'
});


client.on('connect', () => {
  console.log('connected to socket server');
  client.on('data', e => {
    console.log(e.toString());
    process.stdout.write("> ");
  });

  console.log('type a message to send to server');
  process.stdin.pipe(client);

  client.on('close', e => {
    console.log('connection closed to server. Exiting...');
    setTimeout(() => process.exit(0), 500);
  })
});

client.on('error', err => {
  console.log("ERROR", err)
  console.log("Waiting to exit....")
  setInterval(() => {
  }, 0);
  setTimeout(() => process.exit(0), 5000);
})

