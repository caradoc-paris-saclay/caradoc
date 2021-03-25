/*
This script is for hidding navigation link that points to no new posts
A post has a title that is display in the span element of a div element
that has a class that is called .button
By default, span contains the string "()". In the parentheses should 
appear the post title. If no title, then we set the visibility of the div element
to hidden. hidden visibility keeps the space occupied by the div element.
*/
$('.button').each(function(){
	var span = $(this).find("span"); // only one span element
	const len_str = span.text().trim().length;
	if(len_str<3){
		$(this).css("visibility", "hidden");
	}
});