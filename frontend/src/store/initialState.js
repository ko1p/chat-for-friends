const initialState = {
    login: '',
    userId: '',
    chatId: '',
    currentMessage: '',
    chat: {
        users: [],
        messages: [],
    }, // TODO: Убрать весь видео функционал
    video: {
        receivingCall: false,
        callAccepted: false,
        callBegin: false,
    }
}

export default initialState;
