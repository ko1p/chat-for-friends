import React, {Component} from "react";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import './Login.css';
import {setChatId, setLogin} from "../../store/actions/actions";

class Login extends Component {

    getChatId = () => { // функция генерирует id для чата, который отображается в браузере при создании комнаты
        return `${Date.now()}` // id это timestamp в момент создания чата
    }

    setLoginHandler = (e) => {
        e.preventDefault();
        const login = e.target.login.value;
        this.props.setLogin(login);
        const chatId = this.props.match.params.chatId || this.getChatId(); // Если пользователь перешёл по ссылке, то подключится к существвующему чату, если нет, то создаст новый
        this.props.setChatId(chatId);
        this.props.history.push(`/chat/${chatId}`);
    }

    render() {
        return (
            <div className='app'>
                <div className="login">
                    <h1 className="login__header">Добро пожаловать в чат для друзей!</h1>
                    <p className="login__text">Чтобы войти, укажите как вас зовут в форме ниже:</p>
                    <form className="login-form" onSubmit={e => this.setLoginHandler(e)}>
                        <input className="login-form__input" placeholder="Укажите своё имя здесь" name='login'/>
                        <button className="btn login-form__btn">Войти</button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setLogin: login => dispatch(setLogin(login)), // сохранение в store логина пользователя
        setChatId: chatId => dispatch(setChatId(chatId)) // сохранение в store id чата
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
