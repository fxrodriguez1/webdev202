// TRAINS JavaScript File
    
    function showRoutes() {
                document.getElementById("routeDropdown").classList.toggle("show");
            }
    
    $(function(){
        
    
            
            
            // Close the dropdown menu if the user clicks outside of it
            window.onclick = function(event) {
                if (!event.target.matches('.dropbtn')) {
            
                    var dropdowns = document.getElementsByClassName("dropdown-content");
                    var i;
                    for (i = 0; i < dropdowns.length; i++) {
                        var openDropdown = dropdowns[i];
                        if (openDropdown.classList.contains('show')) {
                            openDropdown.classList.remove('show');
                        }
                    }
                }
            };
           
            $("body").on("click", ".routeSelect", function(e) {

                var line = $(this).attr("id");
            
                console.log(line);

                console.log("#" + line + "Stops");
               
                $("#" + line + "Stops").show();
                
                    $("body").on("click", ".trainStop", function(e) {
                
                    var mapID = $(this).attr("id");
                    
                    var stopName = $(this).text();
                    
                    console.log(stopName);
                
                    console.log(mapID);
                   
                    $(".routeSelect").hide();
                    $(".dropdown").hide();    
                    $("#welcome").hide();
                    $("#stopLists").hide();
                
                
                        $(function() { 
                     
                            var apiPassThruUrl = "https://polar-garden-75406.herokuapp.com/apiPassThru.php";
                        
                            var apiEndpoint = "lapi.transitchicago.com/api/1.0/ttarrivals.aspx";
                            
                             $.ajax({
                                 url: apiPassThruUrl,
                                 dataType: "json",
                                 method: 'GET',
                                 data: {
                                     "apiEndpoint": apiEndpoint,
                                     "mapid": mapID,
                                     "rt": line,
                                     "key": "93e9c6eff8cf4a74bf1600b51c193a18",
                                     "outputType": "json"
                                 }
                             }).done (function (data) {
                              console.log(data);
                              $("#pred").prepend("<h1>" + "Arrival times for " + stopName + 
                              "</h1>" + "<br>");
                              $(".nBound").append("<h2>" + "Northbound" + "</h2>");
                              $(".sBound").append("<h2>" + "Southbound" + "</h2>");
                              
                              $.each(data["ctatt"]["eta"], function(i,v) {
                                 
                                    var arrivalTime = v.arrT;
                                    var arrSec = arrivalTime.slice(-2);
                                    var arrMin = arrivalTime.slice(14, 16);
                                    var arrHrs = arrivalTime.slice(11, 13);
                                    var secMS = arrSec*1000;
                                    var minMS = arrMin*60*1000;
                                    var hrsMS = arrHrs*3600*1000;
                                    var ETAMS = secMS + minMS + hrsMS;
                                    var callTime = v.prdt;
                                    var callSec = callTime.slice(-2);
                                    var callMin = callTime.slice(14, 16);
                                    var callHrs = callTime.slice(11, 13);
                                    var callSecMS = callSec*1000;
                                    var callMinMS = callMin*60*1000;
                                    var callHrsMS = callHrs*3600*1000;
                                    var PRDMS = callSecMS + callMinMS + callHrsMS;
                                    var timeTilArrivalMS = ETAMS-PRDMS;
                                    console.log(timeTilArrivalMS);
                                    var timeTilArrivalSec = timeTilArrivalMS/1000;
                                    var timeTilArrivalMin = timeTilArrivalSec/60;
                                    console.log(timeTilArrivalMin);
                                    
                                    if (v.trDr === "1") {
                                            if (v.isApp === "1") {
                                            $(".nBound").append("<div class = 'trainBox'>" + "<h3>" + "Due" + "</h3>" + "<br>" +
                                            "Station: " + v.staNm + ", " + v.stpDe + "<br>" + v.rn + "</div>");
                                            } else {
                                            $(".nBound").append("<div class = 'trainBox'>" + "<h3>"+ "Arrival Time: " + timeTilArrivalMin 
                                            + " Minutes " + "</h3>" + "<br>"  +  "Station: " + v.staNm + ", " + v.stpDe  + 
                                            "<br>" + "Run number: " 
                                            + v.rn + "</div>");
                                            } 
                                    }
                                    if (v.trDr === "5") {
                                            if (v.isApp === "1") {
                                            $(".sBound").append("<div class = 'trainBox'>" + "<h3>" + "Due" + "</h3>" + "<br>" +
                                            "Station: " + v.staNm + ", " + v.stpDe + "<br>" + "Run number: " 
                                            + v.rn + "<br>" + "</div>");
                                            } else {
                                            $(".sBound").append("<div class = 'trainBox'>" + "<h3>"+ "Arrival Time: " + timeTilArrivalMin 
                                            + " Minutes " + "</h3>" + "<br>"  + "Station: " + v.staNm + ", " + v.stpDe +
                                            "<br>" + "Run number: " 
                                            + v.rn + "</div>");
                                            } 
                                    }
                                    
                            });
                    
                        });
                    });
                });
            });  
            
    })