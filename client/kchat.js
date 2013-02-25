// ////////// Client only logic //////////
// Template.lobby.waiting = function() {
//   var users = Users.find({
//     _id: {
//       $ne: Session.get('user_id')
//     },
//     name: {
//       $ne: ''
//     },
//     // game_id: {$exists: false}
//   });
//   return users;
// };
// Template.lobby.count = function() {
//   var users = Users.find({
//     _id: {
//       $ne: Session.get('user_id')
//     },
//     name: {
//       $ne: ''
//     },
//     //game_id: {$exists: false}
//   });
//   return users.count();
// };
// Template.lobby.logged_out = function() {
//   return Session.get('logged_out');
// }
// Template.lobby.events({
//   'click #login': function(evt) {
//     var name = $('#myname').val().trim();
//     if(name != '') {
//       //CHECKK
//       var userIDStr = getCookie("userID");
//       if(userIDStr === undefined){
//         var user_id = Users.insert({
//           name: name,
//           idle: false
//         });
//         Session.set('user_id', user_id);
//         setCookie("userID", user_id, 1);
//         Session.set("logged_out", false);
//       }else{
//         alert("You Already Login");
//       }
//     } else {
//       alert("Please Fill in Blank");
//     }
//   },
//   'click #logout': function(evt) {
//     var userIDStr = getCookie("userID");
//     deleteCookie("userID");
//     Users.remove({_id: userIDStr});
//     Session.set('logged_out', true);
//   },
//   'click #sendMessage': function(evt) {
//       //alert("Cliked Send");
//       var msg = $('#messageTextArea').val().trim();
//       var userIDStr = getCookie("userID");
//       console.log(userIDStr);
//       var username = Users.find({_id: userIDStr}).fetch()[0].name;
//       //alert(username);
//       //alert(Session.get("name"));
//       if(msg !== ''){
//         var msgs = Messages.insert({
//           name: username,
//           messages: msg
//         });
//         $('#mainTextArea').val(msg);
//         $('#messageTextArea').val('');
//         alert('Message Sent');
//       }else{
//         alert('Emtpy text');
//       }
//   }
// });
// function deleteCookie(c_name) {
//   document.cookie = encodeURIComponent(c_name) + "=deleted; expires=" + new Date(0).toUTCString();
// }
// function getCookie(c_name) {
//   var i, x, y, ARRcookies = document.cookie.split(";");
//   for(i = 0; i < ARRcookies.length; i++) {
//     x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
//     y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
//     x = x.replace(/^\s+|\s+$/g, "");
//     if(x === c_name) {
//       return unescape(y);
//     }
//   }
// }
// function setCookie(c_name, value, exdays) {
//   var exdate = new Date();
//   exdate.setDate(exdate.getDate() + exdays);
//   var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
//   document.cookie = c_name + "=" + c_value;
// }

////////// Client only logic //////////
// Template.room.count = function() {
//   var rID = Session.get("rID");
//   var numberOfUserInRoom = Rooms.find({_id:rID}).fetch()[0].people.length;

//   return users;
// };
Template.room.peopleInRoom = function() {
  // var users = Meteor.users.find({
  //   _id: {
  //     $ne: Meteor.userId()
  //   },
  //   username: {
  //     $ne: ''
  //   },
  //   //game_id: {$exists: false}
  // });
  
  var roomCount;
  var roomsRecord = Rooms.findOne({_id:Session.get("rID")});
  if(roomsRecord){
    roomCount = roomsRecord.peopleUser;
  }
  return roomCount;
};


Template.main.roomCount = function() {
  var rooms = Rooms.find({
    roomTitle: {
      $ne: ''
    },
    //game_id: {$exists: false}
  });
  return rooms.count();
};

Template.main.waitingRoom = function() {
  var rooms = Rooms.find({
    roomTitle: {
      $ne: ''
    },
  });
  return rooms;
};

Template.page.inRoom = function() {
  return Session.get("inRoom");
};

Template.room.rID = function() {
  return Session.get("rID");
};
Template.room.rTitle = function() {
  return Session.get("rTitle");
};
//EVENTS HANDLERS BUTTON
$(document).on("click", ".joinRoom", function(event){
    var roomID= $(this).attr("roomId");
    var roomTitle= $(this).attr("roomTitle");
    var userID = Meteor.userId();
    var userName = Meteor.users.findOne({_id:userID}).username;

    Session.set("inRoom", true);
    Session.set("rTitle", roomTitle);

    //Push UserID into inRoomArr
    Rooms.update({_id:roomID},{$push:{peopleID:userID, peopleUser:userName}});

    Meteor.users.update( { _id:Meteor.userId() }, { $set:{ Room: {"inRoom":true , "inRoomID":roomID, "inRoomTitle":roomTitle} } } );
    //Meteor.users.update( { _id:Meteor.userId() }, { $set:{ Room: {"inRoomID":roomID} } });

    alert("Inside: " +roomID);
});

