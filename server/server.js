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

        var calObject = {
            "title": "phone event",
            "start": dateTest,
            "end": dateTest,
            "owner": "some owner",
            "barber": "John"
        }

        CalEvent.insert(calObject)

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
