import React, {Component} from "react";
import {connect} from 'react-redux';
import '../Login/Login.css';
import {clearCurrentMessage, setChatId, setCurrentMessage, setLogin} from "../../store/actions/actions";
import Room from "../Room/Room";
import Login from "../Login/Login";

class Chat extends Component {
    render() {
        return (
            this.props.login && this.props.chatId ? // если пользователь уже логинился, то он перейдёт в чат, если нет, то будет указывать логин
                <Room />
                :
                <Login />
        )
    }
}

function mapStateToProps(state) {
    return state
}

function mapDispatchToProps(dispatch) {
    return {
        setChatId: chatId => dispatch(setChatId(chatId)), // сохранение в store логина пользователя
        setLogin: login => dispatch(setLogin(login)), // сохранение в store id чата
        setCurrentMessage: msg => dispatch(setCurrentMessage(msg)), // набранное в поле ввода сообщение
        clearCurrentMessage: () => dispatch(clearCurrentMessage()), // очищается поле ввода после отправки сообщения
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
