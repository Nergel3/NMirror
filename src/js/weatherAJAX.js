'use strict'

const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';		//API request weather
const weatherApiUrlFC = 'https://api.openweathermap.org/data/2.5/forecast?q=';      //API request weather forecast (3-5 days)

const keyApiW = '28f4edece22fd3542c984d1cd1a02072';
const lang = 'fr';
const keyApiIp = '650708b152d186ffe32c4cf515406cc4';
const dayNight = {
    "d": "day-",
    "n": "night-",
}
//var city1 = "Marseille";

var weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]; 	//class des jour de la semaine x 2 (function weatherFC dépasse le numDays[0-6])

function jsUcFirst(string) {                                    //Uppercase first letter
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function lieu() {
    var k = 0;
    var fetchOk = true;

    var monIp = await fetch('https://api.ipify.org?format=json')
        .then(resultat => resultat.json())
        .then(json => json.ip)
        .catch((error) => {
            fetchOk = false;
            console.error("Erreur d'identification de l'IP");
            var x = setTimeout(function() {lieu(); clearTimeout(x); k = 1}, 10 * 1000);
        })
    
    if (k == 0) {

        var ville = await fetch('http://api.ipstack.com/' + monIp + '?access_key=' + keyApiIp)
            .then(resultat => resultat.json())
            .then(json => json.city)
            .catch((error) => {
                fetchOk = false;
                console.error("Erreur d'identification de votre ville");
                var y = setTimeout(function() {lieu(); clearTimeout(y); k = 1}, 10 * 1000);
            })
    
        weather(ville);
        weatherFC(ville);
    }

    ipcRenderer.send("fetchOk", fetchOk);

    console.log(monIp);
    console.log(ville);
}

function internetLieu() {
    if (navigator.onLine == true) {
        lieu();
    } else {
        console.log("Pas de connexion.");
    }
}

internetLieu();

setInterval(function () {       //lance la fonction internetLieu toute les 100000s.
    internetLieu();
}, 100000);  

function weather(city1) {
    $.getJSON(weatherApiUrl + city1 + '&lang=' + lang + '&appid=' + keyApiW + '&units=metric', displayWeatherData);
}

function weatherFC(city1) {
    $.getJSON(weatherApiUrlFC + city1 + '&lang=' + lang + '&appid=' + keyApiW + '&units=metric', displayWeatherFC);
}



function displayWeatherData(data) {

    var temp = data.main.temp;
    var tempMin = data.main.temp_min;
    var tempMax = data.main.temp_max;
    var desc = data.weather[0].description;
    var idIcon = data.weather[0].id;
    var icon = data.weather[0].icon;

    document.querySelector('#currentTemp').textContent = Math.round(temp);
    document.querySelector('#minTemp').textContent = tempMin.toFixed(1);
    document.querySelector('#maxTemp').textContent = tempMax.toFixed(1);
    document.querySelector('#tempDesc').textContent = jsUcFirst(desc);
    var classIcon = "wi-owm-" + dayNight[icon.substr(-1)] + idIcon;     //Class final de la form : wi-own-[day,night]Id
    document.querySelector('#icon').className = classIcon;


    
}

function displayWeatherFC(data) {
    console.log(data);

    const d = new Date();
    var numDays = d.getDay();	//Get the weekday as a number (0-6)

    for (var i = 1; i < 5; i++) {       //Weather 4d forecast
        var x = i * 8
        var temp = data.list[x].main.temp;
        var desc = data.list[x].weather[0].description;
        var idIcon = data.list[x].weather[0].id;
        var icon = data.list[x].weather[0].icon;
        var y = i.toString();

        document.querySelector('#tempFC' + y).textContent = Math.round(temp);
        document.querySelector('#descFC' + y).textContent = jsUcFirst(desc);
        var classIcon = "wi-owm-" + dayNight[icon.substr(-1)] + idIcon;     //Class final de la form : wi-own-[day,night]Id
        document.querySelector('#iconFC' + y).className = classIcon;
        document.querySelector('#timeFC' + i).textContent = weekDays[numDays + i];
    }
    //5th day forecast
    var temp = data.list[39].main.temp;
    var desc = data.list[39].weather[0].description;
    var idIcon = data.list[39].weather[0].id;
    var icon = data.list[39].weather[0].icon;

    document.querySelector('#tempFC5').textContent = Math.round(temp);
    document.querySelector('#descFC5').textContent = jsUcFirst(desc);
    var classIcon = "wi-owm-" + dayNight[icon.substr(-1)] + idIcon;     //Class final de la form : wi-own-[day,night]Id
    document.querySelector('#iconFC5').className = classIcon;
    document.querySelector('#timeFC' + i).textContent = weekDays[numDays + 5];

}


















