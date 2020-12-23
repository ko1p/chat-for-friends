import React from "react";
import {useDispatch} from 'react-redux';
import './Login.css';
import {useParams, useHistory} from 'react-router-dom';
import {setChatId, setLogin} from "../../store/actions/actions";

export default function Login() {
    const dispatch = useDispatch();
    const path = useParams();
    const history = useHistory();

    const getChatId = () => { // функция генерирует id для чата, который отображается в браузере при создании комнаты
        return `${Date.now()}` // id это timestamp в момент создания чата
    }

    const setLoginHandler = (e) => {
        e.preventDefault();
        const login = e.target.login.value;
        dispatch(setLogin(login));
        const chatId = path.chatId || getChatId(); // Если пользователь перешёл по ссылке, то подключится к существвующему чату, если нет, то создаст новый
        dispatch(setChatId(chatId));
        history.push(`/chat/${chatId}`);
    }

    return (
        <div className="app">
            <div className="login">
                <h1 className="login__header">Добро пожаловать в чат для друзей!</h1>
                <p className="login__text">Чтобы войти, укажите как вас зовут в форме ниже:</p>
                <form className="login-form" onSubmit={e => setLoginHandler(e)}>
                    <input className="login-form__input" placeholder="Укажите своё имя здесь" name='login'/>
                    <button className="btn login-form__btn">Войти</button>
                </form>
            </div>
        </div>
    )
}
