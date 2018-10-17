//Start puzzle
function startPuzzle1()
{
	document.querySelector("#start1").hidden = true;
	document.querySelector("#counter").hidden = false;
	document.querySelector("#clock").hidden = false;

	moves = 0;
	window.moves = 0;
	
	// Reorder squares to pre-dermined positions (must be the same for each image to make it fair for all players)
	var arr = [14,2,10,6,12,13,9,7,15,8,5,11,4,1,3,16];
	//var strClass = "";
	var p;

	for(i=0; i<arr.length; i++)
	{		
		//$("#image").append('<div id="pos' + (i +1) + '" class="sq' + arr[i] + strClass +'"></div>');

		p = document.createElement("DIV");
		p.id = "pos" + (i + 1);
		p.className = "sq" + arr[i] + (i == arr.length - 1 ? " pointer" : "");
		document.querySelector("#image").appendChild(p);
	}
	//$("#counter span").html("0");
	//$("#clock span").html("00:00");

	document.querySelector("#counter span").innerHTML = "0";
	document.querySelector("#clock span").innerHTML = "00:00";
	
	var index;
	window.index = 0;
	var obj
	window.obj = new Timer();
	window.obj.Interval = 1000
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
				//alert(pointer);

				if(validMove(pointer, moveTo))
				{
					//swap classes
					var a = this;
					var b = document.querySelector(".pointer");
	
					var aClass = a.className;
					var bClass = b.className;

					//alert("aClass: " + aClass + "\nbClass: " + bClass);
	
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

	/*$("#image div").on("click",function(){
		if(!$(this).hasClass("pointer"))
		{
			var $moveTo = $(this).attr("id").replace("pos","");
			var $pointer = $(".pointer").attr("id").replace("pos","");
			
			if(validMove($pointer,$moveTo))
			{
				// Swap classes
				var a = $(this);
				var b = $(".pointer");
				var aClass = a.attr("class");
				var bClass = b.attr("class");
				a.removeClass(aClass).addClass(bClass);
				b.removeClass(bClass).addClass(aClass);
				
				window.moves++;
				$("#counter span").html(window.moves);
				
				// Check if the puzzle is complete
				if(parseInt($moveTo) == 16)
					isGameOver();
			}
		}
	});*/	
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
	//alert(id + "," + arr.join(","));

	//if($.inArray(parseInt(move),arr) > -1)
	if(arr.indexOf(parseInt(move)) != -1)	return true;
}

// Work out if game is over
function isGameOver()
{
	for(i=1; i<=16; i++)
	{
		if(!$("#image #pos" + i).hasClass("sq" + i))
		{
			break;
		} 
		else 
		{
			if(i == 16)
			{
				//$("#pos16").removeClass("pointer");
				document.querySelector("#pos16").classList.remove("pointer");
				
				//$("#image div").off("click");
				var p = document.querySelectorAll("#image div");
				for(var i = 0; i < p.length; p++) p[i].onclick = null;

				window.obj.Stop();
			}				
		}
	}
}

// Declaring class "Timer"
var Timer = function()
{        
    // Property: Frequency of elapse event of the timer in millisecond
    this.Interval = 1000;
    
    // Property: Whether the timer is enable or not
    this.Enable = new Boolean(false);
    
    // Event: Timer tick
    this.Tick;
    
    // Member variable: Hold interval id of the timer
    var timerId = 0;
    
    // Member variable: Hold instance of this class
    var thisObject;
    
    // Function: Start the timer
    this.Start = function()
    {
        this.Enable = new Boolean(true);

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
	//$("#clock span").html(secondsTimeSpanToHMS(window.index));
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