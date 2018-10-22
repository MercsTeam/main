//Start puzzle
function startPuzzle1()
{
	document.querySelector("#start1").hidden = true;
	document.querySelector("#counter").hidden = false;
	document.querySelector("#clock").hidden = false;

	moves = 0;
	window.moves = 0;
	
	// Reorder squares to pre-dermined positions (must be the same for each image to make it fair for all players)
	var arr = [14, 2, 10, 6, 12, 13, 9, 7, 15, 8, 5, 11, 4, 1, 3, 16];
	//var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 11, 13, 14, 12, 16];
	var p;

	for(i=0; i<arr.length; i++)
	{		
		p = document.createElement("DIV");
		p.id = "pos" + (i + 1);
		p.className = "sq" + arr[i] + (i == arr.length - 1 ? " pointer" : "");
		document.querySelector("#image").appendChild(p);
	}
	document.querySelector("#counter span").innerHTML = "0";
	document.querySelector("#clock span").innerHTML = "00:00";
	
	var index;
	window.index = 0;
	var obj;
	window.obj = new Timer();
	window.obj.Interval = 1000;
	window.obj.Tick = timer_tick;
	window.obj.Start();	
	
	movePiece();
}

// Move square
function movePiece()
{
	var p = document.querySelectorAll("#image div");
	for(var i = 0; i < p.length; i++)
	{
		p[i].onclick = function()
		{
			if(!this.classList.contains("pointer"))
			{
				var moveTo = this.id.toString().replace("pos", "");
				var pointer = document.querySelector(".pointer").id.toString().replace("pos", "");

				if(validMove(pointer, moveTo))
				{
					//swap classes
					var a = this;
					var b = document.querySelector(".pointer");
	
					var aClass = a.className;
					var bClass = b.className;
	
					a.className = bClass;
					b.className = aClass;
	
					window.moves++;
					document.querySelector("#counter span").innerHTML = window.moves;
	
					// Check if the puzzle is complete
					if(parseInt(moveTo) == 16) isGameOver();
				}
			}
		};
	}
}

// Validate user's move
function validMove(id, move)
{
	var arr = [];
	//alert(parseInt(id));
	switch(parseInt(id))
	{
		case 1:
			arr = [2,5];
			break;
		case 2:
			arr = [1,3,6];
			break;
		case 3:
			arr = [2,4,7];
			break;
		case 4:
			arr = [3,8];
			break;
		case 5:
			arr = [1,6,9];
			break;
		case 6:
			arr = [2,5,7,10];
			break;
		case 7:
			arr = [3,6,8,11];
			break;
		case 8:
			arr = [4,7,12];
			break;
		case 9:
			arr = [5,10,13];
			break;
		case 10:
			arr = [6,9,11,14];
			break;
		case 11:
			arr = [7,10,12,15];
			break;
		case 12:
			arr = [8,11,16];
			break;
		case 13:
			arr = [9,14];
			break;
		case 14:
			arr = [10,13,15];
			break;
		case 15:
			arr = [11,14,16];
			break;
		case 16:
			arr = [12,15];
			break;
	}
	if(arr.indexOf(parseInt(move)) != -1)	return true;
}

// Work out if game is over
function isGameOver()
{
	for(i = 1; i <= 16; i++)
	{
		if(!document.querySelector("#image #pos" + i).classList.contains("sq" + i))
		{
			break;
		} 
		else if(i == 16)
		{
			document.querySelector("#pos16").classList.remove("pointer");
			
			var p = document.querySelectorAll("#image div");
			for(var j = 0; j < p.length; j++) p[j].onclick = null;

			window.obj.Stop();
			alert("You finished the game!");
		}
	}
}

// Declaring class "Timer"
var Timer = function()
{        
    // Property: Frequency of elapse event of the timer in millisecond
    this.Interval = 1000;
    
    // Property: Whether the timer is enable or not
    this.Enable = false;
    
    // Event: Timer tick
    this.Tick;
    
    // Member variable: Hold interval id of the timer
    var timerId = 0;
    
    // Member variable: Hold instance of this class
    var thisObject;
    
    // Function: Start the timer
    this.Start = function()
    {
        this.Enable = true;

        thisObject = this;
        if (thisObject.Enable)
        {
            thisObject.timerId = setInterval(
            function()
            {
                thisObject.Tick(); 
            }, thisObject.Interval);
        }
    };
    
    // Function: Stops the timer
    this.Stop = function()
    {            
        thisObject.Enable = false;
        clearInterval(thisObject.timerId);
    };

};

// Timer
function timer_tick()
{
	window.index = window.index + 1;
	document.querySelector("#clock span").innerHTML = (secondsTimeSpanToHMS(window.index));
}

// Format time
function secondsTimeSpanToHMS(s)
{
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60);   //Get remaining minutes
    s -= m*60;
	return (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}