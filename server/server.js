var getNameFromPhoneNumber = function(phone_number) {
    switch(phone_number) {
        case '+16098928262' : return "Joe Pollack";
        case '+12037528089' : return "Chris Impastato";
        case '+12035437997' : return "Peter Mooney";
        case '+14087188788' : return "Krishna Sampath";
        default: return "John Smith";
    }
}

var getUserIdFromPhoneNumber = function(phone_number) {
    return "zCHb4oFZtwEH4HrjQ";
}

var getFormattedTimeFromDate = function(date_object) {
    var hour_string = date_object.hour() % 12;

    if (hour_string == 0)
        hour_string = 12;

    var am_pm = (date_object.hour() >= 12 ? 'pm' : 'am');

    var time_string = hour_string + ':' + (date_object.minute() < 10 ? '0' + 
        date_object.minute() : date_object.minute()) + am_pm;
    return time_string;
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
    return_string += getFormattedTimeFromDate(date_object);

    return return_string;
}

var sendMessage = function(twilio, to_number, message) {
    twilio.sendSms({
        to: to_number,
        from: '+16195522487',
        body: message
    }, 

    function(err, responseData) {
        if (!err) {
            console.log(responseData.from);
            console.log(responseData.body);
            console.log(responseData);
        }
    });
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

        if (caller == '+12037528089' && responseIsPositive(message)) {
            var temp_reservations = temp_CalEvent.find({});

            temp_reservations.forEach( function(temp_reservation) {
                CalEvent.insert(temp_reservation);
                var temp_id = temp_reservation._id;
                temp_CalEvent.remove({'_id': temp_id});

                var message_out = 'Your appointment on ' + getFormattedStringFromDate(moment(temp_reservation.start)) +
                    ' has been confirmed.';
                sendMessage(twilio, temp_reservation.phone_number, message_out);
            });
        }

        else if(extractCancellation(message).extracted) {
            var reservations_found = CalEvent.find({'phone_number': caller});

            reservations_found.forEach( function(reservation) {
                var res_id = reservation._id;
                var date_of_res = reservation.start;
                var phone_number = reservation.phone_number;
                var customer_name = reservation.name;
                CalEvent.remove({'_id': res_id});

                var message_to_customer = 'Your appointment on ' + getFormattedStringFromDate(moment(date_of_res)) + 
                    ' has been cancelled.';
                sendMessage(twilio, phone_number, message_to_customer);

                var message_to_barber = customer_name + '\'s appointment on ' + 
                    getFormattedStringFromDate(moment(date_of_res)) + ' has been cancelled.';
                sendMessage(twilio, '+12037528089', message_to_barber);
            });
        }

        else {
            var date_object = getDateFromString(message);

            var time_string = getFormattedTimeFromDate(date_object);

            // var customers = ['TJ Johnson','Kevin Robinson','Mikey Belushi','VJ Impastato', 
            //     'Bob Verhoff', 'Rico Suave', 'Larry David', 'Dante Bernette', 'Rosco Bosco', 'Eli Roman'];
            // var customer_index = Math.floor(Math.random() * (customers.length - 1));

            var caller_name = getNameFromPhoneNumber(caller);
            var calObject = {
                "title": caller_name + " @ " + time_string,
                "start": date_object._d,
                "end": date_object._d,
                "owner": getUserIdFromPhoneNumber(caller),
                "phone_number": caller,
                "name": caller_name,
                "barber":  'Eddie'
            }

            temp_CalEvent.insert(calObject);

            message_out = caller_name + ' has requested an appoinment on ' 
                + getFormattedStringFromDate(date_object) + '. Please confirm.';
            sendMessage(twilio, '+12037528089', message_out);
        }
    });
}

Meteor.methods({
    'parseText': function(date_string) {
        return getDateFromString(date_string)._d;
    }
})
