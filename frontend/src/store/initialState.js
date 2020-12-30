const initialState = {
    login: '',
    userId: '',
    chatId: '',
    currentMessage: '',
    chat: {
        users: [],
        messages: [],
    },
    video: {
        receivingCall: false,
        callAccepted: false,
        callBegin: false,
    }
}

export default initialState;
