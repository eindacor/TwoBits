getDateFromString = function(date_string) {
	var entered_moment = moment();
	date_string = date_string.replace(/\n/g, ' ');
	// determine whether the date has been specified based on keywords
	if (dateIsSpecified(date_string)) {
		entered_moment = extractDate(date_string).extracted;
		date_string = extractDate(date_string).revised;
	}

	// if it has not, determine what day is implied by the text
	else {
		var day_found = extractDay(date_string).extracted;
		entered_moment.day((moment().day() > day_found ? day_found + 7 : day_found));
		date_string = extractDay(date_string).revised;
	}

	// after the date has been identified, determine if a year was specified
	var year_min = 2000;
	var year_max = 2100;
	if (extractYear(date_string, year_min, year_max).extracted != 'none found')
		entered_moment.year(extractYear(date_string, year_min, year_max).extracted);

	date_string = extractYear(date_string, 2000, 2100).revised;

	var time_object = extractTime(date_string, 'pm');

	entered_moment.hour(time_object.hour);
	entered_moment.minute(time_object.minute);
	entered_moment.second(0);

	return entered_moment;
}

// determines whether the date has been specified based on keywords
var dateIsSpecified = function(date_string) {
	var date_indicators = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', '\/', 
	'1st', '2nd', '2th', '3rd', '3th', '4th', '5th', '6th', '7th', '8th', '19th', '0th'];
	return stringContainsAnyPhrase(date_string, date_indicators);
}

// returns an object containing the hours and minutes specified in the string based on a 24-hour clock
// if no time is identified, returns 0:00
var extractTime = function(date_string, am_pm) {
	var string_lower = date_string.toLowerCase();
	// "noon"
	if (getIndicesOfPhrase(string_lower, 'noon').first != -1) {
		return {'hour': 12, 'minute': 0};
	}

	// "at 12"
	if (getIndicesOfPhrase(string_lower, 'at ').first != -1) {
		var end_index = getIndicesOfPhrase(string_lower, 'at ').end;
		return extractTime(date_string.substr(end_index), am_pm);
	}

	// "12 o'clock"
	if (getIndicesOfPhrase(string_lower, "o'clock").first != -1) {
		var first_index = getIndicesOfPhrase(string_lower, "o'clock").first;
		return extractTime(date_string.substr(0, first_index), am_pm);
	}

	// "12pm"
	if (getIndicesOfPhrase(string_lower, 'pm').first != -1) {
		var first_index = getIndicesOfPhrase(string_lower, 'pm').first;
		return extractTime(date_string.substr(0, first_index), 'pm');
	}

	// "12am"
	if (getIndicesOfPhrase(string_lower, 'am').first != -1) {
		var first_index = getIndicesOfPhrase(string_lower, 'am').first;
		return extractTime(date_string.substr(0, first_index), 'am');
	}

	// 2 at night
	if (getIndicesOfPhrase(string_lower, 'at night').first != -1) {
		var first_index = getIndicesOfPhrase(string_lower, 'at night').first;
		return extractTime(date_string.substr(0, first_index), 'pm');
	}

	// 8 in the morning
	if (getIndicesOfPhrase(string_lower, 'in the morning').first != -1) {
		var first_index = getIndicesOfPhrase(string_lower, 'in the morning').first;
		return extractTime(date_string.substr(0, first_index), 'am');
	}

	// "@3:30"
	if (getIndicesOfPhrase(string_lower, '@').first != -1) {
		var end_index = getIndicesOfPhrase(string_lower, '@').end;
		return extractTime(date_string.substr(end_index), am_pm);
	}

	// "12:15"
	if (string_lower.indexOf(':') != -1) {
		var hours = parseInt(string_lower.substr(0, string_lower.indexOf(':')));
		var minutes = parseInt(string_lower.substr(string_lower.indexOf(':') + 1));

		if (hours == 12 && am_pm == 'am')
			hours = 0;

		if (hours != 12 && am_pm == 'pm')
			hours += 12;

		return {'hour': hours, 'minute': minutes};
	}

	var reduced_string = "";
	for (var i = 0; i < string_lower.length; i++) {
		if (!isNaN(string_lower[i]) && string_lower[i] != ' ')
			reduced_string += string_lower[i];
	}

	var parsed_hour = (reduced_string.length == 0 ? 0 : parseInt(reduced_string));

	if (parsed_hour == 12 && am_pm == 'am')
		parsed_hour = 0;

	if (parsed_hour != 12 && am_pm == 'pm')
		parsed_hour += 12;

	return {'hour': parsed_hour, 'minute': 0};
}

// finds phrase within the given string, and returns indices 'first', 'last', and 'end'
// if the phrase is not found, returns -1 for all indices
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

