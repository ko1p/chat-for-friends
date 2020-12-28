import React, {useRef, useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import './Room.css';
import {
    setChatUserList,
    clearCurrentMessage,
    setCurrentMessage,
    setChatMessage, setChatMessages, setUserId,
} from "../../store/actions/actions";
import Peer from "simple-peer";
import io from "socket.io-client";
import vci from '../../images/video-camera.png'

export default function Chat() {
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    const [yourID, setYourID] = useState("");
    const [users, setUsers] = useState({});
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);

    const socket = useRef();
    const msgsRef = useRef();
    const formRef = useRef();
    const lastMesRef = useRef();
    const outputVideoRef = useRef();
    const inputVideoRef = useRef();

    useEffect(() => {
        socket.current = io('http://localhost:3000');
        // console.log(socket.current.id)
        // dispatch(setUserId(socket.current.id)); // добавил в state userId === socket.id

        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(stream => {
                setStream(stream);
                if (outputVideoRef.current) {
                    outputVideoRef.current.srcObject = stream;
                }
            });

        socket.current.on('yourId', id => {
            //setYourID(id)
            dispatch(setUserId(id)); // добавил в state userId === socket.id
        });

        socket.current.on('allUsers', users => {
            setUsers(users)
        });

        socket.current.on('hey', data => {
            console.log('hey')
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
        });

        socket.current.emit("chat_join", {chatId: state.chatId, name: state.login, userId: state.userId}); // высылаю информацию с id чата и login для присоединения к комнате

        socket.current.on('user_disconnect', users => { // при событии дисконекта с сервера обновлю список пользователей в чате
            dispatch(setChatUserList(users));
        });

        socket.current.on('chat_message', (msgInfo) => { // если придёт сообщение, добавлю его в store
            dispatch(setChatMessage(msgInfo));
            scrollToBottom();
        });

        socket.current.on('user_join', (users, messages) => { // при присоединении к моей комнате обновлю список пользователей в чате
            dispatch(setChatUserList(users));
            if (state.chat.messages.length === 0) {
                dispatch(setChatMessages(messages));
                // scrollToBottom(); ушёл вниз
            }
        })
            // scrollToBottom();


            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const callPeer = id => {
        console.log(state)
        console.log(id)
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {
                        urls: "stun:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683"
                    },
                    {
                        urls: "turn:numb.viagenie.ca",
                        username: "sultan1640@gmail.com",
                        credential: "98376683"
                    }
                ]
            },
            stream: stream
        })

        peer.on('signal', data => {
            console.log('signal')
            socket.current.emit('callUser', {userToCall: id, signalData: data, from: yourID})
        })

        peer.on('stream', stream => {
            if (inputVideoRef.current) {
                inputVideoRef.current.srcObject = stream;
            }
        })

        socket.current.on('callAccepted', signal => {
            setCallAccepted(true);
            console.log('onCallAccept')
            //здесь логика по отображению окошек при приёме звонка
            peer.signal(signal);
        })
        console.log('call peer')
    }

    const acceptCall = () => {
        setCallAccepted(true)

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        });

        peer.on('signal', data => {
            console.log('signal come')
            socket.current.emit('acceptCall', {signal: data, to: caller})
        });

        peer.on('stream', stream => {
            inputVideoRef.current.srcObject = stream;
        })

        peer.signal(callerSignal);
    }

    const sendMessage = (e) => { // фу-ция формирующая и отправляющая инофрмацию о новом сообщении на сервер
        e.preventDefault();
        const messageInfo = {
            chatId: state.chatId,
            name: state.login,
            msg: state.currentMessage,
        };
        socket.current.emit("chat_message", messageInfo);
        dispatch(clearCurrentMessage());
    }

    const onEnterPress = (e) => { // отправка сообщения по Enter
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            sendMessage(e);
        }
    }

    const scrollToBottom = () => { // фу-ция опускает скролл с сообщениями в самый низ
        // msgsRef.current.scrollTo(0, msgsRef.current.scrollHeight)
        lastMesRef.current.scrollIntoView({behavior: 'smooth'});
    }

    return (
        <div className='container'>
            <div className="video">
                <video ref={outputVideoRef} className="video__output" playsInline autoPlay muted/>
                <video ref={inputVideoRef} className="video__input" playsInline autoPlay/>
            </div>
            {
                receivingCall && <button onClick={acceptCall}>Принять звонок</button>
            }
            <div className="chat">
                <div className="chat-users">
                    Комната: <b>{state.chatId}</b>
                    <hr/>
                    <b>Онлайн ({state.chat.users.length}):</b>
                    <ul>
                        {
                            state.chat.users && state.chat.users.map((user, index) => {
                                if (user.id === state.userId) {
                                    return (<li key={user + index}>{user.name}</li>)
                                } else {
                                    return (
                                        <li key={user + index} onClick={() => callPeer(user.id)} >{user.name} <img className="video__video-call-img" src={vci} /></li>
                                    )
                                }
                            })
                        }
                    </ul>
                </div>
                <div className="chat-messages">
                    <div className="messages" ref={msgsRef}>
                        {
                            state.chat.messages && state.chat.messages.map((message, index) => {
                                const cls = message.name === state.login ? 'message message_my-msg' : 'message';
                                return (
                                    <div className={cls} key={index + '_chat_msg'}>
                                        <p>{message.msg}</p>
                                        <div>
                                            <span>{message.name}, {message.time}</span>
                                            <div ref={lastMesRef}/>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <form ref={formRef} onSubmit={e => sendMessage(e)}>
                            <textarea
                                value={state.currentMessage}
                                onChange={(e) => dispatch(setCurrentMessage(e.target.value))}
                                className="form-control"
                                rows="3"
                                onKeyDown={(e) => onEnterPress(e)}
                            >
                            </textarea>
                        <button type="submit" className="btn">
                            Отправить
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

