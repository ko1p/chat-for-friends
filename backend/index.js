const {PORT} = require('./config.js');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // чтобы хром не ругался на CORS
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
      }
});
const bodyParser = require('body-parser'); // чтобы сервер мог распарсить body с информацией
const {getCurrentTime} = require('./utils/getCurrentTime'); // утилита преобразующая текущую дату в удобный формат

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rooms = new Map(); // здесь будем хранить информацию о созданных комнатах и юзерах, которые там сейчас находятся

io.on('connection', (socket) => {

    socket.emit('user_connect', socket.id); // сообщаяем клиенту наш soketId

    socket.on('chat_join', ({chatId, name}) => { // при событии chat_join, присоединяемся к комнате, с chatId и name, которую указал клиент
        socket.join(chatId); // присоединяем его к комнате, с chatId и name, которую указал клиент
        if (!rooms.has(chatId)) { // добавляем в коллекцию нового юзера либо комнату и юзера если она ещё не была создана
            rooms.set(
              chatId,
              new Map([
                ['users', new Map().set(socket.id, name)],
                ['messages', []],
              ]),
            );
        } else {
            rooms.get(chatId).get('users').set(socket.id, name);
        }
        const users = [...rooms.get(chatId).get('users').values()]; // формируем список пользователей в конкретной комнате
        io.to(chatId).emit('user_join', users); // высылаем список клиентов на "фронт"
    })

    socket.on('chat_message', ({chatId, name, msg}) => { // при событии "chat_mesage"
        const time = getCurrentTime(); // формирую текущее время сообщения
        const messageInfo = { // собираю в один объект, дату, текст, имя пользователя
            msg, time, name
        };
        rooms.get(chatId).get('messages').push(messageInfo); // добавляю объект с информацией в "базу данных" на сервере
        io.to(chatId).emit('chat_message', messageInfo); // высылаю данные в конкретную комнату
    })

    socket.on('disconnect', () => { // при событии отключения от сокета
        rooms.forEach((value, chatId) => { // пробежится по всем значениям(каждой комнате), зайдёт в юзерс и удалит его если soket.id совпадет с удаляемым
            if (value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()]; // сформирует новый список пользователей (без удалённого)
                socket.to(chatId).broadcast.emit('user_disconnect', users); // вышлет новый список юзеров на "фронт"
              }
        })
    })
})

http.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`)
});
