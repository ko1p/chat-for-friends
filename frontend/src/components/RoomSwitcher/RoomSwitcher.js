import React from "react";
import {useSelector} from 'react-redux';
import Room from "../Chat/Chat";
import Signin from "../Signin/Signin";

export default function RoomSwitcher() {
    const state = useSelector(state => state)
    return (
        state.login && state.chatId ? // если пользователь уже логинился, то он перейдёт в чат, если нет, то будет указывать логин
            <Room />
            :
            <Signin />
    )
}
