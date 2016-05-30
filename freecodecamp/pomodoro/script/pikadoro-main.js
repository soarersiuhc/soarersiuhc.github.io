var Pikadoro = (function(){
  /***********************
  Global variables
  ***********************/
  var ClockHeader = "pika-"
  var EventsArray = [SliderChange, ClockClick, UserReset, SidebarAddPomodoro];
  var State = "Work";

  /***********************
  Modules
  ***********************/
  /* Clock module */
  var Clock = require("./clock.js");
  var Period = require("./period.js");
  
  /***********************
  Global variables
  ***********************/
  var Work = new Period("Work");
  var Break = new Period("Break");
  /***********************
  Functions
  ***********************/
  function main(){
    //Slider initialize/Sidebar display time update
    UpdateSidebar(Work.time, Break.time);
    
    //Clock initialize
    InitializeClock();
    
    //Event Listeners
    var length = EventsArray.length;
    for(i = 0; i < length; i++){
      EventsArray[i]();
    }
  }
  
  /* Initializing functions */
  function UpdateSidebar(WorkTime, BreakTime){
    $("#" + Work.cssid.slider).slider({value: WorkTime});
    $("#" + Work.cssid.panel).html(WorkTime);
    if(typeof BreakTime !== "undefined"){
      $("#" + Break.cssid.slider).slider({value: BreakTime});
      $("#" + Break.cssid.panel).html(BreakTime);
    }
  }
  
  function InitializeClock(){
    console.log(Clock);
    Clock.setTime(Work.time);
    Clock.draw();
  }
  
  /* Event Listeners */
  function SliderChange(){
    $("#" + Work.cssid.slider).slider().on("change", function(slideEvent){
      Work.updateTime(slideEvent.value.newValue);
      $("#" + Work.cssid.panel).html(slideEvent.value.newValue);
      Clock.setTime(slideEvent.value.newValue);
    });
    $("#" + Break.cssid.slider).slider().on("change", function(slideEvent){
      Break.updateTime(slideEvent.value.newValue);
      $("#" + Break.cssid.panel).html(slideEvent.value.newValue);
    });
  }
  
  function ClockClick(){
    $("#" + ClockHeader + "timer-button").click(function(){
      if(Clock.flags.running){
        //Click happens when clock is running
        Clock.stopClock(Notify);
      }
      else if(!Clock.flags.waitforReset){
        //Click happens when clock is not running, and not waiting for reset
        DisableSliders();
        Work.label = $("#pomodoro-label input").val();
        Clock.startClock(Notify);
      }
    });
  }
  
  function UserReset(){
    $(".pomodoro-message").on("click", ".reset", function(){
      Reset("user");
    });
  }

  function SidebarAddPomodoro(){
    $("#toggle-add-pomodoro").click(function(e) {
    e.preventDefault();
    ShowSidebar("add-pomodoro");
    $("#wrapper").toggleClass("toggled");
    })
  };
  
  /* Utility */
  function DisableSliders(){
    $("#" + Work.cssid.slider).slider("disable");
    $("#" + Break.cssid.slider).slider("disable");
  }
  
  function EnableSliders(){
    $("#" + Work.cssid.slider).slider("enable");
    $("#" + Break.cssid.slider).slider("enable");
  }

  function Reset(param){
    EnableSliders();
    UpdateSidebar(Work.time);
    ResetNotifications();
    
    //Clock
    Clock.setTime(Work.time);
    Clock.resetClock();
    if(typeof param !== "undefined")
      Clock.flags.waitforReset = false;
  }
  
  function ResetNotifications(){
    //Reset Messages
    $(".pomodoro-message").html("");
    $("#pomodoro-label input").val("");
    $(".pomodoro-header").html("");
  }
  
  /* Notification */
  function Notify(err, msg){
    if(err) throw err;
    var pomodoroMessage = msg;
    if(msg == "clock-stops"){
      pomodoroMessage = "The clock is stopped. <span class='reset'>Reset</span> ?";
      $(".pomodoro-message").html("<h2>" + pomodoroMessage + "</h2>");
    }
    else if(msg == "clock-starts"){
      $(".pomodoro-header").html("<h1>" + Work.label + "</h1>");
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
  
  /* Sidebar */
  function ShowSidebar(msg){
    if(msg == "add-pomodoro"){
      $("#sidebar-wrapper .sidebar-brand a").html("Add Pomodoro");
      $("#sidebar-add-pomodoro").css("display","block");
    }
  }
  /***********************
  Exports
  ***********************/
  var exports = {init: main};
  return exports;
})();