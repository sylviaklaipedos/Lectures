const api = {
    base: 'https://api.openweathermap.org/data/2.5/',
    key: '8c7f2d714d27fc8248a129175570a8b7'
    // key: 'a27a21de3eb428ec51c7c70d333ec791'
};

const dateBuilder = (d) => {
    const months = [
        "January",
        "Februrary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day}, ${month} ${date}`
};

const input = document.querySelector('.searchbar');
const container = document.querySelector('.location-container');
const app = document.querySelector('.app');

let city = localStorage.getItem('city') || 'Nizhnevartovsk';
let store = {};

input.addEventListener('keyup', (e) => {
    const value = e.target.value;

    if (e.key == 'Enter' && value) {
        city = value;
        localStorage.setItem('city', city);
        fetchData();
        e.target.value = '';
    }
});

const fetchData = async () => {
    getLoader();
    const response = await fetch(`${api.base}weather?q=${city}&appid=${api.key}`)
        .then(res => res.json());
    const {name, weather, main: { temp }, sys: { country }} = response;
    store = {
        name,
        weather: weather[0].main,
        temp,
        country
    };
    store.temp - 273 > 20 ? app.classList.add('warm') : app.classList.remove('warm');
    renderComponent();
};

const getLoader = () => {
    container.innerHTML = `<span class="loader"></span>`;
};

const renderComponent = () => {
    container.innerHTML = getContent();
};

const getContent = () => {

    const {name, weather, temp, country} = store;

    return `<div class="location-box">
    <div class="location">
        ${name}, ${country}
    </div>
    <div class="date">
        ${dateBuilder(new Date())}
    </div>
    <div class="weather-box">
        <div class="temp">
            ${Math.round(temp - 273)}°C
        </div>
        <div class="weather">
            ${weather}
        </div>
    </div>
    </div>`
};

fetchData();