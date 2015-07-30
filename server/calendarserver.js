Meteor.startup(function () {
	Meteor.methods({
		'saveCalEvent':function(ce){
			CalEvent.insert(ce);
		},

		'updateTitle':function(id,title){
			return CalEvent.update({_id:id},{$set:{title:title}});
		},

		'moveEvent':function(reqEvent){
			return CalEvent.update({_id:reqEvent._id}, 
				{$set:{
					start:reqEvent.start,
					end:reqEvent.end
				}
			})
		}
	});
});