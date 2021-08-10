import React from "react";
import './ChatMessages.css';
import {Messages} from "../Messages/Messages";
import {ChatForm} from "../ChatForm/ChatForm";

export const ChatMessages = () => {
    return (
        <div className="chat-messages">
            <Messages/>
            <ChatForm/>
        </div>
    )
}