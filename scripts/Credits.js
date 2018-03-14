var _credits = 
{ 
	"Concept"		: [ "Thomas Burke" ],
	"Production"		: [ "Jonathan Brenders" ],
	"Design"		: [ "Thomas Burke", "John Mattys" ],
	"Art"			: [ "Jaeden Laffey", "Kevin Pendergast", "Donna Phelps" ],
	"Additional Character Visualization" : [ "Jonathan Brenders", "Thomas Burke", "Nick Gustafson" ],
	"Sound"			: [ "Aidan Crawley" ],
	"Dialog"		: [ "Jonathan Brenders" ],
	"Character Vocalization" : [ "Nick Gustafson", "Kevin Pendergast", "Donna Phelps" ],
	"Technical"		: [ "Ryan Amalfitano", "Nick Gustafson" ]
};

function showCredits()
{
	var c = document.getElementById('credits');
	if(c.style.visibility == "visible")
	{
		c.style.visibility = "hidden";
		c.innerHTML = "";						
	}
	else
	{
		c.style.visibility = "visible";
		
		var w = document.querySelector(".wrapper");
		var title, person;

		for(var d in _credits)
		{
		    title = document.createElement("DIV");
		    title.className = "job";
		    title.innerHTML = d;

		    person = document.createElement("DIV");
		    person.className = "name";
		    person.innerHTML = _credits[d].join("<br />");

		    w.appendChild(title);
		    w.appendChild(person);
		}		
	}
}
