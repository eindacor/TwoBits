if (Meteor.isServer) {

	ACCOUNT_SID = 'AC789aba0503b38a38b2b186f5004cbc5a';
	AUTH_TOKEN = '2761b8b6fd7eedfc9d7345e3f992553b';

	// https://github.com/iron-meteor/iron-router
	// https://www.npmjs.com/package/twilio-meteor
	// http://twilio.github.io/twilio-node/#quickstart

	Router.route('/restful', {where: 'server'})

	.get(function () {
		// this.response.end('get request\n');
	})

	.post(function () {

		twilio = Twilio(ACCOUNT_SID, AUTH_TOKEN);
		
		var caller = this.request.body.From;
		var message = this.request.body.Body;

		twilio.sendSms({
			to: caller,
			from: '+16195522487', 
			body: 'Hello,'
		}, function(err, responseData) {
			if (!err) {
				console.log(responseData.from);
				console.log(responseData.body);
				console.log(responseData)
			}
		});
	});

}
