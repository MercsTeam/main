var _credits = 
{ 
	"Concept"		: [ "Thomas Burke" ],
	"Production"		: [ "Jonathan Brenders" ],
	"Design"		: [ "Thomas Burke", "John Mattys" ],
	"Art"			: [ "Jaeden Laffey", "Kevin Pendergast", "Donna Phelps" ],
	"Additional Character Visualization" : [ "Jonathan Brenders", "Thomas Burke", "Nick Gustafson" ],
	"Sound"			: [ "Aidan Crawley" ],
	"Dialog"		: [ "Jonathan Brenders" ],
	"Voice Cast" : 
	[ 
		{ actor : "Serena Atallah", roles : "Mage,Witch" },
		{ actor : "Cindy Cheng", roles : "Dinogirl,Samurai Girl" },
		{ actor : "Nick Gustafson", roles : "Alien,Big Sword Guy,Caveman,Clown,Djinn,Hive Drone,Nemesis,Pirate" }, 
		{ actor : "Kevin Pendergast", roles : "Cowboy,Cyborg" }, 
		{ actor : "Donna Phelps", roles : "Sniper Girl" }, 
		{ actor : "Ellen Thornton", roles : "Space Girl" }
	],
	"Technical"		: [ "Ryan Amalfitano", "Nick Gustafson" ]
};

function showCredits()
{
	var c = document.getElementById('credits');
	c.innerHTML = "";
	
	var w = document.createElement("SECTION");
	w.className = "wrapper";	
	c.appendChild(w);
	
	if(c.style.visibility == "visible")
	{
		c.style.visibility = "hidden";			
	}
	else
	{
		c.style.visibility = "visible";	
		
		var movie = document.createElement("DIV");
		movie.className = "movie";
		movie.innerHTML = "mercs: triple threat";
		w.appendChild(movie);
		
		var title, person, tbl, tr, td, r;
		for(var d in _credits)
		{
			if(d == "Voice Cast")
			{
				title = document.createElement("DIV");
				title.className = "job";
				title.innerHTML = d;

				person = document.createElement("DIV");
				person.className = "name";

				tbl = document.createElement("TABLE");

				for(var i = 0; i <  _credits[d].length; i++)
				{
					r = _credits[d][i].roles.split(",");

					tr = tbl.insertRow();

					td = tr.insertCell();
					td.innerHTML = _credits[d][i].actor;
					td.rowSpan = r.length;

					for(var j = 0; j < r.length; j++)
					{
						td = tr.insertCell();
						td.innerHTML = r[j];

						if(j < r.length - 1) tr = tbl.insertRow();
					}
				}
				person.appendChild(tbl);
			}
			else
			{
				title = document.createElement("DIV");
				title.className = "job";
				title.innerHTML = d;

				person = document.createElement("DIV");
				person.className = "name";
				person.innerHTML = _credits[d].join("<br />");

				
			}
			w.appendChild(title);
			w.appendChild(person);
		}		
	}
}
