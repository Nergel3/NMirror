'use strict'

function time() {
	var hoursV  = document.getElementById("hours") ;
	var minutesV = document.getElementById("minutes") ;
	var d = new Date() ; // L'heure est la date d'aujourd'hui
    var hours = d.getHours(); //valeur heure actuelle
    var minutes = d.getMinutes(); //Valeur minutes actuelle
    hours = (hours < 10 ? '0' : '') + hours;
    minutes = (minutes < 10 ? '0' : '') + minutes;
    hoursV.innerHTML = hours;
    minutesV.innerHTML = minutes;
        
}

setInterval(function() {		//La fonction time se répète toutes les 10 secondes.
	time();
}, 1000);

function calendar() {
	var daysV = document.getElementById("days") ;
	var monthsV = document.getElementById("months");
	var numDaysV = document.getElementById("numDays");
	var yearsV = document.getElementById("years");
	var d= new Date();	//Date du jour
	var days = d.getDate();		 //Get the day as a number (1-31)
	var months = d.getMonth();	//Get the month as a number (0-11)
	var years = d.getFullYear();	//Get the year
	var numDays = d.getDay();	//Get the weekday as a number (0-6)

	daysV.innerHTML = days ;
	yearsV.innerHTML = years ;
	var weekDays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]; 	//Variable des jour de la semaine.
	var monthDays = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];		//Variable des mois de l'année
	numDaysV.innerHTML = weekDays[numDays]; 	//Convertit jour de la semaine (0-6) en lettre (Lun. - Dim.).
	monthsV.innerHTML = monthDays[months];		//Convertit le mois (0-11) en lettre (Janvier - Décembre).
}

setInterval(function() {		//La fonction calendar se répète toute les 10 secs.
	calendar();
}, 10000);

calendar();