// returns the string passed without the phrase specified
// if the phrase is not found, original string is returned
var extractPhrase = function(string_to_search, phrase_to_extract) {
	var string_lower = string_to_search.toLowerCase();
	var phrase_lower = phrase_to_extract.toLowerCase();
	if (getIndicesOfPhrase(string_lower, phrase_lower).first != -1) {
		var index_object = getIndicesOfPhrase(string_lower, phrase_lower);
		return string_to_search.substr(0, index_object.first) + string_to_search.substr(index_object.end);
	}

	else return string_to_search;
}

// returns the string passed without any of the phrases specified
// if the phrase is not found, original string is returned
var extractPhrases = function(string_to_search, phrases_to_extract) {
	var string_lower = string_to_search.toLowerCase();
	var revised_string = string_to_search;
	for (var i = 0; i < phrases_to_extract.length; i++) {
		var phrase_lower = phrases_to_extract[i].toLowerCase();
		var revised_lower = revised_string.toLowerCase();
		if (getIndicesOfPhrase(revised_lower, phrase_lower).first != -1) {
			var index_object = getIndicesOfPhrase(revised_lower, phrase_lower);
			revised_string = revised_string.substr(0, index_object.first) + revised_string.substr(index_object.end);
		}
	}

	return revised_string;
}

 // returns true if any of the phrases passed are in the string provided
var stringContainsAnyPhrase = function(string_to_search, phrases_to_check) {
	var string_lower = string_to_search.toLowerCase();
	for (var i = 0; i < phrases_to_check.length; i++) {
		var phrase_lower = phrases_to_check[i].toLowerCase();

		if (string_lower.indexOf(phrase_lower) != -1)
			return true;
	}

	return false;
}

var some_string = "this is a cool string";
var index_of_word = some_string.indexOf('cool');


var getMonthEndIndex = function(date_string) {
	var month_identifiers = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 
		'september', 'october', 'november', 'december', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 
		'aug', 'sep', 'oct', 'nov', 'dec'];

	for (var i = 0; i < month_identifiers.length; i++) {
		if (getIndicesOfPhrase(date_string, month_identifiers[i]).first != -1)
			return getIndicesOfPhrase(date_string, month_identifiers[i]).end;
	}

	return -1;
}

// identifies the date specified in the string, and returns an object
// containing a date object ('extracted') and the original string with the date
// identifier(s) sliced ('revised')
//
// "the date is February 14th" would return the object {'extracted': <Date object for 2/14/2015>, 'revised': 'the date is '}
var extractDate = function(date_string) {
	if (date_string.indexOf('\/') != -1) {
		var slash_found = false;
		var slash_string = "";
		// iterate through string, adding any numbers or slashes found
		for (var i = 0; i < date_string.length; i++) {	
			if (date_string[i] == ' ' || date_string[i] == ',') {
				// if a slash has been found and there is a break in the characters, end loop
				if (slash_found)
					break;

				else slash_string = "";
			}

			// add numbers and slashes to slash_string
			else if (!isNaN(date_string[i]) || date_string[i] == '\/')
				slash_string += date_string[i];

			if ( date_string[i] == '\/')
				slash_found = true;
		}

		// create moment using moment.js
		var test_moment = moment(slash_string, "MM-DD-YYYY");

		return {'extracted': test_moment, 'revised': extractPhrase(date_string, slash_string)}
	}

	else {
		var month_identifiers = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
		var month_identified;
		var revised_string = "";

		if (stringContainsAnyPhrase(date_string, month_identifiers)) {
			month_identified = extractMonth(date_string).extracted;

			var month_end_index = getMonthEndIndex(date_string);
			var string_contents_after_month = date_string.substr(month_end_index);

			var number_found = false;
			var number_string = "";
			for (var i = 0; i < string_contents_after_month.length; i++) {
				if (string_contents_after_month[i] == ' ' || string_contents_after_month[i] == ',') {
					if (number_found)
						break;
				}

				else if (!isNaN(string_contents_after_month[i])) {
					number_string += string_contents_after_month[i];
					number_found = true;
				}
			}

			revised_string = extractMonth(date_string).revised;
			revised_string = extractPhrase(revised_string, number_string);

			var moment_found = moment();
			moment_found.month(month_identified);
			moment_found.date(parseInt(number_string));
			return {'extracted': moment_found, 'revised': revised_string}
		}

		else return {'extracted': moment(), 'revised': date_string}
	}
}

