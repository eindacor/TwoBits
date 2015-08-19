Router.configure({
	'layoutTemplate': "layout"
});

Router.route('/',{
	name:'reservationsDashboard'
});

Router.route('/twilioTest', function() {
	this.render('twilioTest');
});

Router.route('/textParse',{
	name:'textParse'
});

Router.route('/dbCheck',{
	name:'dbCheck'
});