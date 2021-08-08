import React from "react";
import {useSelector} from "react-redux";

export const ChatInfo = () => {
    const state = useSelector(state => state);

    return (
        <div className="chat-info">
            <p className="chat-info__room">Комната номер:</p>
            <p className="chat-info__room-code">{state.chatId}</p>
            <p className="chat-info__online">Онлайн ({state.chat.users.length}):</p>
            <ul className="chat-info__users">
                {
                    state.chat.users && state.chat.users.map((user, index) => {
                        return <li className="chat-info__user" key={user + index}>{user.name}</li>
                    })
                }
            </ul>
        </div>
    )
}