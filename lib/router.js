Router.configure({
	'layoutTemplate': "layout"
});

Router.route('/',{
	name:'reservationsDashboard'
});

Router.route('/twilioTest',{
	name:'twilioTest'
});

Router.route('/textParse',{
	name:'textParse'
});