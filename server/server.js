var getNameFromPhoneNumber = function(phone_number) {
    var modified_number = phone_number.replace(/-/g, '');

    return "John Smith";
}

var getUserIdFromPhoneNumber = function(phone_number) {
    return "zCHb4oFZtwEH4HrjQ";
}

var getFormattedStringFromDate = function(date_object) {
    var return_string = "";

    switch(date_object.day()) {
        case 0: return_string += "Sunday"; break;
        case 1: return_string += "Monday"; break;
        case 2: return_string += "Tuesday"; break;
        case 3: return_string += "Wednesday"; break;
        case 4: return_string += "Thursday"; break;
        case 5: return_string += "Friday"; break;
        case 6: return_string += "Saturday"; break;
        default: return_string += "INVALID_DAY"; break;
    }

    return_string += ", ";

    switch(date_object.month()) {
        case 0: return_string += "January"; break;
        case 1: return_string += "February"; break;
        case 2: return_string += "March"; break;
        case 3: return_string += "April"; break;
        case 4: return_string += "May"; break;
        case 5: return_string += "June"; break;
        case 6: return_string += "July"; break;
        case 7: return_string += "August"; break;
        case 8: return_string += "September"; break;
        case 9: return_string += "October"; break;
        case 10: return_string += "November"; break;
        case 11: return_string += "December"; break;
        default: return_string += "INVALID_MONTH"; break;
    }

    return_string += " " + date_object.date() +' at ';

    var hour_string = date_object.hour() % 12;
    if (hour_string == 0)
        hour_string = 12;

    var am_pm = (date_object.hour() >= 12 ? 'pm' : 'am');

    return_string += hour_string + ':' + (date_object.minute() < 10 ? '0' + date_object.minute() : date_object.minute()) + am_pm;
    return return_string;
}

if (Meteor.isServer) {

    ACCOUNT_SID = 'AC789aba0503b38a38b2b186f5004cbc5a';
    AUTH_TOKEN = '2761b8b6fd7eedfc9d7345e3f992553b';

    Router.route('/restful', {where: 'server'})

    .get(function () {

    })

    .post(function () {

        twilio = Twilio(ACCOUNT_SID, AUTH_TOKEN);

        var caller = this.request.body.From;
        var message = this.request.body.Body;

        if (caller == '+12037528089') {
            var temp_reservations = temp_CalEvent.find({});

            temp_reservations.forEach( function(temp_reservation) {
                CalEvent.insert(temp_reservation);
                var temp_id = temp_reservation._id;
                temp_CalEvent.remove({'_id': temp_id});
            });
        }

        else {
            var dateTest = getDateFromString(message);

            var hour_string = dateTest.hour() % 12;
            if (hour_string == 0)
                hour_string = 12;

            var am_pm = (dateTest.hour() >= 12 ? 'pm' : 'am');

            var time_string = hour_string + ':' + (dateTest.minute() < 10 ? '0' + dateTest.minute() : dateTest.minute()) + am_pm;

            var customers = ['TJ Johnson','Kevin Robinson','Mikey Belushi','VJ Impastato', 'Bob Verhoff', 'Rico Suave', 'Larry David', 'Dante Bernette', 'Rosco Bosco', 'Eli Roman'];
            var customer_index = Math.floor(Math.random() * (customers.length - 1));

            var calObject = {
                "title": customers[customer_index] + " - " + time_string,
                "start": dateTest._d,
                "end": dateTest._d,
                "owner": getUserIdFromPhoneNumber(caller),
                "barber":  'Eddie'
            }

            temp_CalEvent.insert(calObject);

            twilio.sendSms({
                to: '+12037528089',
                from: '+16195522487',
                body: customers[customer_index] + ' has requested an appoinment on ' + getFormattedStringFromDate(dateTest) + '. Please confirm.'
            }, 

            function(err, responseData) {
                if (!err) {
                    console.log(responseData.from);
                    console.log(responseData.body);
                    console.log(responseData);
                }
            });
        }
    });
}

Meteor.methods({
    'parseText': function(date_string) {
        return getDateFromString(date_string)._d;
    }
})
