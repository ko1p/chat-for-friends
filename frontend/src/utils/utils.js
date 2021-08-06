export const chatIdGenerator = () => { // функция генерирует id чата, который отображается в браузере при создании комнаты
    return `${Date.now()}` // id это timestamp в момент создания чата
};