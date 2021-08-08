import React, {useRef, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import './Chat.css';
import {
    setChatUserList,
    // clearCurrentMessage,
    // setCurrentMessage,
    setChatMessage,
    setChatMessages,
    setUserId,
    // setStream,
    // setReceivingCall,
    // setCaller,
    // setCallerSignal,
    // setCallAccepted,
    // callBegin
} from "../../store/actions/actions";
import io from "socket.io-client";
import {ChatInfo} from "../ChatInfo/ChatInfo";
import {ChatMessages} from "../ChatMessages/ChatMessages";

export default function Chat() {
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    const socket = useRef();


    useEffect(() => {
        socket.current = io('https://chat-for-friends.herokuapp.com/');
        // socket.current = io('http://localhost:3000/');

        socket.current.on('yourId', id => {
            dispatch(setUserId(id)); // добавил в state userId === socket.id
        });

        socket.current.emit("chat_join", {chatId: state.chatId, name: state.login, userId: state.userId}); // высылаю информацию с id чата и login для присоединения к комнате

        socket.current.on('user_disconnect', users => { // при событии дисконекта с сервера обновлю список пользователей в чате
            dispatch(setChatUserList(users));
        });

        socket.current.on('chat_message', (msgInfo) => { // если придёт сообщение, добавлю его в store
            dispatch(setChatMessage(msgInfo));
        });

        socket.current.on('user_join', (users, messages) => { // при присоединении к моей комнате обновлю список пользователей в чате
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
                <ChatMessages socket={socket}/>
            </div>
        </main>
    )
}

