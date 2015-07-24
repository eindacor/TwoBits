Meteor.startup(function () {
	Meteor.methods({
		'saveCalEvent':function(calendarevent){
			CalEvent.insert(calendarevent);
		}
	});
});