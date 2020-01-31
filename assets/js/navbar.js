var maxDeviceXidth = '(max-device-width:578px)'
function deactivateSubNav(){
		document.getElementById("event-sub-nav").style.display = "none";
		document.getElementById("about-sub-nav").style.display = "none";
}
function activateEventSubNav() {
	deactivateSubNav();
	//window.alert(event.target.id);
 	if (window.matchMedia(maxDeviceXidth).matches){
 		document.getElementById("event-sub-nav").style.display = "inherit";
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


document.getElementById("collapsibleNavbar").addEventListener("load", toggleDropDown);
/*document.getElementById("EventMenu").addEventListener("click", activateEventSubNav);
document.getElementById("AnyMenu").addEventListener("click", deactivateSubNav);*/
