import React, {Component} from "react";
import {connect} from 'react-redux';
import './Room.css';
import {
    setChatUserList,
    clearCurrentMessage,
    setChatId,
    setCurrentMessage,
    setLogin, setChatMessages
} from "../../store/actions/actions";
import socket from "../../socket";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.msgsRef = React.createRef(); // ссылка на div с сообщениями
    }

    componentDidMount() {
        const chatId = this.props.chatId; // получаю из store id чата
        socket.emit("chat_join", {chatId: chatId, name: this.props.login}); // высылаю информацию с id чата и login для присоединения к комнате
        socket.on('user_disconnect', users => { // при событии дисконекта с сервера обновлю список пользователей в чате
            this.props.setChatUserList(users)
        });
        socket.on('chat_message', (msgInfo) => { // если придёт сообщение, добавлю его в store
            this.props.setChatMessages(msgInfo)
        });
        socket.on('user_join', (users) => { // при присоединении к моей комнате обновлю список пользователей в чате
            this.props.setChatUserList(users)
        });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    onClickHandler = () => { // фу-ция формирующая и отправляющая инофрмацию о новом сообщении на сервер
        const messageInfo = {
            chatId: this.props.chatId,
            name: this.props.login,
            msg: this.props.currentMessage,
        };
        socket.emit("chat_message", messageInfo);
        this.props.clearCurrentMessage();
    }

    scrollToBottom = () => { // фу-ция опускает скролл с сообщениями в самый низ
        this.msgsRef.current.scrollTo(0, this.msgsRef.current.scrollHeight);
    }

    render() {
        return (
            <div className='container'>
                <div className="chat">
                    <div className="chat-users">
                        Комната: <b>{this.props.chatId}</b>
                        <hr/>
                        <b>Онлайн ({this.props.chat.users.length}):</b>
                        <ul>
                            {
                                this.props.chat.users && this.props.chat.users.map((name, index) => (
                                    <li key={name + index}>{name}</li>))
                            }
                        </ul>
                    </div>
                    <div className="chat-messages">
                        <div className="messages" ref={this.msgsRef}>
                            {
                                this.props.chat.messages.map((message, index) => {
                                    const cls = message.name === this.props.login ? 'message message_my-msg' : 'message';
                                        return (
                                            <div className={cls} key={index + '_chat_msg'}>
                                                <p>{message.msg}</p>
                                                <div>
                                                    <span>{message.name}, {message.time}</span>
                                                </div>
                                            </div>
                                        )
                                })
                            }
                        </div>
                        <form>
                            <textarea
                                value={this.props.currentMessage}
                                onChange={(e) => this.props.setCurrentMessage(e.target.value)}
                                className="form-control"
                                rows="3">
                            </textarea>
                            <button onClick={this.onClickHandler} type="button" className="btn">
                                Отправить
                            </button>
                        </form>
                    </div>
                </div>
            </div>
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
        setChatUserList: users => dispatch(setChatUserList(users)), // обновление списка пользователей в чате
        setChatMessages: msgInfo => dispatch(setChatMessages(msgInfo)), // обновление списка сообщений чата
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
