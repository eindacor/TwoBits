Template.twilioTest.rendered = function() {
	//users_number = getCurrentUserNumber();
	var user_number = '16098928262';
	Meteor.call('getMessages', user_number);
}

Template.twilioTest.events({
	'click #response-test': function () {
		var user_number = '16098928262';
		// var user_number = '12037528089';
		Meteor.call('sendMessage', user_number);
	},

	'click #test-button': function() {
		var date_string = $('#string-enter').val();
		//var date_string = "tomorrow October at 8am 2008";
		console.log('original: ' + date_string);

		console.log(getMonthFromInt(extractMonth(date_string).extracted));
		date_string = extractMonth(date_string).revised;

		console.log(extractYear(date_string).extracted);
		date_string = extractYear(date_string).revised;

		console.log(getDayOfWeekFromInt(extractDay(date_string).extracted));
		date_string = extractDay(date_string).revised;

		var time_object = extractTime(date_string, 'am');
		console.log(time_object);
		console.log(time_object.hour());
		console.log(time_object.minute());
	}
});

var getDayOfWeekFromInt = function(day_int) {
	switch(day_int) {
		case 0: return "Sunday";
		case 1: return "Monday";
		case 2: return "Tuesday";
		case 3: return "Wednesday";
		case 4: return "Thursday";
		case 5: return "Friday";
		case 6: return "Saturday";
		default: return "INVALID_DAY";
	}
}

var getMonthFromInt = function(month_int) {
	switch(month_int) {
		case 0: return "January";
		case 1: return "February";
		case 2: return "March";
		case 3: return "April";
		case 4: return "May";
		case 5: return "June";
		case 6: return "July";
		case 7: return "August";
		case 8: return "September";
		case 9: return "October";
		case 10: return "November";
		case 11: return "December";
		default: return "INVALID_MONTH";
	}
}

/*
tomorrow at 7
this tuesday 5pm
8/7 at 6
next friday 10
today 11am
7:15pm
7:15 pm
3 o'clock
June 3rd noon

at 12
12 o'clock
12pm
12:15
noon
@12
*/

var extractTime = function(date_string, am_pm) {
	var string_lower = date_string.toLowerCase();
	//at 12
	if (getIndicesOfPhrase(string_lower, 'at ').first != -1) {
		var end_index = getIndicesOfPhrase(string_lower, 'at ').end;
		return extractTime(date_string.substr(end_index), am_pm);
	}

	//12 o'clock
	if (getIndicesOfPhrase(string_lower, "o'clock").first != -1) {
		var first_index = getIndicesOfPhrase(string_lower, "o'clock").first;
		return extractTime(date_string.substr(0, first_index), am_pm);
	}

	//12pm
	if (getIndicesOfPhrase(string_lower, "pm").first != -1) {
		var first_index = getIndicesOfPhrase(string_lower, "pm").first;
		return extractTime(date_string.substr(0, first_index), 'pm');
	}

	if (getIndicesOfPhrase(string_lower, "am").first != -1) {
		var first_index = getIndicesOfPhrase(string_lower, "am").first;
		return extractTime(date_string.substr(0, first_index), am_pm);
	}

	//@3:30
	if (getIndicesOfPhrase(string_lower, '@').first != -1) {
		var end_index = getIndicesOfPhrase(string_lower, '@').end;
		return extractTime(date_string.substr(end_index), am_pm);
	}

	//12:15
	if (string_lower.indexOf(':') != -1) {
		//moment({hour: 5, minute: 10});
		var hours = parseInt(string_lower.substr(0, string_lower.indexOf(':')));
		var minutes = parseInt(string_lower.substr(string_lower.indexOf(':') + 1));

		if (am_pm == 'pm')
			hours += 12;

		return moment({hour: hours, minute: minutes});
	}

	//noon



	return moment({hour: parseInt(date_string)});; 
}

var getIndicesOfPhrase = function(string_to_search, phrase_to_find) {
	var string_lower = string_to_search.toLowerCase();
	var phrase_lower = phrase_to_find.toLowerCase();
	if (string_lower.indexOf(phrase_lower) != -1 && phrase_to_find.length > 0) {
		var index_object = {
			'first': string_lower.indexOf(phrase_lower),
			'last': string_lower.indexOf(phrase_lower) + phrase_lower.length - 1,
			'end': string_lower.indexOf(phrase_lower) + phrase_lower.length
		}
		return index_object;
	}

	else return {'first': -1, 'last': -1, 'end': -1};
}

