'use strict'

const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';		//API request weather

const keyApiW = '28f4edece22fd3542c984d1cd1a02072';
const lang = 'fr';
const keyApiIp = '650708b152d186ffe32c4cf515406cc4';
const dayNight = {
    "n": "day-",
    "d": "night-",
}

function jsUcFirst(string) {                                    //Uppercase first letter
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function weather() {
    var monIp = await fetch('https://api.ipify.org?format=json')
        .then(resultat => resultat.json())
        .then(json => json.ip)
        .catch((error) => {
            console.error("Erreur d'identification de l'IP")
        })

    var ville = await fetch('http://api.ipstack.com/' + monIp + '?access_key=' + keyApiIp)
        .then(resultat => resultat.json())
        .then(json => json.city)
        .catch((error) => {
            console.error("Erreur d'identification de la ville")
        })

    var weather = await fetch(weatherApiUrl + ville + '&lang=' + lang + '&appid=' + keyApiW + '&units=metric')
        .then(resultat => resultat.json())
        .then(json => json)
        .catch((error) => {
            console.error("Erreur d'identification de la meteo")
        })



    console.log(weather)

    displayWeatherData(weather)
}

function displayWeatherData(data) {
    var temp = data.main.temp;
    var tempMin = data.main.temp_min;
    var tempMax = data.main.temp_max;
    var desc = data.weather[0].description;
    var idIcon = data.weather[0].id;
    var icon = data.weather[0].icon;

    document.querySelector('#currentTemp').textContent = Math.round(temp);
    document.querySelector('#minTemp').textContent = tempMin;
    document.querySelector('#maxTemp').textContent = tempMax;
    document.querySelector('#tempDesc').textContent = jsUcFirst(desc);
    var classIcon = "wi-owm-" + dayNight[icon.substr(-1)] + idIcon;     //Class final de la form : wi-own-[day,night]Id
    document.querySelector('#icon').className = classIcon;
    console.log("Meteo a jour");
}
















