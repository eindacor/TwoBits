Meteor.methods({
    'getMessages' : function(user_number) {
        var twilio = Twilio("AC789aba0503b38a38b2b186f5004cbc5a", "2761b8b6fd7eedfc9d7345e3f992553b");
        twilio.listSms({
            from:'+' + user_number
        }, function (err, responseData) {
            //Meteor.call('sendMessage', 'message count: ' + responseData.smsMessages.length);
            console.log('message count: ' + responseData.smsMessages.length);
            responseData.smsMessages.forEach(function(message) {
                console.log('Message sent on: '+message.dateCreated.toLocaleDateString());
                console.log(message.body);
            });
        });
    },

    'sendMessage' : function(target_number) {
        var twilio = Twilio("AC789aba0503b38a38b2b186f5004cbc5a", "2761b8b6fd7eedfc9d7345e3f992553b");
        twilio.sendSms({
            to:'+' + target_number, // Any number Twilio can deliver to
            from: '+16195522487 ', // A number you bought from Twilio and can use for outbound communication
            body: 'testing text response' // body of the SMS message
            }, function(err, responseData) { //this function is executed when a response is received from Twilio
                if (!err) { // "err" is an error received during the request, if any
                    // "responseData" is a JavaScript object containing data received from Twilio.
                    // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                    // http://www.twilio.com/docs/api/rest/sending-sms#example-1
                    console.log(responseData.from); // outputs "+14506667788"
                    console.log(responseData.body); // outputs "word to your mother."
                }
        });
    }
});