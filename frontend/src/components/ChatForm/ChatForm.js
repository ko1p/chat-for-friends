import React, {useRef} from "react";
import {clearCurrentMessage, setCurrentMessage} from "../../store/actions/actions";
import {useDispatch, useSelector} from "react-redux";

export const ChatForm = ({ socket} ) => {
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const formRef = useRef();

    const sendMessage = (e) => { // фу-ция формирующая и отправляющая информацию о новом сообщении на сервер
        e.preventDefault();
        const messageInfo = {
            chatId: state.chatId,
            name: state.login,
            msg: state.currentMessage,
        };
        socket.current.emit("chat_message", messageInfo);
        dispatch(clearCurrentMessage());
    }

    const onEnterPress = (e) => { // отправка сообщения по Enter
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            sendMessage(e);
        }
    }

    return (
        <form className="chat-form" ref={formRef} onSubmit={e => sendMessage(e)}>
                            <textarea className="chat-form__field" value={state.currentMessage}
                                      onChange={(e) => dispatch(setCurrentMessage(e.target.value))}
                                      onKeyDown={(e) => onEnterPress(e)}></textarea>
            <button type="submit" className="chat-form__btn">Отправить</button>
        </form>
    )
}