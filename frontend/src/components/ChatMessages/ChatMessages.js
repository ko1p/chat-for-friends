import React from "react";
import { Messages } from "../Messages/Messages";
import { ChatForm } from "../ChatForm/ChatForm";

export const ChatMessages = ({ socket }) => {
    return (
        <div className="chat-messages">
            <Messages />
            <ChatForm socket={socket}/>
        </div>
    )
}