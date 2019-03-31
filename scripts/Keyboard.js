var KeyState = { Up : 1, Down : 0 };

var Keyboard =
{
	previousKeyPressed : null,
	keys : {},					
	setkeydown : function(e)
	{	
		if (event.preventDefaulted)  return; // Do nothing if event already handled
		
		//console.log(e.code + " Down");
		Keyboard.keys[e.code] = { state : KeyState.Down };
	},		
	setkeyup : function(e)
	{
		//console.log(e.code + " Up");
		Keyboard.keys[e.code] = { state : KeyState.Up };
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
		document.addEventListener("keydown", Keyboard.setkeydown);
		document.addEventListener("keyup", Keyboard.setkeyup);
	}
};