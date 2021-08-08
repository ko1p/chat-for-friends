import React, {useEffect, useRef} from "react";
import {useSelector} from "react-redux";

export const Messages = () => {
    const state = useSelector(state => state);
    const lastMesRef = useRef();

    const scrollToBottom = () => { // фу-ция опускает скролл с сообщениями в самый низ
        // lastMesRef.current.scrollTo(0, lastMesRef.current.scrollHeight)
        lastMesRef.current.scrollIntoView({behavior: 'smooth'});
    }

    useEffect(() => {
        scrollToBottom();
    }, [state.chat.messages])

    return (
        <div className="messages">
            <div ref={lastMesRef} ></div>
            {
                state.chat.messages && state.chat.messages.map((message, index) => {
                    const cls = message.name === state.login ? 'message message_my-message' : 'message';
                    return (
                        <div className={cls} key={index + '_chat_msg'}>
                            <p className="message__text">{message.msg}</p>
                            <span className="message__info">{message.name}, {message.time}</span>
                            <div ref={lastMesRef} />
                        </div>
                    )
                })
            }
        </div>
    )
}