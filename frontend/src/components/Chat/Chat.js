import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import './Chat.css';
import {
    setChatUserList,
    setChatMessage,
    setChatMessages,
    setUserId
} from "../../store/actions/actions";
import {ChatInfo} from "../ChatInfo/ChatInfo";
import {ChatMessages} from "../ChatMessages/ChatMessages";
import {socket} from '../../socket/socket'

export const Chat = () => {
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('yourId', id => {
            dispatch(setUserId(id)); // добавил в state userId === socket.id
        });

        socket.emit("chat_join", {chatId: state.chatId, name: state.login, userId: state.userId}); // высылаю информацию с id чата и login для присоединения к комнате

        socket.on('user_disconnect', users => { // при событии дисконекта с сервера обновлю список пользователей в чате
            dispatch(setChatUserList(users));
        });

        socket.on('chat_message', (msgInfo) => { // если придёт сообщение, добавлю его в store
            dispatch(setChatMessage(msgInfo));
        });

        socket.on('user_join', (users, messages) => { // при присоединении к моей комнате обновлю список пользователей в чате
            dispatch(setChatUserList(users));
            if (state.chat.messages.length === 0) {
                dispatch(setChatMessages(messages));
            }
        })
        // eslint-disable-next-line
    }, [dispatch])

    return (
        <main className="main">
            <div className="chat">
                <ChatInfo/>
                <ChatMessages/>
            </div>
        </main>
    )
}

export default Chat;