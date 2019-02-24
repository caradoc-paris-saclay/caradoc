/*var myJSON = '{"name":"John", "age":31, "city":"New York"}';
var myObj = JSON.parse(myJSON);

var str = myObj.name.concat(" ", myObj.age, " ", myObj.city);
//document.getElementById("demo_companies").innerHTML = str;


function readTextFile(file, id)
{	
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}*/

function textLoop(id)
{
	var i;
	var text = "c'est vraiment trop bien tout ça <br>";
	for (i = 0; i < 5; i++) {
  		text += "The number is " + i + "<br>";
	}
	document.getElementById(id).innerHTML = text;
}

function setCompanies(id){
	var url = "/assets/companies/companies.json";
	$.getJSON(url, function(data){
		var items = [];
		$.each( data, function(key, val) {
			items.push( "<li id='" + key + "'>" + val + "</li>");
		});
		$( "<ul/>", {
		    "class": "my-new-list",
		    html: items.join( "" )
	  	}).appendTo( id );
	});
}

//{{ site.baseurl }}{% link /assets/doc/programme_jred.pdf %}
/*$(document).ready(function(){
	textLoop("demo_companies");
	setCompanies("#demo_companies");
	//$.getJSON
	//$("#demo_companies").load("/assets/companies/companies.json", function(){
		//alert( "Load was performed!");
	//});
});*/
// myObj.city;