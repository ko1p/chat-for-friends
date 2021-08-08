import initialState from '../initialState';
import {
    SET_CHAT_USER_LIST,
    CLEAR_CURRENT_MESSAGE,
    SET_CHATID,
    SET_CURRENT_MESSAGE,
    SET_LOGIN,
    SET_CHAT_MESSAGE,
    SET_CHAT_MESSAGES,
    SET_USERID,
    // SET_STREAM,
    // SET_RECEIVING_CALL,
    // SET_CALLER,
    // SET_CALLER_SIGNAL, SET_CALL_ACCEPTED, CALL_BEGIN
} from "../actions/actionTypes";

export default function reducer (state = initialState, action) {
    switch (action.type) {
        case SET_LOGIN: {
            return {
                ...state,
                login: action.login
            }
        }
        case SET_CHATID: {
            return {
                ...state,
                chatId: action.chatId
            }
        }
        case SET_USERID: {
            return {
                ...state,
                userId: action.userId
            }
        }
        case SET_CURRENT_MESSAGE: {
            return {
                ...state,
                currentMessage: action.msg
            }
        }
        case CLEAR_CURRENT_MESSAGE: {
            return {
                ...state,
                currentMessage: '',
            }
        }
        case SET_CHAT_USER_LIST: {
            return {
                ...state,
                chat: {
                    ...state.chat,
                    users: [...action.users]
                }
            }
        }
        case SET_CHAT_MESSAGE: {
            return {
                ...state,
                chat: {
                    ...state.chat,
                    messages: [
                        ...state.chat.messages,
                        action.msgInfo
                    ]
                }
            }
        }
        case SET_CHAT_MESSAGES: {
            return {
                ...state,
                chat: {
                    ...state.chat,
                    messages: action.messages
                }
            }
        }
        // case SET_STREAM: {
        //     return {
        //         ...state,
        //         video: {
        //             ...state.video,
        //             stream: action.stream
        //         }
        //     }
        // }
        // case SET_RECEIVING_CALL: {
        //     return {
        //         ...state,
        //         video: {
        //             ...state.video,
        //             receivingCall: action.boolean
        //         }
        //     }
        // }
        // case SET_CALLER: {
        //     return {
        //         ...state,
        //         video: {
        //             ...state.video,
        //             caller: action.caller
        //         }
        //     }
        // }
        // case SET_CALLER_SIGNAL: {
        //     return {
        //         ...state,
        //         video: {
        //             ...state.video,
        //             callerSignal: action.signal
        //         }
        //     }
        // }
        // case SET_CALL_ACCEPTED: {
        //     return {
        //         ...state,
        //         video: {
        //             ...state.video,
        //             callAccepted: action.boolean
        //         }
        //     }
        // }
        // case CALL_BEGIN: {
        //     return {
        //         ...state,
        //         video: {
        //             ...state.video,
        //             callBegin: action.boolean
        //         }
        //     }
        // }
        default: return state;

    }
}
