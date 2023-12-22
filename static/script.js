const renderWeather = async () => {
    const response = await fetch('/weather');
    const html = await response.text();

    document.querySelector('#weather').innerHTML = html;
};

setInterval(renderWeather, 1000 * 60 * 10);

const renderTransport = async () => {
    const response = await fetch('/transport');
    const html = await response.text();

    document.querySelector('#transport').innerHTML = html;
};

setInterval(renderTransport, 1000 * 60);
