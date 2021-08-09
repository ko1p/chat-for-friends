import React, { useRef } from "react";
import { clearCurrentMessage, setCurrentMessage } from "../../store/actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { socket } from '../../socket/socket';

export const ChatForm = () => {
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const formRef = useRef();
    const url = window.location.href;

    const copyLink = () => {
        navigator.clipboard.writeText(url);
    }

    const sendMessage = (e) => { // фу-ция формирующая и отправляющая информацию о новом сообщении на сервер
        e.preventDefault();
        if (!!state.currentMessage.trim()) {
            const messageInfo = {
                chatId: state.chatId,
                name: state.login,
                msg: state.currentMessage,
            };
            socket.emit("chat_message", messageInfo);
            dispatch(clearCurrentMessage());
        }
    }

    const onEnterPress = (e) => { // отправка сообщения по Enter
        if (e.keyCode === 13 && e.shiftKey === false && !!e.target.value.trim()) {
            e.preventDefault();
            sendMessage(e);
        }
    }

    return (
        <form className="chat-form" ref={formRef} onSubmit={e => sendMessage(e)}>
            <textarea className="chat-form__field" value={state.currentMessage}
                onChange={(e) => dispatch(setCurrentMessage(e.target.value))}
                onKeyDown={(e) => onEnterPress(e)}>
            </textarea>
            <div className="chat-form__buttons">
                <button type="submit" className="chat-form__btn">Отправить</button>
                <button type="button" className="chat-form__share-link-btn" onClick={() => copyLink()} />
            </div>
        </form>
    )
}
