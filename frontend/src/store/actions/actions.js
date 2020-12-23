import {
    SET_LOGIN,
    SET_CHATID,
    SET_CURRENT_MESSAGE,
    CLEAR_CURRENT_MESSAGE,
    SET_CHAT_USER_LIST,
    SET_CHAT_MESSAGES, SET_CHAT_MESSAGE
} from './actionTypes';

export function setLogin (login) {
    // ....
    return {
        type: SET_LOGIN,
        login
    }
}

export function setChatId (chatId) {
    // ....
    return {
        type: SET_CHATID,
        chatId
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
