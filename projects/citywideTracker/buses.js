// BUSES JavaScript File
    
            /* When the user clicks on the button, 
            toggle between hiding and showing the dropdown content */
            function showRoutes() {
                document.getElementById("routeDropdown").classList.toggle("show");
            }
            
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
         
         $(function() { 
             
            var apiPassThruUrl = "https://polar-garden-75406.herokuapp.com/apiPassThru.php";
        
            var apiEndpoint = "http://ctabustracker.com/bustime/api/v2/getroutes";
            
             $.ajax({
                 url: apiPassThruUrl,
                 dataType: "json",
                 method: 'GET',
                 data: {
                     "apiEndpoint": apiEndpoint,
                     "key": "xiP5GrU6kqvnMUgxPeMwATG2v",
                     "format": "json"
                 }
             }).done (function (data) {
              console.log(data);
              $.each(data["bustime-response"]["routes"], function(i,v) {
                  $(".dropdown-content").append(
                      "<a href = '#' id =" + v.rt + " class = routeSelect busDropdown" + ">" + v.rt + " - " + v.rtnm + "</a>"
                    );
              });

            });
         
         $("body").on("click", ".routeSelect", function(e) {
             
             var route = $(this).attr("id");
             
             console.log(route);
            
            $(function() {
            var apiPassThruUrl = "https://polar-garden-75406.herokuapp.com/apiPassThru.php";
        
            var apiEndpoint = "http://ctabustracker.com/bustime/api/v2/getdirections";
            
             $.ajax({
                 url: apiPassThruUrl,
                 dataType: "json",
                 method: 'GET',
                 data: {
                     "apiEndpoint": apiEndpoint,
                     "key": "xiP5GrU6kqvnMUgxPeMwATG2v",
                     "rt": route,
                     "format": "json"
                 }
             }).done (function (data) {
              console.log(data);
              $("#directions").append(
                 "<h1 class = 'directionSelect'>" + "Select a direction below" + "</h1>" + "<br>"  
              );
              $.each(data["bustime-response"]["directions"], function(i,v) {
                  $("#directions").append(
                      "<a href = '#' id =" + v.dir + " class = directionSelect" + ">" + v.dir + "</a>" + "<br>"
                    );
              });
              $("body").on("click", ".directionSelect", function(e) {
             
             var direction = $(this).attr("id");
             
             console.log(direction);  
             
             $(".directionSelect").hide();
             
              
            $(function() {
            var apiPassThruUrl = "https://polar-garden-75406.herokuapp.com/apiPassThru.php";
        
            var apiEndpoint = "http://ctabustracker.com/bustime/api/v2/getstops";
            
             $.ajax({
                 url: apiPassThruUrl,
                 dataType: "json",
                 method: 'GET',
                 data: {
                     "apiEndpoint": apiEndpoint,
                     "key": "xiP5GrU6kqvnMUgxPeMwATG2v",
                     "rt": route,
                     "dir": direction, 
                     "format": "json"
                 }
             }).done (function (data) {
              console.log(data);
              $.each(data["bustime-response"]["stops"], function(i,v) {
                  $("#stops").append(
                      "<a href = '#' id =" + v.stpid + " class = stopSelect" + ">" + v.stpnm + "</a>" + "<br>" 
                    );
              });
            
            });     
         });  
              });
            });
            
         });
         
        
        $("body").on("click", ".stopSelect", function(e) {
             
             var stop = $(this).attr("id");
             
             console.log(stop);
             
             $(".stopSelect").hide();
             $(".dropdown").hide();
             $("#welcome").hide();
             
             $(function() {
          
          
          var apiPassThruUrl = "https://polar-garden-75406.herokuapp.com/apiPassThru.php";
          
          var apiEndpoint = "http://ctabustracker.com/bustime/api/v2/getpredictions";
          
          
          $.ajax({
              url: apiPassThruUrl,
              dataType: "json",
              method: 'GET',
              data: {"apiEndpoint": apiEndpoint,
                      "key" : "xiP5GrU6kqvnMUgxPeMwATG2v",
                      "rt" : route,
                      "stpid" :stop,
                      "format":"json"}
            }).done (function (data) {
              console.log(data);
              $("#pred").append("<h1 id = 'predictionHeader'>" + 
              "Bus Time Predictions" + "</h1>" + "<p>" + "<br>"
              + "Refresh to see another route" + "</p>");
              $.each(data["bustime-response"]["prd"], function(i,v) {
                  $("#pred").append("<div class = 'box'>" + 
                  "<h2 id = 'stopHead'>Stop: " 
                  + v.stpnm + "</h2>" + "<div id = 'contents>'" + "<br>" + 
                  "<p class = 'nobr'> Direction: "
                  + v.rtdir + "</p>" +
                  "<p> Destination: " + v.des + "</p>" 
                  + "<p class = 'bold' id = estimate>"+ "Time until Arrival: "
                  + v.prdctdn + " minutes" + "</p>" + "</div>"
                   ) 
                + "</div>";
              });
              $.each(data["bustime-response"]["error"], function(i,v) {
                $("#pred").append("<h1 id = 'error'>" + v.msg + "</h1>");  
              });

            });
        });
             });     
        }); 
        });