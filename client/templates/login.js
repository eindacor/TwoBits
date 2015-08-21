Template.login.events({
	'click #login': function(event, template) {
		event.preventDefault();
		// retrieve the input field values
		var email = template.find('#login-email').value;
		var password = template.find('#login-password').value;
		// Trim and validate your fields here.... 	

		// If validation passes, supply the appropriate fields to the
		// Meteor.loginWithPassword() function.
		Meteor.loginWithPassword(email, password, function(err){
			if (err){
				console.log('---login failed, error below---');
				console.log(err);
				alert('Login attempt failed. Please try again.');
			}	

			else{
				Session.set('showCalendar', true);
				Router.go('/');	
			}
		});

		return false; 
	},

	'click #register': function(event, template) {
		event.preventDefault();
		Router.go('registrationForm'); 
	}
});