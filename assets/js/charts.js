/*
To animate charts when in the view port
goes with charts.scss
*/

$(".bar").inViewport(function(px){
    if(px) $(this).addClass("bar-triggered-animation");
});