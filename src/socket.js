import io from "socket.io-client";

const socket = io('http://localhost:3000');
console.log('Произошло подключение к сокету')

export default socket;
