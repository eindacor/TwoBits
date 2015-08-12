
var barbers = ['TJ','Kevin','Mikey','VJ'];

Template.Team.helpers({

	'listOfBarbers' : function() {
		return barbers;
	}

});

Template.Team.events({

	'click #barber': function(event, template) {
		var barberName = event.target.value;
		// console.log(barberName);
		Session.set('barberName', barberName);

	}
});