Router.configure({
	'layoutTemplate': "layout"
});

Router.route('/textParse',{
	name:'textParse'
});

Router.route('/login',{
	name:'login'
});

Router.route('/logout', function() {
	Session.set('showCalendar', false);
	this.render('login');
});

Router.route('/', function() {
	if (Meteor.user() == null)
		this.render('login');

	else {
		this.render('reservationsDashboard');
		Session.set('showCalendar', true);
	}
});