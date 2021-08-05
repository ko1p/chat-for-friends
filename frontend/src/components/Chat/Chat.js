import React from "react";
import {useSelector} from 'react-redux';
import '../Signin/Signin.css';
import Room from "../Room/Room";
import Signin from "../Signin/Signin";

export default function Chat() {

    const state = useSelector(state => state)

    return (
        state.login && state.chatId ? // если пользователь уже логинился, то он перейдёт в чат, если нет, то будет указывать логин
            <Room/>
            :
            <Signin/>
    )
}
