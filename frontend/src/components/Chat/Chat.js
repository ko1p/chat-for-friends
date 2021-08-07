import React, {useRef, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import './Chat.css';
import {
    setChatUserList,
    clearCurrentMessage,
    setCurrentMessage,
    setChatMessage,
    setChatMessages,
    setUserId,
    setStream,
    setReceivingCall,
    setCaller,
    setCallerSignal,
    setCallAccepted,
    callBegin
} from "../../store/actions/actions";
import Peer from "simple-peer";
import io from "socket.io-client";
import vci from '../../images/video-camera.png'

export default function Chat() {
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    // const [users, setUsers] = useState({});
    // const [stream, setStream] = useState();
    // const [receivingCall, setReceivingCall] = useState(false);
    // const [caller, setCaller] = useState("");
    // const [callerSignal, setCallerSignal] = useState();
    // const [callAccepted, setCallAccepted] = useState(false);

    const socket = useRef();
    const msgsRef = useRef();
    const formRef = useRef();
    const lastMesRef = useRef();
    const outputVideoRef = useRef();
    const inputVideoRef = useRef();

    useEffect(() => {
        socket.current = io('https://chat-for-friends.herokuapp.com/');

        navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(stream => {
                console.log('установил свой локальный видео стрим')
                dispatch(setStream(stream));
                // if (outputVideoRef.current) {
                //     outputVideoRef.current.srcObject = stream;
                // }
            });

        socket.current.on('yourId', id => {
            dispatch(setUserId(id)); // добавил в state userId === socket.id
        });

        // socket.current.on('allUsers', users => {
        //     setUsers(users)
        // });

        socket.current.on('hey', data => {
            console.log('hey, прими сигнал');
            dispatch(setReceivingCall(true))
            // setReceivingCall(true);
            // setCaller(data.from);
            dispatch(setCaller(data.from));
            // setCallerSignal(data.signal);
            dispatch(setCallerSignal(data.signal));
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

    const startLocalVideoStream = () => {
        const stream = state.video.stream
        if (outputVideoRef.current) {
            outputVideoRef.current.srcObject = stream;
        }
    }

    const callPeer = id => {
        console.log('звоню пиру ', id)
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
            stream: state.video.stream
        })

        peer.on('signal', data => {
            console.log('шлю сигнал другому пиру с id ', id, state.userId)
            socket.current.emit('callUser', {userToCall: id, signalData: data, from: state.userId})
        })

        peer.on('stream', stream => {
            dispatch(callBegin(true));
            startLocalVideoStream();
            console.log('пришёл ответный стрим', stream)
            if (inputVideoRef.current) {
                console.log("все ок, засовываю пришедший стрим в окошко")
                inputVideoRef.current.srcObject = stream;
            }
        })

        socket.current.on('callAccepted', signal => {
            dispatch(setCallAccepted(true));
            console.log('onCallAccept')
            //здесь логика по отображению окошек при приёме звонка
            peer.signal(signal);
        })
        console.log('call peer')
    }

    const acceptCall = () => {
        dispatch(setCallAccepted(true));

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: state.video.stream
        });

        peer.on('signal', data => {
            console.log('signal come')
            socket.current.emit('acceptCall', {signal: data, to: state.video.caller})
        });

        peer.on('stream', stream => {
            dispatch(callBegin(true));
            startLocalVideoStream();
            console.log('принял стрим, засовываю его в окошко', stream)
            inputVideoRef.current.srcObject = stream;
        })

        peer.signal(state.video.callerSignal);
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
            {
                state.video.callBegin && (
                    <div className="video">
                        <video ref={inputVideoRef} className="video__input" playsInline autoPlay />
                        <video ref={outputVideoRef} className="video__output" playsInline autoPlay muted/>
                    </div>
                )
            }
            {
                state.video.receivingCall && !state.video.callAccepted && <button onClick={acceptCall}>Принять звонок</button>
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
                                        <li key={user + index} onClick={() => callPeer(user.id)} >{user.name} <img className="video__video-call-img" src={vci} alt="video-icon" /></li>
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