$(document).on("click", "#goout", function(event){
  console.log("Go Out Button Clicked");

  var userRecord = Meteor.users.findOne({_id:Meteor.userId()});
  var userID = Meteor.userId();
  var userName = Meteor.users.findOne({_id:userID}).username;

  if(userRecord){
    inroomid = userRecord.Room.inRoomID;
  }
  //Push UserID into inRoomArr
  Rooms.update({_id:inroomid},{$pull:{ peopleID:Meteor.userId(), peopleUser:userName }});

  Meteor.users.update( { _id:Meteor.userId() }, { $set:{ Room:{"inRoomID":'', "inRoomTitle":'', "inRoom":false} } });

});



$(document).on("click", "#createRoom", function(event){
    var roomtitle = $("#roomTitle").val();
    if(roomtitle !== ''){
      Rooms.insert({ roomTitle: roomtitle, peopleID:[], peopleUser:[] });
      $("#roomTitle").val('');
    }else{
      alert("Please Fill in Field");
    }
});


Template.room.events({
  'click #sendMessage': function(evt) {
    console.log("send clicked");
    var msg= $("#messageTextArea").val();

    console.log(Session.get("rID"));
    Messages.insert({
     rID: Session.get("rID"),
     message:msg,
     userID:Meteor.userId(),
     username:Meteor.users.findOne({_id:Meteor.userId()}).username,
     time:+(new Date())
    });
    

    $("#messageTextArea").val('')
    }
  
});

Meteor.startup(function() {


});


Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Meteor.autorun(function(){
  Meteor.subscribe("chatRooms");
  Meteor.subscribe("users");
  Meteor.subscribe("messages");

  var inroom;
  var inroomid;
  var inroomTitle;

  var userRecord = Meteor.users.findOne({_id:Meteor.userId()});
  if(userRecord){

    inroom = userRecord.Room.inRoom;
    Session.set("inRoom", inroom);

    inroomid = userRecord.Room.inRoomID;
    Session.set("rID", inroomid);

    inroomtitle = userRecord.Room.inRoomTitle;
    Session.set("rTitle", inroomtitle);


    console.log(inroom);
  }

});



//Meteor.call("addField");


/*
var game = function () {
  var me = player();
  return me && me.game_id && Games.findOne(me.game_id);
};

//////
////// lobby template: shows everyone not currently playing, and
////// offers a button to start a fresh game.
//////

Template.lobby.show = function () {
  // only show lobby if we're not in a game
  return !game();
};

Template.lobby.waiting = function () {
  var players = Players.find({_id: {$ne: Session.get('player_id')},
                                  name: {$ne: ''},
                                  game_id: {$exists: false}});

  return players;
};

Template.lobby.count = function () {
  var players = Players.find({_id: {$ne: Session.get('player_id')},
                               name: {$ne: ''},
                              game_id: {$exists: false}});

      return players.count();
};

Template.lobby.disabled = function () {
    var me = player();
    if (me && me.name)
      return '';
      return 'disabled="disabled"';
};

Template.lobby.events({
  'keyup input#myname': function (evt) {
      var name = $('#lobby input#myname').val().trim();
      Players.update(Session.get('player_id'), {$set: {name: name}});
  },
  'click button.startgame': function () {
      Meteor.call('start_new_game');
  }
});

Meteor.startup(function () {
    var player_id = Players.insert({name: '', idle: false});
        
    Session.set('player_id', player_id);

    // subscribe to all the players, the game i'm in, and all
    // the words in that game.
    Meteor.autosubscribe(function () {
    Meteor.subscribe('players');

      if (Session.get('player_id')) {
        var me = player();
        if (me && me.game_id) {
          Meteor.subscribe('games', me.game_id);
          Meteor.subscribe('words', me.game_id, Session.get('player_id'));
        }
      }
      });

});

Meteor.setInterval(function() {

  if (Meteor.status().connected)
    Meteor.call('keepalive', Session.get('player_id'));

}, 20*1000);
*/