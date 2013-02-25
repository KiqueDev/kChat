////////// Shared code (client and server) //////////

// Users = new Meteor.Collection('users');
// Messages = new Meteor.Collection('messages');
// {name: 'matt', game_id: 123}
 Rooms = new Meteor.Collection('rooms');
 Messages = new Meteor.Collection('messages');

if (Meteor.isServer) {
  // publish all the non-idle players.
  // Meteor.publish('users', function () {
  //   return Users.find({idle: false});
  // });

  
}
if (Meteor.isClient) {
  // publish all the non-idle players.
  // Meteor.publish('users', function () {
  //   return Users.find({idle: false});
  // });

  
}

