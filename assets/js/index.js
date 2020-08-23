
/* #############################################################################
Arrows scrolling
############################################################################# */
/* scrolls from #arrow-caradoc to #index-caradoc-top and leave some space for navbar
 */
$(document).ready(function (){
    $("#arrow-caradoc").click(function (){
        $('html, body').animate({
            scrollTop: $("#index-caradoc-top").offset().top - $(".navbar").outerHeight()
        }, 500);
    });
});
/* scr*/
$(document).ready(function (){
    $("#arrow-paris-saclay").click(function (){
        $('html, body').animate({
            scrollTop: $("#index-paris-saclay-top ").offset().top - $(".navbar").outerHeight()
        }, 500);
    });
});

$(document).ready(function (){
    $("#arrow-registration").click(function (){
        $('html, body').animate({
            scrollTop: $("#index-registration-top").offset().top - $(".navbar").outerHeight()
        }, 500);
    });
});
