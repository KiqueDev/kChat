
Template.room.peopleInRoom = function() {
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

