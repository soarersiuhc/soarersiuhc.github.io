(function(){
/*************************
 * Notification Module
*************************/
  var WorkLabel = "Untitled";
  function Notify(err, msg){
    if(err) throw err;
    var pomodoroMessage = msg;
    if(msg == "clock-stops"){
      pomodoroMessage = "The clock is stopped. <span class='reset'>Reset</span> ?";
      $(".pomodoro-message").html("<h2>" + pomodoroMessage + "</h2>");
    }
    else if(msg == "clock-starts"){
      $(".pomodoro-header").html("<h1>" + WorkLabel + "</h1>");
      // Play Audio
      $("#audio-start").get(0).play();
    }
    else if(msg == "break-time-starts"){
      pomodoroMessage = "Well done and have a break! The break ends at:";
      $(".pomodoro-message").html("<h2>" + pomodoroMessage + "</h2>");
      //Play End Music
      $("#audio-end").get(0).play();
    }
    else if(msg == "break-ends"){
      //Play End Music
      $("#audio-end").get(0).play();
    }
  }
  
  function ResetNotifications(){
    //Reset Messages
    $(".pomodoro-message").html("");
    $("#pomodoro-label input").val("");
    $(".pomodoro-header").html("");
  }
  
  function SetWorkLabel(str){
    WorkLabel = str;
  }
  
  var exports = {
    func: Notify,
    reset: ResetNotifications,
    setLabel: SetWorkLabel
  }
  module.exports = exports;
})