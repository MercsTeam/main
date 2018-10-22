//https://marcofolio.net/lights-off-html-puzzle/

// Two dimensional array that represents the playing field
// A "x" stands for "on"
// A "o" stands for "off"
var lightField =
[
	[ "x", "o", "o", "x", "x" ],
	[ "o", "o", "x", "o", "x" ],
	[ "o", "x", "o", "x", "o" ],
	[ "x", "o", "x", "o", "o" ],
	[ "x", "x", "o", "o", "x" ]
];

var lp;
function lightpanel_click(e) 
{      
	// e will give us absolute x, y so we need to calculate relative to canvas position
	var ox = e.pageX - lp.offsetLeft; //pos.left;
	var oy = e.pageY - lp.offsetTop; //pos.top;
	  
	// Check which fields we need to flip
	// 100 = width of the tile
	var yField = Math.floor(oy / 100);
	var xField = Math.floor(ox / 100);
	  
	// The field itself
	lightField[yField][xField] = lightField[yField][xField] == "x" ? "o" : "x";
	  
	// The field above
	if(yField-1 >= 0) lightField[yField-1][xField] = lightField[yField-1][xField] == "x" ? "o" : "x";
	  
	// The field underneath
	if(yField+1 < 5) lightField[yField+1][xField] = lightField[yField+1][xField] == "x" ? "o" : "x";
	  
	// The field to the left
	if(xField-1 >= 0) lightField[yField][xField-1] = lightField[yField][xField-1] == "x" ? "o" : "x";   
	  
	// The field to the right
	if(xField+1 < 5) lightField[yField][xField+1] = lightField[yField][xField+1] == "x" ? "o" : "x";   
	  
	repaintPanel();
};


function repaintPanel() 
{      
	// Retrieve the canvas
	var canvas = document.querySelector("#lightpanel");

	// Check if the browser supports <canvas>
	if (!canvas.getContext)
	{
		alert("This demo requires a browser that supports the <canvas> element.");
		return;
	} 
	else 
	{
		clear();

		// Get the context to draw on
		var ctx = canvas.getContext("2d");

		// Create the fields
		var allLightsAreOff = true;

		// Rows
		for(var i = 0; i < lightField.length; i++) 
		{ 
			// Columns
			for (var j = 0; j < lightField[i].length; j++) 
			{                
				// Set up the brush
				ctx.lineWidth = 3;
				ctx.strokeStyle = "#83BD08";

				// Start drawing
				ctx.beginPath();

				// arc( x, y, radius, startAngle, endAngle, anticlockwise)
				ctx.arc(j * 100 + 50, i * 100 + 50, 40, 0, Math.PI*2, true);

				// Actual draw of the border
				ctx.stroke();

				// Check if we need to fill the border
				if(lightField[i][j] == "x") 
				{
					ctx.fillStyle = "#FFBD38";
					ctx.beginPath();
					ctx.arc(j * 100 + 50, i * 100 + 50, 38, 0, Math.PI*2, true);
					ctx.fill();

					// Since we need to fill this field, not all the lights are off
					allLightsAreOff = false;
				}   
			}
		}

		// Check if all the lights are off
		if(allLightsAreOff) 
		{
			// User can't click anymore
			userCanClick = false;

			// Show message
			alert("All lights are off, you finished the game!");
		}
	}
}

function clear() 
{
	var canvas = document.querySelector("#lightpanel");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, 500, 500);
}

function startPuzzle2()
{
	document.querySelector("#start2").hidden = true;

	// Paint the panel
	
	repaintPanel();
	


	// Attach a mouse click event listener
	lp = document.querySelector("#lightpanel");
	lp.onclick = lightpanel_click;
}