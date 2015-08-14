Router.configure({
	'layoutTemplate': "layout"
});

Router.route('/',{
	name:'reservationsDashboard'
});

Router.route('/twilioTest',{
	name:'twilioTest'
});

// this.route('/webhooks/twilio/handlerespose', {
// 	where: 'server'
// })
// .get(function() {
// 	this.resonse.end(Twilio.handleResponse(this));
// });