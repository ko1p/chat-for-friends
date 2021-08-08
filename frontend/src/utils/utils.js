export const chatIdGenerator = () => { // функция генерирует id чата, который отображается в браузере при создании комнаты
    return `${Date.now()}` // id это timestamp в момент создания чата
};

export const timeConverter = time => { // функция преобразователь времени в привычный нам формат
    const timestamp = Date.parse(time)
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}