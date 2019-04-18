var d = new Date();
var day = d.getDate();
var weekDaysNumber = d.getDay();
var year = d.getFullYear();
var month = d.getMonth();
month++;

ipcRenderer.on('mirrorCalendar', (event, message) => {
	var msg = null;
	var y = 0;

	console.log(message[1]);

	document.getElementById("eventsTab").innerHTML = "";
	document.getElementById("eventsTab2").innerHTML = "";

  if (message.length > 0) {
    for (i = 0; i < message.length; i++) {
			if (typeof message[i].start.dateTime !== "undefined") {
				msg = message[i];
				y = 1;
			} else if (typeof message[i].start.date !== "undefined") {
				msg = message[i];
				y = 0;
			}
			trieur(parse(msg, y));
		}
	}
	calendarTabEmpty();
});

function parse(input, type) {							// Formate en tableau les date renvoyé pas l'api google

	var data0 = null,
			records = [],
			y = null;

	if (type == 1) {
		data0 = input.start.dateTime.split('-');
		y = data0[2].split('T');

	  records["year"] = data0[0];
		records["month"] = data0[1];
		records["day"] = data0[2].substring(0,2);
		records["heure"] = y[1].substring(0,2);
		records["minute"] = y[1].substring(3,5);
	} else if (type == 0) {
		data0 = input.start.date.split('-');

		records["year"] = data0[0];
		records["month"] = data0[1];
		records["day"] = data0[2].substring(0,2);
	}

	records["event"] = input.summary;
	
  return records;
}

function nbJpM(input) {			//Renvoie le nbr de jour dans le mois selon le mois

  if (input > 12 || input < 0) {
    return 1000;
  } else { 
    if (input == 04 || input == 06 || input == 09 || input == 11) {
      return 30;
    } else if (input == 01 || input == 03 || input == 05 || input == 07 || input == 08 || input == 10 || input == 12) {
      return 31;
    } else if (input == 02) {
      if (Number.isInteger(year / 400) == true && Number.isInteger(year / 4) == true && Number.isInteger( year / 100) == false ) {
        return 29;
      } else {return 28}
    } else { return 1000}
  }
}

function monthY(input) {				//Gère l'année lorsque event d'une année à l'autre sur une semaine a cheval
	var z = month + 1
	if (input == z) {
		return z
	} else if (input == 12) {
		return z = 01;
	} else {
		return null;
	}
}

//Fin sélection J semaine.

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function calendarTab(input, eventsWeek) {																							//Rentre dans la liste les évenements a venir
	if (input != -1) {
		if (typeof input.heure !== "undefined" && typeof input.minute !== "undefined") {
			if (eventsWeek == 1) {
				$("#eventsTab").append('<tr class="events" id=' + i + '><td><i class="fas fa-calendar-alt"></i> ' + capitalize(input.event) + '</td><td class="hour">' + 'à ' + input.heure + ':' + input.minute + ' ' + dayNxtWeek(input) + '.' + '</td></tr>');
			} else if (eventsWeek == 2) {
				$("#eventsTab2").append('<tr class="events" id=' + i + '><td><i class="fas fa-calendar-alt"></i> ' + capitalize(input.event) + '</td><td class="hour">' + 'à ' + input.heure + ':' + input.minute + ' ' + dayNxtWeek(input) + '.' + '</td></tr>');
			} else {console.log(eventsWeek)}
		} else {
			if (eventsWeek == 1) {
				$("#eventsTab").append('<tr class="events" id=' + i + '><td><i class="fas fa-calendar-alt"></i> ' + capitalize(input.event) + '</td><td class="hour">' + dayNxtWeek(input) + '.' + '</td></tr>');
			} else if (eventsWeek == 2) {
				$("#eventsTab2").append('<tr class="events" id=' + i + '><td><i class="fas fa-calendar-alt"></i> ' + capitalize(input.event) + '</td><td class="hour">' + dayNxtWeek(input) + '.' + '</td></tr>');
			}
		}																		
	}
}

function calendarTabEmpty() {
	if ( $('#eventsTab2').is(':empty') == true && $('#eventsTab').is(':empty') == true) {
		document.getElementById('animation1').style.display = "none";
		document.getElementById('animation2').style.display = "none";
		document.getElementById('animation1').style.animation = "none";
		document.getElementById('animation2').style.animation = "none";
		document.getElementById('noEvents').style.display = "block";

	} else if ($('#eventsTab2').is(':empty') == true && $('#eventsTab').is(':empty') == false) {
		document.getElementById('animation2').style.display = "none";
		document.getElementById('animation1').style.display = "block";
		document.getElementById('animation1').style.animation = "none";
		document.getElementById('animation2').style.animation = "none";
		document.getElementById('noEvents').style.display = "none";

	} else if ($('#eventsTab').is(':empty') == true && $('#eventsTab2').is(':empty') == false) {
		document.getElementById('animation1').style.animation = "none";
		document.getElementById('animation2').style.animation = "none";
		document.getElementById('animation1').style.display = "none";
		document.getElementById('animation2').style.display = "block";
		document.getElementById('noEvents').style.display = "none";

	} else {
		document.getElementById('animation1').style.display = "block";
		document.getElementById('animation2').style.display = "block";
		document.getElementById('animation1').style.animation = "weekFade 10s infinite";
		document.getElementById('animation2').style.animation = "weekFade 10s infinite 5s";
		document.getElementById('noEvents').style.display = "none";
	}

	console.log("1" + $('#eventsTab').is(':empty') + "2" + $('#eventsTab2').is(':empty'))
}


function trieur(input) {
	var x = 0,
			y = day - (weekDaysNumber) + 7,
			z = year + 1;

	if (input.day > 0 && input.day <= 31) {
		if (input.year == year || input.year == z) {
			if (input.month == monthY(input.month)) {
				if (y > nbJpM(input.month)) {
					y-= nbJpM(month);
					if (input.day <= y && input.day > 0) {
						x = 1;
					}
				}
			}
		}
	}
	if (input.month == month) {
		if (input.day <= y && input.day > y - 7) {
			x = 1
		} else if (input.day > y && input.day <= y + 7) {
			x = 2;
		}
	}

	calendarTab(input, x);
}

function dayNxtWeek(input) {
	var day1 = day;
	while (day - input.day > 7) {
		day1 = day1 + 7;
	}
	day1= input.day - day1;
	return weekDays[weekDaysNumber + day1];
}


