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
        
        return exports;
      })();