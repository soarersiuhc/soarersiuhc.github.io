(function(){
  /***********************
  Global variables
  ***********************/
  var EventsArray = [SliderChange, ClockClick, UserReset, SidebarAddPomodoro];

  /***********************
  Modules
  ***********************/
  /* Clock module */
  var Clock = require("./clock.js");
  var Period = require("./period.js");
  var Notify = require("./notify.js");
  
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
    Clock.setTime(Work.time);
    Clock.setDefault(Work.time, Break.time);
    Clock.draw();
  }
  
  /* Event Listeners */
  function SliderChange(){
    $("#" + Work.cssid.slider).slider().on("change", function(slideEvent){
      Work.updateTime(slideEvent.value.newValue);
      $("#" + Work.cssid.panel).html(slideEvent.value.newValue);
      Clock.setTime(slideEvent.value.newValue);
      Clock.setDefault(slideEvent.value.newValue);
    });
    $("#" + Break.cssid.slider).slider().on("change", function(slideEvent){
      Break.updateTime(slideEvent.value.newValue);
      $("#" + Break.cssid.panel).html(slideEvent.value.newValue);
      Clock.setDefault(Work.time, slideEvent.value.newValue);
    });
  }
  
  function ClockClick(){
    Clock.clockClick(Callback_ClockClick);
  }

  function Callback_ClockClick(flags){
    if(!flags.running && !flags.waitforReset){
        //Click happens when clock is not running and not waiting for reset
        //Action: Start clock
        DisableSliders();
        Work.label = $("#pomodoro-label input").val();
        Notify.setLabel(Work.label);
    }
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
    
    //Clock
    Clock.setTime(Work.time);
    Clock.resetClock();
    if(typeof param !== "undefined")
      Clock.flags.waitforReset = false;
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
  module.exports = exports;
})();