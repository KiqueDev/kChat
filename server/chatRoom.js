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



// Meteor.methods({
//    addField: function () {
//          console.log(Meteor.users.find().fetch());
//    }
//    // keepalive: function (user_id) {
//    //       Players.update({_id: player_id},
//    //                  {$set: {last_keepalive: (new Date()).getTime(),
//    //                          idle: false}});
//    // }

// });

Accounts.onCreateUser(function(options, user) {
  
  user.Room = {"inRoom":false, "inRoomID":"", "inRoomTitle":""};
  // user.inRoomID = '';
  // user.inRoomTitle = '';
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});



// Meteor.setInterval(function () {
//   var now = (new Date()).getTime();
//   var idle_threshold = now - 70*1000; // 70 sec
//   var remove_threshold = now - 60*60*1000; // 1hr

//   Players.update({last_keepalive: {$lt: idle_threshold}},
//                  {$set: {idle: true}});

//   // XXX need to deal with people coming back!
//   // Players.remove({$lt: {last_keepalive: remove_threshold}});

// }, 30*1000);