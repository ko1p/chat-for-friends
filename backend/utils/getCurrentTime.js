module.exports.getCurrentTime = function getCurrentTime() {
    const date = new Date(Date.now());
    const hours = () => {
        const hours = date.getHours();
        return hours < 10 ? '0' + hours : hours;
    };

    const mins = () => {
        const mins = date.getMinutes();
        return  mins < 10 ? '0' + mins : mins;
    };

    const secs = () => {
        const secs = date.getSeconds();
        return secs < 10 ? '0' + secs : secs;
    };

    return `${hours()}:${mins()}:${secs()}`;
}