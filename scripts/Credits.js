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
	var w = c.querySelector(".wrapper");
	
	if(c.style.visibility == "visible")
	{
		c.style.visibility = "hidden";
		w.innerHTML = "";						
	}
	else
	{
		c.style.visibility = "visible";	
		
		var movie = document.createElement("DIV");
		movie.className = "movie";
		movie.innerHTML = "mercs: triple threat";
		w.appendChild(movie);
		
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
