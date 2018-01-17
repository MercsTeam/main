function Player(a)
{
	this.score = 0;
	this.winner = false;
	this.active = a;

	this.selectedCount = 0;
	
	this.characters = null;	
	this.characterCoords = null;

	this.isWinner = function() { return this.winner; };
	this.isActive = function() { return this.active; };

	this.addCharacter = function(c)
	{
		if(!this.characters) this.characters = [];

		this.characters.push(new c());
	};

	this.removeCharacter = function(c)
	{
		for(var i = 0; i < this.characters.length; i++)
		{
			if(this.characters[i] instanceof c) 
			{
				this.characters.slice(i, 0);
				break;
			}
		}
	};

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
		this.winner = false;
		this.active = false;
		this.selectedCount = 0;
	
		this.characters = null;
	};
}
