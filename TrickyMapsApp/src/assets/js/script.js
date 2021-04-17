//this function and the one below it go hand in hand (this one calls showPosition function)
function getLocation() {
    var x = document.getElementById("coordinates");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

//stored in h2 element in setup.html
function showPosition(position) {
    var x = document.getElementById("coordinates");
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}

function getAddress(){

}

var myIndex = 0;

function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  myIndex++;
  if (myIndex > x.length) {myIndex = 1}    
  x[myIndex-1].style.display = "block";  
  setTimeout(carousel, 10000); // Change image every 10 seconds on setup.html page
}

function outputUpdate(vol) {
  document.querySelector('#volume').value = vol; //print out number for FPS in setup page
}
