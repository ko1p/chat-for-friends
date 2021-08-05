const {PORT} = require('./config.js');
// const PeerServer = require('peer').PeerServer;
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// const port = process.env.PORT || 3000;
const socket = require('./socket/socket');

const bodyParser = require('body-parser'); // чтобы сервер мог распарсить body с информацией

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

socket(server); // логика

server.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`)
});