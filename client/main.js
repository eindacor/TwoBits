
var barbers = ['TJ','Kevin','Mikey','VJ'];

Template.team.helpers({

	'listOfBarbers' : function() {
		return barbers;
	}

});

Template.team.events({

	'click #barber': function(event, template) {
		var barberName = event.target.value;
		// console.log(barberName);
		Session.set('barberName', barberName);

	}
});