/*************************
 * Clock Module
*************************/
(function(){
        /***********************
         * Require
        ***********************/
        var Notify = require("./notify.js");
        /***********************
        Global variables
        ***********************/
        var ClockHeader = "pika-";
        var ClockTextID = "clock-text";
        var ClockButtonID = "timer-button-text";
        var ClockStrokeID = "clock-countdown-arc";
        var ClockID = "clock";
        
        var running = false;
        var waitforReset = false;
        var State = "Work";
  
        var timer; //setInterval object
        var CountdownTime = 0; //Total time in countdown, in milliseconds
        var ClockTime = 0; //Remaining time in countdown, in milliseconds
        var defaultWorkTime;
        var defaultBreakTime;
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
      
        function setDefault(WorkTime, BreakTime){
          defaultWorkTime = WorkTime;
          if(typeof BreakTime !== "undefined") defaultBreakTime = BreakTime;
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
          
          Notify.reset();
        }
        /***********************
         * Event Handler
        ***********************/
        function ClockClick(callback){
          $("#" + ClockHeader + ClockButtonID).click(function(){
            var flags = {running: running, waitforReset: waitforReset};
            if(running){
              //Click happens when clock is running
              callback(flags);
              stopClock(Notify.func);
            }
            else if(!waitforReset){
              //Click happens when clock is not running, and not waiting for reset
              callback(flags);
              start(Notify.func);
            }
          });
        }
        
        /***********************
        Exports
        ***********************/
        var exports = {
          setTime: setTime,
          setDefault: setDefault,
          draw: draw,
          stopClock: stop,
          startClock: start,
          flags: {running: running, waitforReset: waitforReset},
          timer: timer,
          resetClock: ResetClock,
          clockClick: ClockClick
        }
        
        module.exports = exports;
})();