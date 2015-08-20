Template.textParse.helpers({
	'entered_date' : function () {
		var date_info = {
			'day_of_week': Session.get('day_of_week_entered'),
			'day': Session.get('day_entered'),
			'month': Session.get('month_entered'),
			'year': Session.get('year_entered'),
			'hour': Session.get('hour_entered'),
			'minute': Session.get('minute_entered'),
			'original': Session.get('original_string')
		}
		return date_info;
	},

	'show_result' : function() {
		return Session.get('display_result');
	}
})

Template.textParse.events({
	'click #test-button': function() {
		var date_string = $('#string-enter').val();
		console.log(date_string);

		Meteor.call('parseText', date_string, function(error, response) {
			if(error) {
				console.log('ERROR :', error);
			}

			else {
				var entered_date = moment(response);
				// set session variables to update helpers
				Session.set('original_string', date_string);
				Session.set('day_of_week_entered', getDayOfWeekFromInt(entered_date.day()));
				Session.set('day_entered', entered_date.date());
				Session.set('month_entered', getMonthFromInt(entered_date.month()));
				Session.set('year_entered', entered_date.year());
				Session.set('hour_entered', entered_date.hour());
				Session.set('minute_entered', (entered_date.minute() < 10 ? '0' + entered_date.minute() : entered_date.minute()));
				Session.set('display_result', entered_date.isValid());
			}
		});
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