////////// Server only logic //////////
Meteor.publish("chatRooms", function(){
   return Rooms.find({});
});
Meteor.publish("users", function(){

   return Meteor.users.find({});
});
Meteor.publish("messages", function(){

   return Messages.find({});
});

Meteor.users.allow({
   remove: function () { return true; }, 
   insert: function () { return true; }, 
   update: function () {return true; }
});




Accounts.onCreateUser(function(options, user) {
  
  user.Room = {"inRoom":false, "inRoomID":"", "inRoomTitle":""};
  // user.inRoomID = '';
  // user.inRoomTitle = '';
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});

 