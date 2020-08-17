/* scrolls from #arrow-registration to #index-registration-top and leave some space for navbar and
content of #index-registration-top
 */
$(document).ready(function (){
    $("#arrow-registration").click(function (){
        $('html, body').animate({
            scrollTop: $("#index-registration-top").offset().top - $(".navbar").outerHeight()
        }, 500);
    });
});