//
var extractPhrase = function(string_to_search, phrase_to_extract) {
	var string_lower = string_to_search.toLowerCase();
	var phrase_lower = phrase_to_extract.toLowerCase();
	if (getIndicesOfPhrase(string_lower, phrase_lower).first != -1) {
		var index_object = getIndicesOfPhrase(string_lower, phrase_lower);
		return string_to_search.substr(0, index_object.first) + string_to_search.substr(index_object.end);
	}

	else return string_to_search;
}

var extractMonth = function(date_string) {
	var date_string_lower = date_string.toLowerCase();
	if (extractPhrase(date_string_lower, 'january') != date_string_lower) {
		var return_object = {
			'extracted': 0,
			'revised' : extractPhrase(date_string_lower, 'january')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'february') != date_string_lower) {
		var return_object = {
			'extracted': 1,
			'revised' : extractPhrase(date_string_lower, 'february')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'march') != date_string_lower) {
		var return_object = {
			'extracted': 2,
			'revised' : extractPhrase(date_string_lower, 'march')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'april') != date_string_lower) {
		var return_object = {
			'extracted': 3,
			'revised' : extractPhrase(date_string_lower, 'april')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'may') != date_string_lower) {
		var return_object = {
			'extracted': 4,
			'revised' : extractPhrase(date_string_lower, 'may')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'june') != date_string_lower) {
		var return_object = {
			'extracted': 5,
			'revised' : extractPhrase(date_string_lower, 'june')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'july') != date_string_lower) {
		var return_object = {
			'extracted': 6,
			'revised' : extractPhrase(date_string_lower, 'july')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'august') != date_string_lower) {
		var return_object = {
			'extracted': 7,
			'revised' : extractPhrase(date_string_lower, 'august')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'september') != date_string_lower) {
		var return_object = {
			'extracted': 8,
			'revised' : extractPhrase(date_string_lower, 'september')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'october') != date_string_lower) {
		var return_object = {
			'extracted': 9,
			'revised' : extractPhrase(date_string_lower, 'october')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'november') != date_string_lower) {
		var return_object = {
			'extracted': 10,
			'revised' : extractPhrase(date_string_lower, 'november')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'december') != date_string_lower) {
		var return_object = {
			'extracted': 11,
			'revised' : extractPhrase(date_string_lower, 'december')
		}
		return return_object;
	}

	return {'extracted': moment().month(), 'revised': date_string}
}

var extractDay = function(date_string) {
	var date_string_lower = date_string.toLowerCase();
	if (extractPhrase(date_string_lower, 'sunday') != date_string_lower) {
		var return_object = {
			'extracted': 0,
			'revised' : extractPhrase(date_string_lower, 'sunday')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'monday') != date_string_lower) {
		var return_object = {
			'extracted': 1,
			'revised' : extractPhrase(date_string_lower, 'monday')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'tuesday') != date_string_lower) {
		var return_object = {
			'extracted': 2,
			'revised' : extractPhrase(date_string_lower, 'tuesday')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'wednesday') != date_string_lower) {
		var return_object = {
			'extracted': 3,
			'revised' : extractPhrase(date_string_lower, 'wednesday')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'thursday') != date_string_lower) {
		var return_object = {
			'extracted': 4,
			'revised' : extractPhrase(date_string_lower, 'thursday')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'friday') != date_string_lower) {
		var return_object = {
			'extracted': 5,
			'revised' : extractPhrase(date_string_lower, 'friday')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'saturday') != date_string_lower) {
		var return_object = {
			'extracted': 6,
			'revised' : extractPhrase(date_string_lower, 'saturday')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'today') != date_string_lower) {
		var return_object = {
			'extracted': moment().day(),
			'revised' : extractPhrase(date_string_lower, 'today')
		}
		return return_object;
	}

	if (extractPhrase(date_string_lower, 'tomorrow') != date_string_lower) {
		var return_object = {
			'extracted': (moment().day() == 6 ? 0 : moment().day() + 1),
			'revised' : extractPhrase(date_string_lower, 'tomorrow')
		}
		return return_object;
	}

	return {'extracted': moment().day(), 'revised': date_string}
}

var extractYear = function(date_string) {
	var year_start = 2000;
	var year_end = 2100;
	for (var i = year_start; i < year_end; i++) {
		if (extractPhrase(date_string, i.toString()) != date_string) {
			var return_object = {
				'extracted': i,
				'revised' : extractPhrase(date_string, i.toString())
			}
			return return_object;
		}
	}

	return {'extracted': moment().year(), 'revised': date_string};
}