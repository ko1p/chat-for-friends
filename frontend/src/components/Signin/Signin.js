import React from "react";
import {useDispatch} from 'react-redux';
import './Signin.css';
import { chatIdGenerator } from "../../utils/utils";
import {useParams, useHistory} from 'react-router-dom';
import {setChatId, setLogin} from "../../store/actions/actions";

export default function Signin() {
    const dispatch = useDispatch();
    const path = useParams();
    const history = useHistory();

    const setLoginHandler = (e) => {
        e.preventDefault();
        const login = e.target.login.value;
        dispatch(setLogin(login));
        const chatId = path.chatId || chatIdGenerator(); // Если пользователь перешёл по ссылке друга, то подключится к существвующему чату, если нет, то сгенерируется новый
        dispatch(setChatId(chatId));
        history.push(`/chat/${chatId}`);
    }

    return(
        <main className="main">
            <div className="signin">
                <div className="signin__top">
                    <h1 className="signin__header">Добро пожаловать в chat-me!</h1>
                    <p className="signin__subtitle">chat-me — это приложение для общения с друзьями. Просто поделитесь
                        ссылкой чтобы начать общение.</p>
                </div>
                <div className="signin__bottom">
                    <p className="signin__subtitle">Для входа в чат укажите своё имя:</p>
                    <form className="signin-form" name="signin-form" onSubmit={e => setLoginHandler(e)}>
                        <input className="signin-form__input" placeholder="Укажите своё имя здесь" name='login'/>
                        <button className="btn signin-form__btn">Войти</button>
                    </form>
                </div>
            </div>
        </main>
    )
}
