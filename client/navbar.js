Template.navbar.events({
	'click #logout-button': function(event) {
		event.preventDefault();
		Meteor.logout();
		Router.go('/login');
	}
})