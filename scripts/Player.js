function Player(a, cnt)
{
	this.score = 0;
	this.active = a;

	this.controls = { Left : "", Up : "", Right : "", Down : "", Fire1 : "", Jump : "" };
	this.position = { X : 0, Y : 0 };

	this.getAxis = function(axis)
	{
		if(axis == "Horizontal")
		{
			return (Keyboard.isKeyDown(this.controls.Left) ? -1 : (Keyboard.isKeyDown(this.controls.Right) ? 1 : 0));
		}
		else
		{
			return (Keyboard.isKeyDown(this.controls.Up) ? -1 : (Keyboard.isKeyDown(this.controls.Down) ? 1 : 0));
		}
	};

	this.selectedCount = 0;
	
	this.characters = null;	
	this.characterCoords = null;
	this.selectionReady = false;

	this.characterPos = 1;
	this.activeSkill = null;
	this.battleReady = false;

	this.activeCharacterCount = cnt;

	this.isActive = function() { return this.active; };

	this.addCharacter = function(c)
	{
		if(!this.characters) this.characters = [];

		var add = new c();
		add.player = this;
		this.characters.push(add);
	};

	this.removeCharacter = function(c)
	{
		for(var i = 0; i < this.characters.length; i++)
		{
			if(this.characters[i] instanceof c) 
			{
				this.characters.splice(i, 1);
				break;
			}
		}
	};

	this.hasCharacter = function(c)
	{
		if(!this.characters) return false;

		for(var i = 0; i < this.characters.length; i++)
		{
			if(this.characters[i] instanceof c) 
			{
				return true;
			}
		}
		return false;
	}

	this.getOpponent = function()
	{
		return (this == Game.player1 ? Game.player2 : Game.player1);
	}

	this.commit = function()
	{		
		for(var i = 0; i < this.characters.length; i++) this.characters[i].position = i + 1;
	};

	this.getCharacterByPosition = function(pos)
	{
		for(var i = 0; i < this.characters.length; i++)
		{
			if(this.characters[i].position == pos) return this.characters[i];
		}
	};

	this.reset = function()
	{
		this.active = false;
		this.selectedCount = 0;
	
		this.characters = [];
	};
}
