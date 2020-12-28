const {PORT} = require('./config.js');
// const PeerServer = require('peer').PeerServer;
const app = require('express')();
const http = require('http').createServer(app);
const soket = require('./soket/soket');
const bodyParser = require('body-parser'); // чтобы сервер мог распарсить body с информацией

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
soket(http);

http.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`)
});

// const peerServer = new PeerServer({ port: 9000, path: '/chat' });

// peerServer.on('connection', function (id) {
//     soket.emit('USER_CONNECTED', id);
//     console.log('User with #', id, ' was connected to PEER.');
//   });
  
//   peerServer.on('disconnect', function (id) {
//     soket.emit('USER_DISCONNECTED', id);
//     console.log('With #', id, 'user disconnected from PEER.');
//   });