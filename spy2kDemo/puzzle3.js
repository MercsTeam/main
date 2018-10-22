//http://www.developphp.com/video/JavaScript/Memory-Game-Programming-Tutorial

var memory_array = ['A','A','B','B','C','C','D','D','E','E','F','F','G','G','H','H','I','I','J','J','K','K','L','L'];
var memory_values = [];
var tiles_flipped = 0;

function startPuzzle3()
{
	document.querySelector("#start1").hidden = true;

	tiles_flipped = 0;
	var b = document.getElementById('memory_board');
	var d;
    
	memory_array.sort(function(a, b){ return 0.5 - Math.random() });
	
	for(var i = 0; i < memory_array.length; i++)
	{
		d = document.createElement("div");
		d.id = "tile_" + i;
		d.onclick = Function("memoryFlipTile(this,\"" + memory_array[i] + "\")");
		b.appendChild(d);
	}
}

function memoryFlipTile(tile, val)
{
	if(tile.innerHTML == "" && memory_values.length < 2)
	{
		tile.classList.add("flipped");
		tile.innerHTML = val;
		
		if(memory_values.length == 0)
		{
			memory_values.push({ "id" : tile.id, "value" : val });
		} 
		else if(memory_values.length == 1)
		{
			memory_values.push({ "id" : tile.id, "value" : val });
			
			if(memory_values[0].value == memory_values[1].value)
			{
				tiles_flipped += 2;
				
				// Clear array
				while(memory_values.length > 0) memory_values.pop();
				
				// Check to see if the whole board is cleared
				if(tiles_flipped == memory_array.length)
				{
					alert("Board cleared... generating new board");
				}
			} 
			else 
			{
				function flip2Back()
				{
				    // Flip the 2 tiles back over
					var t;

					for(var i = 0; i < memory_values.length; i++)
					{
						t = document.getElementById(memory_values[i].id);
						t.classList.remove("flipped");
            			t.innerHTML = "";
				    }

				    // Clear both arrays
					while(memory_values.length > 0) memory_values.pop();
				}
				setTimeout(flip2Back, 700);
			}
		}
	}
}