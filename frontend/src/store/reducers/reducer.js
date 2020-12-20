import initialState from '../initialState';
import {
    SET_CHAT_USER_LIST,
    CLEAR_CURRENT_MESSAGE,
    SET_CHATID,
    SET_CURRENT_MESSAGE,
    SET_LOGIN, SET_CHAT_MESSAGES
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
        case SET_CHAT_MESSAGES: {
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
        default: return state;
    }
}