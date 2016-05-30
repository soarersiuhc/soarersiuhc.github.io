(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*************************
 * Clock Module
*************************/
(function(){
        /***********************
        Global variables
        ***********************/
        var ClockHeader = "pika-";
        var ClockTextID = "clock-text";
        var ClockButtonID = "timer-button-text";
        var ClockStrokeID = "clock-countdown-arc"
        var ClockID = "clock";
        
        var running = false;
        var waitforReset = false;
        var State = "Work";
  
        var timer; //setInterval object
        var CountdownTime = 0; //Total time in countdown, in milliseconds
        var ClockTime = 0; //Remaining time in countdown, in milliseconds
      
      	/* svg viewport is 0 0 170 170 */
        var ClockCenter = {XCoor: 85, YCoor: 85};
        var ClockRadius = 80;
        var ClockStrokeWidth = 5;
        var ClockStrokeColor = "#EAEAEA";
        
        /***********************
        Functions
        ***********************/
        function setTime(min, sec){
          var str = ("00" + min).slice(-2);
          str += ":";
          if(typeof sec !== "undefined"){
            str += ("00" + sec).slice(-2);
          }
          else{
            str += "00";
          }
          $("#" + ClockHeader + ClockTextID).text(str);
        }
      
        function draw(){
      	/* svg viewport is 0 0 170 170 */
      	/* Center is an object with properties XCoor and YCoor. */
      	/* stroke_color given in hex with # already*/
      	/* Append to g-element with ClockID in svg */
              
          var newClock = document.createElementNS('http://www.w3.org/2000/svg','circle');
          newClock.setAttributeNS(null,"cx",ClockCenter.XCoor);
          newClock.setAttributeNS(null,"cy",ClockCenter.YCoor);
          newClock.setAttributeNS(null,"r",ClockRadius);
          newClock.setAttributeNS(null,"fill",$("body").css("background-color"));
          newClock.setAttributeNS(null,"stroke-width",ClockStrokeWidth);
          newClock.setAttributeNS(null,"stroke",ClockStrokeColor);
          
          var Node = document.getElementById(ClockHeader+ClockID);
          Node.appendChild(newClock);
        }
        
        function stop(callback){
          // Pressing button = Stop Clock
          // Change button
          $("#" + ClockHeader + ClockButtonID).text("\uF04B");
          // Reset timer
          clearInterval(timer);
          // Update Flags
          UpdateFlags("running", false, this);
          UpdateFlags("waitforReset", true, this);
          
          // Execute call back
          callback(null, "clock-stops");
        }
      
        function start(callback){
          // Pressing button = Start Clock
          // Change button
          $("#" + ClockHeader + ClockButtonID).text("\uF04D");
          // Set ClockRunning Flag
          UpdateFlags("running", true, this);
          // Set CountdownTime
          SetCountdownTime();
          // Countdown Starts
          StartCountdown(callback);
          callback(null, "clock-starts");
        }
        
        function UpdateFlags(name, boolean, pointer){
          if(name == "running"){
            running = boolean;
            pointer.flags.running = boolean;
          }
          else if(name == "waitforReset"){
            waitforReset = boolean;
            pointer.flags.waitforReset = boolean;
          }
        }
        
        function SetCountdownTime(){
          if(State == "Work"){
            CountdownTime = Work.time*60*1000;
          }
          else if(State == "Break"){
            CountdownTime = Break.time*60*1000;
          }
          ClockTime = CountdownTime;
        }
        
        function StartCountdown(callback){
          timer = setInterval(function(){
              UpdateClockTime(callback);
            }, 1000);
        }
        
        function UpdateClockTime(callback){
          //Update every second
          ClockTime -= 1000;
          
          //Update Display Time
          var sec = (ClockTime/1000)%60;
          var min = Math.floor(ClockTime/60000);
          setTime(min,sec);
          
          //Countdown Animation
          CountdownAnimate();
              
          //Check if Timer has ended.
          if(min == 0 && sec == 0){
            //Timer Ended
            clearInterval(timer);
            
            if(State == "Work"){
              //Notify user that break time starts
              callback(null, "break-time-starts")
              //If Work block just ended, Break block starts.
              //Reset Clock Stroke.
              ResetClockStroke();
              
              State = "Break";
              SetCountdownTime();
              StartCountdown();
            }
            else{
              callback(null, "break-ends");
              //Break block just ended, reset everything.
              ResetClock();
            }
          }
          
        }
      
        function CountdownAnimate(){
          //Ring Animation
          var ClockColorNormal = "#00CD00";
          var ClockColor50 = "#CDC600";
          var ClockColor75 = "#CD9000";
          var ClockColor90 = "#CD0000";
          
          var Node = document.getElementById(ClockHeader + ClockStrokeID);
          //Angle Calculation
          var TimeElapsedProp = (CountdownTime - ClockTime)/CountdownTime;
          var offset = 0.01;
          var Angle = 2 * Math.PI * TimeElapsedProp + offset;
          var TargetXCoor = ClockCenter.XCoor + ClockRadius * Math.sin(Angle);
          var TargetYCoor = ClockCenter.YCoor - ClockRadius * Math.cos(Angle);
      
          var LastTimeElapsedProp = TimeElapsedProp - (1000/CountdownTime);
          var LastAngle = 2 * Math.PI * LastTimeElapsedProp - offset;
          var LastXCoor = ClockCenter.XCoor + ClockRadius * Math.sin(LastAngle);
          var LastYCoor = ClockCenter.YCoor - ClockRadius * Math.cos(LastAngle);
              
          //Add Child
          var newPath = document.createElementNS('http://www.w3.org/2000/svg','path');
          newPath.setAttributeNS(null,"d","M" + LastXCoor + " " + LastYCoor + "A" + ClockRadius + " " + ClockRadius + " 0 0,1 " + TargetXCoor + " " + TargetYCoor);
          newPath.setAttributeNS(null,"style", "stroke-width: 5; fill:none");
          //Coloring the ring
          if(TimeElapsedProp < 0.5){
            //Normal color
            newPath.setAttributeNS(null,"stroke", ClockColorNormal);
          }
          else if(TimeElapsedProp < 0.75){
            newPath.setAttributeNS(null,"stroke", ClockColor50);
            
            if(LastTimeElapsedProp < 0.5){
              //Transition to Half way Color
              var pathNodes = Node.getElementsByTagName("path");
              for(var i = 0; i < pathNodes.length; i++){
                pathNodes[i].setAttributeNS(null, "stroke", ClockColor50);
              }
            }
          }
          else if(TimeElapsedProp < 0.9){
            newPath.setAttributeNS(null, "stroke", ClockColor75);
            
            if(LastTimeElapsedProp < 0.75){
              //Transition to Three Quarters Color
              var pathNodes = Node.getElementsByTagName("path");
              for(var i = 0; i < pathNodes.length; i++){
                pathNodes[i].setAttributeNS(null, "stroke", ClockColor75);
              }
            }
          }
          else{
            newPath.setAttributeNS(null, "stroke", ClockColor90);
                
            if(LastTimeElapsedProp < 0.9){
              //Transition to 90% Color
              var pathNodes = Node.getElementsByTagName("path");
              for(var i = 0; i < pathNodes.length; i++){
                pathNodes[i].setAttributeNS(null, "stroke", ClockColor90);
              }
            }
          }
          Node.appendChild(newPath);
        }
        
        function ResetClockStroke(){
          var Node = document.getElementById(ClockHeader + ClockStrokeID);
          while(Node.firstChild){
            Node.removeChild(Node.firstChild);
          }
        }
        
        function ResetClock(){
          UpdateFlags("running", false, this);
          State = "Work";
          ResetClockStroke();
        }
        /***********************
        Exports
        ***********************/
        var exports = {
          setTime: setTime,
          draw: draw,
          stopClock: stop,
          startClock: start,
          flags: {running: running, waitforReset: waitforReset},
          timer: timer,
          resetClock: ResetClock
        }
        
        module.exports = exports;
})();
},{}],2:[function(require,module,exports){
(function(){
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
  module.exports = exports;
})();
},{"./clock.js":1,"./period.js":3}],3:[function(require,module,exports){
/*************************
 * Period Module
*************************/
  (function(){
        var defaultWorkTime = 52; //in minutes
        var defaultWorkID = {slider: "work-time-slider", panel: "work-time"};
        var defaultBreakTime = 8; //in minutes
        var defaultBreakID = {slider: "break-time-slider", panel: "break-time"};
        var defaultLabel = "Untitled";
        
        /* Return */
        var exports = function(name){
          var Obj = {label: defaultLabel};
          if(name == "Work"){
            Obj.time = defaultWorkTime;
            Obj.cssid = defaultWorkID;
          }
          else if(name == "Break"){
            Obj.time = defaultBreakTime;
            Obj.cssid = defaultBreakID;
          }
          Obj.updateTime = function(num){
            Obj.time = num;
          }
          return Obj;
        };
        
        module.exports = exports;
      })();
},{}],4:[function(require,module,exports){
var Pikadoro = require("./main.js");
Pikadoro.init();
},{"./main.js":2}]},{},[4]);
