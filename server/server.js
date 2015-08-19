var getUserIdFromPhoneNumber = function(phone_number) {
    var modified_number = phone_number.replace(/-/g, '');
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

        var dateTest = getDateFromString(message);

        var hour_string = dateTest.hour() % 12;
        if (hour_string == 0)
            hour_string = 12;

        var am_pm = (dateTest.hour() >= 12 ? 'pm' : 'am');

        var time_string = hour_string + ':' + (dateTest.minute() < 10 ? '0' + dateTest.minute() : dateTest.minute()) + am_pm;

        //console.log(Meteor.userId());

        var barbers = ['TJ','Kevin','Mikey','VJ', 'Bob', 'Rico', 'Larry', 'Dante', 'Rosco', 'Eli'];
        var barber_index = Math.floor(Math.random() * (barbers.length - 1));

        var calObject = {
            "title": "Appointment with " + barbers[barber_index] + " at " + time_string,
            "start": dateTest._d,
            "end": dateTest._d,
            "owner": "zCHb4oFZtwEH4HrjQ",
            "barber":  barbers[barber_index]
        }

        CalEvent.insert(calObject);

        twilio.sendSms({
            to: caller,
            from: '+16195522487', 
            body: 'message from: ' + caller + ', date entered: ' + dateTest.toString()
        }, function(err, responseData) {
            if (!err) {
                console.log(responseData.from);
                console.log(responseData.body);
                console.log(responseData);
            }
        });
    });

}

Meteor.methods({
    'parseText': function(date_string) {
        return getDateFromString(date_string)._d;
    }
})