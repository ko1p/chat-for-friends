import React, {Component} from "react";
import {connect} from 'react-redux';
import '../Login/Login.css';
import {clearCurrentMessage, setChatId, setCurrentMessage, setLogin} from "../../store/actions/actions";
import Room from "../Room/Room";
import Login from "../Login/Login";

class Chat extends Component {
    render() {
        return (
            this.props.login && this.props.chatId ?
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
        setChatId: chatId => dispatch(setChatId(chatId)),
        setLogin: login => dispatch(setLogin(login)),
        setCurrentMessage: msg => dispatch(setCurrentMessage(msg)),
        clearCurrentMessage: () => dispatch(clearCurrentMessage()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
