document.onkeydown = function(e)
{
	var keycode = (window.event ? window.event.keyCode : e.which);
	if(keycode == 67) 
	{
		c = document.getElementById('credits');
		if(c.style.visibility == "visible")
		{
			c.style.visibility = "hidden";
			c.innerHTML = "";						
		}
		else
		{
			var _credits = 
			{ 
				"Concept"		: [ "Thomas Burke" ],
				"Production"	: [ "Jonathan Brenders" ],
				"Design"		: [ "Thomas Burke", "John Mattys" ],
				"Art"			: [ "Jaeden Laffey", "Kevin Pendergast", "Donna Phelps" ],
				"Additional Character Visualization" : [ "Nick Gustafson" ],
				"Sound"			: [ "Aidan Crawley" ],
				"Technical"		: [ "Ryan Amalfitano", "Nick Gustafson" ]
			};	
			
			h1 = document.createElement("H1");
			h1.innerHTML = "CREDITS";

			dl = document.createElement("DL");
			for(var d in _credits)
			{
				dt = document.createElement("DT");
				dt.innerHTML = d;
				dl.appendChild(dt);

				for(var i = 0; i < _credits[d].length; i++)
				{
					dd = document.createElement("DD");
					dd.innerHTML = _credits[d][i];
					dl.appendChild(dd);
				}
			}

			var m = document.createElement("MARQUEE");
			m.setAttribute("behavior", "slide");
			m.setAttribute("direction", "up");
			m.setAttribute("scrollAmount", "7");
			m.appendChild(h1);
			m.appendChild(dl);
			c.appendChild(m);	
			
			c.style.visibility = "visible";
		}
	}
};