var maxDeviceXidth = '(max-device-width:578px)';
var minWidth = 768; // in px
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
window.onresize = function(){
	width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}
// this functions opens the left panel to disply the menu
function showSideNav(){
	document.getElementById("mySidenav").style.display = "inherit";
	console.log("Showing SideNav");
	openNav();
}
function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
function deactivateSubNav(){
		document.getElementById("event-sub-nav").style.display = "none";
		document.getElementById("about-sub-nav").style.display = "none";
}
function activateEventSubNav() {
	deactivateSubNav();
	//window.alert(event.target.id);
 	if (minWidth > width){
 		document.getElementById("event-sub-nav").style.display = "inherit";
	}
}
function smallScreen() {
	//window.alert(event.target.id);
	console.log("small Screen");
 	if (minWidth > width){
 		console.log("Small Screen detected!");
	}
}
function activateAboutSubNav() {
	deactivateSubNav();
	//window.alert(event.target.id);
	console.log("Before condition");
  if (window.matchMedia(maxDeviceXidth).matches){
  	console.log("passed condition");
  	document.getElementById("about-sub-nav").style.display = "inherit";
  }
}
function toggleDropDown() {
	//window.alert(event.target.id);
	console.log("Before condition");
  if (window.matchMedia(maxDeviceXidth).matches){
  	console.log("passed condition");
  	eventMenu = document.getElementById("Eventli");
  	eventMenu.classList.add("dropdown");
  }
  	//document.getElementById("AboutMenu").class = "inherit";
 }

 $('#collapsibleNavbar').on('shown.bs.collapse', function () {
   console.log("Opened")
   //$('#collapsibleNavbar').css("backgroundColor", "#ffde59");
   //$('#collapsibleNavbar').style.
   /*$("#EventMenu").click(
   	function(){
   			alert("Clicked on Event");
   			console.log("Clicked on event");
   	}
   );*/
});
 $('#collapsibleNavbar').on('hidden.bs.collapse', function () {
   console.log("Closed")
});
