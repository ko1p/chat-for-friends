import React, {useEffect, useRef, useState} from "react";
// import socket from "../../socket";
import './Video.css';
import {useDispatch} from "react-redux";
import Peer from "simple-peer";
import {setUserId} from "../../store/actions/actions";

export default function Video() {
    const [yourID, setYourID] = useState("");
    const [users, setUsers] = useState({});
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const dispatch = useDispatch();

    const outputVideoRef = useRef();
    const inputVideoRef = useRef();

    // const callPeer = id => {
    //     const peer = new Peer({
    //         initiator: true,
    //         trickle: false,
    //         config: {
    //             iceServers: [
    //                 {
    //                     urls: "stun:numb.viagenie.ca",
    //                     username: "sultan1640@gmail.com",
    //                     credential: "98376683"
    //                 },
    //                 {
    //                     urls: "turn:numb.viagenie.ca",
    //                     username: "sultan1640@gmail.com",
    //                     credential: "98376683"
    //                 }
    //             ]
    //         },
    //         stream: stream
    //     })
    //
    //     peer.on('signal', data => {
    //         console.log('onSignal')
    //         socket.emit('callUser', {userToCall: id, signalData: data, from: yourID})
    //     })
    //
    //     peer.on('stream', stream => {
    //         console.log('onStream')
    //         if (inputVideoRef.current) {
    //             inputVideoRef.current.srcObject = stream;
    //         }
    //     })
    //
    //     socket.on('callAccepted', signal => {
    //         setCallAccepted(true);
    //         console.log('onCallAccept')
    //         //здесь логика по отображению окошек при приёме звонка
    //         peer.signal(signal);
    //     })
    //
    // }
    //
    // const acceptCall = () => {
    //     setCallAccepted(true)
    //     const peer = new Peer({
    //         initiator: false,
    //         trickle: false,
    //         stream: stream
    //     })
    //     peer.on('signal', data => {
    //         socket.emit('acceptCall', {signal: data, to: caller})
    //     })
    //     peer.on('stream', stream => {
    //         inputVideoRef.current.srcObject = stream;
    //     })
    //     peer.signal(callerSignal);
    // }
    //
    //
    // useEffect( () => {
    //     dispatch(setUserId(socket.id)); // добавил в state userId === socket.id
    //     navigator.mediaDevices.getUserMedia({video: true, audio: true})
    //         .then(stream => {
    //             setStream(stream);
    //             if (outputVideoRef.current) {
    //                 outputVideoRef.current.srcObject = stream;
    //             }
    //         })
    //
    //     socket.on('yourId', id => {
    //         setYourID(id)
    //     })
    //
    //     socket.on('allUsers', users => {
    //         setUsers(users)
    //     })
    //
    //     socket.on('hey', data => {
    //         setReceivingCall(true);
    //         setCaller(data.from);
    //         setCallerSignal(data.signal);
    //     })
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    return (
        <>
        <div className="video">
            <video ref={outputVideoRef} className="video__output" playsInline autoPlay muted />
            <video ref={inputVideoRef} className="video__input" playsInline autoPlay />
        </div>
        {
            receivingCall && <button onClick={acceptCall}>Принять звонок</button>
        }
        </>
    )
}
