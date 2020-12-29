import {
    SET_LOGIN,
    SET_CHATID,
    SET_CURRENT_MESSAGE,
    CLEAR_CURRENT_MESSAGE,
    SET_CHAT_USER_LIST,
    SET_CHAT_MESSAGES,
    SET_CHAT_MESSAGE,
    SET_USERID,
    SET_STREAM,
    SET_RECEIVING_CALL,
    SET_CALLER,
    SET_CALLER_SIGNAL,
    SET_CALL_ACCEPTED
} from './actionTypes';

export function setLogin (login) {
    return {
        type: SET_LOGIN,
        login
    }
}

export function setChatId (chatId) {
    return {
        type: SET_CHATID,
        chatId
    }
}

export function setUserId (userId) {
    return {
        type: SET_USERID,
        userId
    }
}

export function setCurrentMessage (msg) {
    return {
        type: SET_CURRENT_MESSAGE,
        msg
    }
}

export function clearCurrentMessage () {
    return {
        type: CLEAR_CURRENT_MESSAGE,
    }
}

export function setChatUserList (users) {
    return {
        type: SET_CHAT_USER_LIST,
        users
    }
}

export function setChatMessage (msgInfo) {
    return {
        type: SET_CHAT_MESSAGE,
        msgInfo
    }
}

export function setChatMessages (messages) {
    return {
        type: SET_CHAT_MESSAGES,
        messages
    }
}

export function setStream (stream) {
    return {
        type: SET_STREAM,
        stream
    }
}

export function setReceivingCall (boolean) {
    return {
        type: SET_RECEIVING_CALL,
        boolean
    }
}

export function setCaller (caller) {
    return {
        type: SET_CALLER,
        caller
    }
}

export function setCallerSignal (signal) {
    return {
        type: SET_CALLER_SIGNAL,
        signal
    }
}

export function setCallAccepted (boolean) {
    return {
        type: SET_CALL_ACCEPTED,
        boolean
    }
}

