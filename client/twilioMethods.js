Template.twilioTest.rendered = function() {
	//users_number = getCurrentUserNumber();
	var user_number = '16098928262';
	Meteor.call('getMessages', user_number);
}

Template.twilioTest.events({
	'click #response-test': function () {
		// var user_number = '16098928262';
		var user_number = '12037528089';
		Meteor.call('sendMessage', user_number);
		console.log('sending message');
	}
});