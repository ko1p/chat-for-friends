import React, {useRef, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import './Room.css';
import {
    setChatUserList,
    clearCurrentMessage,
    setCurrentMessage,
    setChatMessage, setChatMessages
} from "../../store/actions/actions";
import socket from "../../socket";

export default function Chat() {
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const msgsRef = useRef();
    const formRef = useRef();

    useEffect(() => {
        const chatId = state.chatId; // получаю из store id чата
        socket.emit("chat_join", {chatId: chatId, name: state.login}); // высылаю информацию с id чата и login для присоединения к комнате
        socket.on('user_disconnect', users => { // при событии дисконекта с сервера обновлю список пользователей в чате
            dispatch(setChatUserList(users));
        });
        socket.on('chat_message', (msgInfo) => { // если придёт сообщение, добавлю его в store
            dispatch(setChatMessage(msgInfo));
            scrollToBottom();
        });
        socket.on('user_join', (users, messages) => { // при присоединении к моей комнате обновлю список пользователей в чате
            dispatch(setChatUserList(users));
            if (state.chat.messages.length === 0) {
                dispatch(setChatMessages(messages));
                scrollToBottom();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const sendMessage = (e) => { // фу-ция формирующая и отправляющая инофрмацию о новом сообщении на сервер
        e.preventDefault();
        const messageInfo = {
            chatId: state.chatId,
            name: state.login,
            msg: state.currentMessage,
        };
        socket.emit("chat_message", messageInfo);
        dispatch(clearCurrentMessage());
    }

    const onEnterPress = (e) => { // отправка сообщения по Enter
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            sendMessage(e);
        }
    }

    const scrollToBottom = () => { // фу-ция опускает скролл с сообщениями в самый низ
        msgsRef.current.scrollTo(0, msgsRef.current.scrollHeight);
    }

    return (
        <div className='container'>
            <div className="chat">
                <div className="chat-users">
                    Комната: <b>{state.chatId}</b>
                    <hr/>
                    <b>Онлайн ({state.chat.users.length}):</b>
                    <ul>
                        {
                            state.chat.users && state.chat.users.map((name, index) => (
                                <li key={name + index}>{name}</li>))
                        }
                    </ul>
                </div>
                <div className="chat-messages">
                    <div className="messages" ref={msgsRef}>
                        {
                            state.chat.messages && state.chat.messages.map((message, index) => {
                                const cls = message.name === state.login ? 'message message_my-msg' : 'message';
                                return (
                                    <div className={cls} key={index + '_chat_msg'}>
                                        <p>{message.msg}</p>
                                        <div>
                                            <span>{message.name}, {message.time}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <form ref={formRef} onSubmit={e => sendMessage(e)}>
                            <textarea
                                value={state.currentMessage}
                                onChange={(e) => dispatch(setCurrentMessage(e.target.value))}
                                className="form-control"
                                rows="3"
                                onKeyDown={(e) => onEnterPress(e)}
                                >
                            </textarea>
                        <button type="submit" className="btn">
                            Отправить
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
