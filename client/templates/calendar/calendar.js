Template.dialog.events({
	"click .closeDialog": function(event, template){
		Session.set('editing_event', null);
		Session.set('showDialogModal', false);
	},

	'click .updateTitle': function(event, template){
		var title = $('#title').val();
		var calObject = {
			"title": title,
			"start": Session.get('date'),
			"end": Session.get('date'),
			"owner": Meteor.userId(),
			"barber": Session.get('barberName')
		}
		CalEvent.insert(calObject);
		Meteor.call('updateTitle',Session.get('editing_event'),title);
		Session.set('editing_event',null);
		Session.set('barberName', null)
		Session.set('showDialogModal', false)
	}
});

Template.reservationsDashboard.helpers({
	editing_event: function(){
		return Session.get('editing_event');
	},

	showDialogModal: function() {
		return Session.get('showDialogModal');
	},

	showCalendar: function() {
		return Meteor.user() != null;
	}
});

Template.dialog.helpers({
	title: function(){
		if (CalEvent.find({_id: Session.get('editing_event')}).count() > 0) {
			var ce = CalEvent.findOne({_id: Session.get('editing_event')});
			return ce.title;
		}

		else return '';
	},
	showDialogModal: function() {
		return Session.get('showDialogModal');
	}
});

Template.dialog.rendered = function (){
	if(Session.get('editDialog')){
		var calevent = CalEvent.findOne({_id:Session.get('editDialog')});
		if(calevent){
			$('#title').val(calevent.title);
		}
	}
}

Template.reservationsDashboard.rendered = function(){
	var calendar = $('#calendar').fullCalendar({
		dayClick:function(date,allDay,jsEvent,view){
			Session.set('date', date);
			Session.set('showDialogModal', true);
		},

		eventClick:function(calEvent,jsEvent,view){
			Session.set('editing_event', calEvent._id);
			$('#title').val(calEvent.title);
			Session.set('showDialogModal', true);
		},

		eventDrop:function(reqEvent){
			Meteor.call('moveEvent',reqEvent);
		},

		events:function(start,end,callback){
			var calEvents = CalEvent.find({},{reactive:false}).fetch();
			callback(calEvents);
		},
		editable:true,
		selectable:true

	}).data().fullCalendar;
	Deps.autorun(function(){
		CalEvent.find().fetch();
		if(calendar){
			calendar.refetchEvents();
		}
	})
}
