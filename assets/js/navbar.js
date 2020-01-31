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
/*document.getElementById("EventMenu").addEventListener("click", activateEventSubNav);
document.getElementById("AboutMenu").addEventListener("click", activateAboutSubNav);
document.getElementById("AnyMenu").addEventListener("click", deactivateSubNav);*/
