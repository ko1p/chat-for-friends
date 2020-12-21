const {PORT} = require('./config.js');
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

