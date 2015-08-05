// if (Meteor.isClient) {
// This is my call back for the close modal button 
Template.Dialog.events({
	"click .closeDialog": function(event, template){
		Session.set('editing_event', null);
		Session.set('showDialogModal', "false");
		},

	'click .updateTitle': function(event, template){
		var title = $('#title').val();
		console.log(title);
		var calObject = {
			"title":title,
			"start":Session.get('date'),
			"end":Session.get('date'),
			"owner":Meteor.userId()
		}
		CalEvent.insert(calObject)
		Meteor.call('updateTitle',Session.get('editing_event'),title);
		Session.set('editing_event',null);
		} 
	});

Template.main.helpers({
	editing_event: function(){
		return Session.get('editing_event');
	}
});

Template.insertCalEvent.helpers({
	showDialogModal: function() {
		return Session.get('showDialogModal') == "true";
	}
});

Template.Dialog.helpers({
	title: function(){
		var ce = CalEvent.findOne({_id:Session.get('editing_event')});
		console.log(Session.get('editing_event'));
		console.log(ce);
		return ce.title;
	},
	showDialogModal: function() {
		return Session.get('showDialogModal') == "true";
	}
});

Template.Dialog.rendered = function (){
	if(Session.get('editDialog')){
		// is editDialog a thing? look into it
		var calevent = CalEvent.findOne({_id:Session.get('editDialog')});
		if(calevent){
			$('#title').val(calevent.title);
		}
	}
}

	Template.main.rendered = function(){
		var calendar = $('#calendar').fullCalendar({ 
			dayClick:function(date,allDay,jsEvent,view){
				Session.set('date', date);
				Session.set('showDialogModal', "true");
			},

			eventClick:function(calEvent,jsEvent,view){
				Session.set('editing_event', calEvent._id);
				$('#title').val(calEvent.title);
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