// identifies the month specified in the string, and returns an object
// containing the month's numeric value ('extracted') and the original string with the month
// identifier sliced ('revised')
//
// "the month is February" would return the object {'extracted': 1, 'revised': 'the month is '}
var extractMonth = function(date_string) {
	var date_string_lower = date_string.toLowerCase();
	var phrases_to_check = ['january', 'jan'];
	var month_return = 0;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}
	
	phrases_to_check = ['february', 'feb'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['march', 'mar'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['april', 'apr'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['may'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['june', 'jun'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['july', 'jul'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['august', 'aug'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['september', 'sep', 'sept'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['october', 'oct'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['november', 'nov'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['december', 'dec'];
	month_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': month_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	return {'extracted': moment().month(), 'revised': date_string}
}

// identifies the day specified in the string, and returns an object
// containing the day's numeric value ('extracted') and the original string with the day
// identifier(s) sliced ('revised')
//
// "the day is Tuesday" would return the object {'extracted': 2, 'revised': 'the day is '}
var extractDayOfWeek = function(date_string) {
	var date_string_lower = date_string.toLowerCase();
	var phrases_to_check = ['sunday', 'sun'];
	var day_return = 0;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': day_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}
	
	phrases_to_check = ['monday', 'mon'];
	day_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': day_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}
	
	phrases_to_check = ['tuesday', 'tues', 'tue'];
	day_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': day_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['wednesday', 'weds', 'wed'];
	day_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': day_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['thursday', 'thurs'];
	day_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': day_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['friday', 'fri'];
	day_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': day_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	phrases_to_check = ['saturday', 'sat'];
	day_return++;
	if (stringContainsAnyPhrase(date_string_lower, phrases_to_check))
		return {'extracted': day_return, 'revised': extractPhrases(date_string_lower, phrases_to_check)}

	if (stringContainsAnyPhrase(date_string_lower, ['today', 'tonight']))
		return {'extracted': moment().day(), 'revised': extractPhrases(date_string_lower, ['today', 'tonight'])}

	if (stringContainsAnyPhrase(date_string_lower, ['tomorrow']))
		return {'extracted': moment().day() + 1, 'revised': extractPhrase(date_string_lower, 'tomorrow')}

	return {'extracted': moment().day(), 'revised': date_string}
}

// identifies any day-related qualifiers like "this" or "next", and modifies the 
// day's numeric value according to the moment.js documentation's specifications
// relevant documentation: http://momentjs.com/docs/#/get-set/day/
//
// "some time next Tuesday" would return the object {'extracted': 9, 'revised': 'some time '}
var extractDay = function(date_string) {
	var date_string_lower = date_string.toLowerCase();
	if (getIndicesOfPhrase(date_string_lower, 'this').first != -1) {
		var index_object = getIndicesOfPhrase(date_string_lower, 'this');
		var day_found = extractDayOfWeek(date_string_lower.substr(index_object.end)).extracted;
		day_found = ((moment().day() >= day_found ? day_found + 7 : day_found));
		var revised_string = extractDayOfWeek(date_string_lower.substr(index_object.end)).revised;
		return {'extracted': day_found, 'revised': extractPhrase(revised_string, 'this')}
	}

	if (getIndicesOfPhrase(date_string_lower, 'next').first != -1) {
		var index_object = getIndicesOfPhrase(date_string_lower, 'next');
		var day_found = extractDayOfWeek(date_string_lower.substr(index_object.end)).extracted;
		day_found = ((moment().day() > day_found ? day_found + 14 : day_found + 7));
		var revised_string = extractDayOfWeek(date_string_lower.substr(index_object.end)).revised;
		return {'extracted': day_found, 'revised': extractPhrase(revised_string, 'next')}
	}

	return extractDayOfWeek(date_string);
}

// identifies the year specified in the string, and returns an object
// containing the year as a number ('extracted') and the original string with the year
// identifier sliced ('revised')
//
// "the year is 2011" would return the object {'extracted': 2011, 'revised': 'the year is '}
// only if 2011 is withing the bounds provided
//
// if no year is identified within the range, this method will return the current year
var extractYear = function(date_string, search_start, search_end) {
	for (var i = search_start; i < search_end; i++) {
		if (extractPhrase(date_string, i.toString()) != date_string) {
			var return_object = {
				'extracted': i,
				'revised' : extractPhrase(date_string, i.toString())
			}
			return return_object;
		}
	}

	return {'extracted': 'none found', 'revised': date_string};
}

responseIsPositive = function(message) {
    var message_lower = message.toLowerCase();
    var keywords = ['yes', 'ok', 'good', 'fine', 'confirm', 'do it', 'yessir', 'aight', 'word', 'si', 
        'oui', 'sure', 'no problem'];
    return stringContainsAnyPhrase(message_lower, keywords);
}

extractCancellation = function(message) {
	var message_lower = message.toLowerCase();
	var keywords = ['cancel appointment', 'cancel reservation'];
	var keywords_to_remove = ['appointment', 'reservation', 'cancel'];

	if (stringContainsAnyPhrase(message_lower, keywords))
		return {'extracted': true, 'revised': extractPhrases(message_lower, keywords_to_remove)};

	else return {'extracted': false, 'revised': message};
}