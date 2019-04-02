var KeyState = { Up : 1, Down : 0 };

var MSKeyMap =
{
	"2" : "Digit2",
	"a" : "KeyA",
	"d" : "KeyD",
	"k" : "KeyK",
	"m" : "KeyM",
	"n" : "KeyN",
	"p" : "KeyP",
	"r" : "KeyR",
	"s" : "KeyS",
	"u" : "KeyU",
	"w" : "KeyW",
	" " : "Space",
	"ArrowLeft" : "ArrowLeft",
	"ArrowUp" : "ArrowUp",
	"ArrowRight" : "ArrowRight",
	"ArrowDown" : "ArrowDown"	
};

var Keyboard =
{
	previousKeyPressed : null,
	keys : {},	
	mapToCode : function(e)
	{
		if(typeof e.code != "undefined") return e.code;
		
		if(e.location == 0)
		{
			return MSKeyMap[e.key];
		}
		else
		{
			return e.key + (e.location == 1 ? "Left" : "Right");
		}
	},
	setkeydown : function(e)
	{	
		if (e.preventDefaulted)  return; // Do nothing if event already handled
		
		//convert non-complient MS key to code
		var code = Keyboard.mapToCode(e);		
		Keyboard.keys[code] = { state : KeyState.Down };
	},		
	setkeyup : function(e)
	{
		var code = Keyboard.mapToCode(e);
		Keyboard.keys[code] = { state : KeyState.Up };
	},
	isKeyDown : function(key)
	{
		if(!Keyboard.keys[key]) return false;

		if(Keyboard.keys[key].state == KeyState.Down)
		{
			Keyboard.keys[key].state = KeyState.Up;
			return true;
		}
		else
		{
			return false;
		}
	},
	isKeyUp : function(key)
	{
		if(!Keyboard.keys[key]) return true;

		return (Keyboard.keys[key].state == KeyState.Up);
	},
	init : function()
	{
		document.addEventListener("keydown", Keyboard.setkeydown, false);
		document.addEventListener("keyup", Keyboard.setkeyup, false);
	}
};