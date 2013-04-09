//HOME TEMPLATE
Template.home.rooms = function() {
  var rooms = Rooms.find({
    roomTitle: {
      $ne: ''
    }
  });
  return rooms;
};
Template.home.user = function() {
  return Meteor.user();
};


//ROOM TEMPLATE
Template.room.user = function() {
  return Meteor.user();
};

Template.room.peopleInRoom = function() {
  return Rooms.findOne({_id:Meteor.user().Room.inRoomID});
};

Template.room.messageCount = function() {
  var messages = Messages.find({
    rID:Meteor.user().Room.inRoomID
    //game_id: {$exists: false}
  });
  return messages;
};


//LOBBY TEMPLATE
Template.lobby.rooms = function() {
  var rooms = Rooms.find({
    roomTitle: {
      $ne: ''
    }
  });
  return rooms;
};


//EVENTS HANDLERS BUTTON
Template.home.events({
  'click #chatnowBtn': function(evt) {
    var user = $("#username").val().trim();
    var password1 = $("#password1").val().trim();
    var password2 = $("#password2").val().trim();
    console.log(user);
    if(user.length > 5 && user.length !== 0 && password1 === password2 && password1.length !=0){
      console.log("passed");
      Accounts.createUser({username:user, password:password1}, function(error){
        if(error){
          $("#errorUsernameMsg").text('User Already Exist');
        }
      });

    }else{
      $("#errorUsernameMsg").text('Username Must Contain At least 5 Characters');
      //alert('Must Contain At least 5 Characters');
    }
  },
  'click #logoutBtn': function(evt) {
    Meteor.logout();
  }
});

//EVENTS HANDLERS BUTTON
$(document).on("click", "#chatnowLoginBtn", function(event){
    var username = $("#usernameLogin").val().trim();
    var password = $("#passwordLogin").val().trim();
    Meteor.loginWithPassword(username, password,
      function (error){
        if(error){
          //alert("Failed to login");
          $("#loginErroMsg").text('Warning: Incorrect Login');
        }else{

          // //PUT BOOLEAN FOR EACH OWNER ROOMS
          // Meteor.call('SetupOwnerRooms');

          $('#loginModal').modal('hide');
          $('#usernameLogin').val('');
          $('#passwordLogin').val('');
          $("#loginErroMsg").text('');
        }

    });
});

$(document).on("click", "#joinRoom", function(event){
  console.log('join');

  var roomID= $(this).attr("roomId");
  var roomTitle= $(this).attr("roomTitle");

  //UPDATE USER WHEN JOINED ROOM
  Meteor.call('UpdateUserRoomInfoToInside', roomID, roomTitle);
});

$(document).on("click", "#deleteRoom", function(event){
  console.log('delete');

  var roomID= $(this).attr("roomId");
  console.log(roomID);
  $(".deleteAlert-"+roomID).show('slow');
});

$(document).on("click", "#cancelDelete", function(event){
  var roomID= $(this).attr("roomId");
  console.log(roomID);
  $(".deleteAlert-"+roomID).hide('slow');
  //UPDATE USER WHEN JOINED ROOM
  //Meteor.call('UpdateUserRoomInfoToInside', roomID, roomTitle);
});

$(document).on("click", "#deleteConfirm", function(event){
  var roomID= $(this).attr("roomId");
  console.log(roomID);
  //DELETE ROOM
  Meteor.call('DeleteRoom', roomID);
});

$(document).on("click", "#goout", function(event){
  console.log("goout");

  var roomID= $(this).attr("roomId");
  //console.log(roomID);
  Meteor.call('UpdateUserRoomInfoToOutside', roomID);
});

Template.lobby.events({
  'click #createRoomBtn': function(evt) {
    var roomtitle = $("#roomTitleName").val().trim();
    if(roomtitle.length !== 0 && roomtitle.length >= 4 && roomtitle.length <= 16 ){
      Rooms.insert({ roomTitle:roomtitle, peopleID:[], peopleUsername:[], createdByID:Meteor.userId() });
      $("#roomTitleName").val('');
      $("#createRoomErroMsg").text('');
    }else{
      $("#createRoomErroMsg").text('Please Fill in Field (Must contain at LEAST 4 and at MOST 16 Characters');
    }
  }
});


Template.room.events({
  'click #sendMessage': function(evt) {
    console.log("send clicked");
    var msg= $("#messageTextArea").val();

    Messages.insert({
      rID: Meteor.user().Room.inRoomID,
      message:msg,
      userID:Meteor.userId(),
      username:Meteor.user().username,
      time:+(new Date())
    });

    $("#messageTextArea").val('');
  },
  'keypress #messageTextArea': function(evt) {
    if (evt.keyCode == 13){
      if (evt.shiftKey === true){
          // new line
          return true;
      }
      else{
        console.log("send clicked");
        var msg= $("#messageTextArea").val();

        Messages.insert({
          rID: Meteor.user().Room.inRoomID,
          message:msg,
          userID:Meteor.userId(),
          username:Meteor.user().username,
          time:+(new Date())
        });

        $("#messageTextArea").val('');
      }
      return false;
    }
  }

});


Meteor.startup(function() {

});

Meteor.autorun(function(){
  Meteor.subscribe("rooms");
  Meteor.subscribe("users");
  Meteor.subscribe("messages");

  
});

Template.lobby.rendered = function(){
  console.log("rendered lobby");
    var room = Rooms.find({});
    room.forEach(function (room) {
      console.log("people: "+$('.'+room._id).attr("people"));
      //$('.tooltip-'+room._id).tooltip('hide');
      $('.tooltip-'+room._id).tooltip({trigger:'click'});

      //DELETE BUTTON SHOW
      if(room.createdByID === Meteor.userId()){
        $('.delete-'+room._id).show();
      }else{
        $('.delete-'+room._id).hide();
      }
    });
}

Template.room.rendered = function(){
  console.log("rendered room");

  //Scroll the msglog All the way to the end
  var elem = document.getElementById('msgLog');
  elem.scrollTop = elem.scrollHeight;


}
