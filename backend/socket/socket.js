module.exports = function socket(server) {
    const rooms = new Map(); // здесь будем хранить информацию о созданных комнатах и юзерах, которые там сейчас находятся
    
    const io = require('socket.io')(server, {
        cors: {
            origin: "*", // чтобы хром не ругался на CORS
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    const videoUsers = {};

    io.on('connection', socket => {
        socket.emit('user_connect', socket.id); // сообщаяем клиенту наш socketId

        if (!videoUsers[socket.id]) {
            videoUsers[socket.id] = socket.id;
        }

        socket.emit('yourId', socket.id); // сообщаяем клиенту наш socketId
        io.sockets.emit("allUsers", videoUsers, 'allusersVideo');

        socket.on('callUser', data => {
            console.log('Вызывают звонок')
            io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
        })

        socket.on('acceptCall', data => {
            console.log('Принимают звонок')
            io.to(data.to).emit('callAccepted', data.signal);
        })

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
            const keys = [...rooms.get(chatId).get('users').keys()];
            const usersInfo = [];
            users.forEach((user, index) => {
                usersInfo.push({name: user, id: keys[index]})
            }) // TODO переделать
            const messages = [...rooms.get(chatId).get('messages')];
            io.to(chatId).emit('user_join', usersInfo, messages); // высылаем список клиентов на "фронт"         
            console.log(rooms.get(chatId).get('users'));
        })

        socket.on('chat_message', ({chatId, name, msg}) => { // при событии "chat_mesage"
            const time = new Date(Date.now()); // формирую текущее время сообщения
            const messageInfo = { // собираю в один объект, дату, текст, имя пользователя
                msg, time, name
            };
            rooms.get(chatId).get('messages').push(messageInfo); // добавляю объект с информацией в "базу данных" на сервере
            io.to(chatId).emit('chat_message', messageInfo); // высылаю данные в конкретную комнату
            console.log(rooms.get(chatId).get('messages'));
        })

        socket.on('disconnect', () => { // при событии отключения от сокета
            rooms.forEach((value, chatId) => { // пробежится по всем значениям(каждой комнате), зайдёт в юзерс и удалит его если socket.id совпадет с удаляемым
                if (value.get('users').delete(socket.id)) {
                    const users = [...rooms.get(chatId).get('users').values()];
                    const keys = [...rooms.get(chatId).get('users').keys()];
                    const usersInfo = [];
                    users.forEach((user, index) => {
                        usersInfo.push({name: user, id: keys[index]})
                    }) // TODO переделать
                    socket.to(chatId).broadcast.emit('user_disconnect', usersInfo); // вышлет новый список юзеров на "фронт"
                    console.log(socket.id, 'закрыл чат')
                }

                // delete videoUsers[socket.id];
            })
        })
    })
}