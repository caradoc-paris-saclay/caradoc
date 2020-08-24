$('img').each(function(){
	if ($(this).data('delayedsrc')) {
		$(this).attr('src', $(this).data('delayedsrc'));
	}
});

$(document).ready(function(){

	$('.header').height($(window).height());

	$("#portfolio-contant-active").mixItUp();

	$("#testimonial-slider").carousel({
	    paginationSpeed : 500,      
	    singleItem:true,
	    autoPlay: 3000,
	});

	$("#clients-logo").carousel({
		autoPlay: 3000,
		items : 5,
		itemsDesktop : [1199,5],
		itemsDesktopSmall : [979,5],
	});

	$("#works-logo").carousel({
		autoPlay: 3000,
		items : 5,
		itemsDesktop : [1199,5],
		itemsDesktopSmall : [979,5],
	});
	// google map
	/*	var map;
		function initMap() {
		  map = new google.maps.Map(document.getElementById('map'), {
		    center: {lat: -34.397, lng: 150.644},
		    zoom: 8
		  });
		}*/

	// Counter

	/*$('.counter').counterUp({
        delay: 10,
        time: 1000
    });*/

});




