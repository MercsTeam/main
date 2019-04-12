const SCALE_MAX = 100;

var CharacterSelection =
{
	MAX_HEALTH : 250,
	MAX_ATTACK : 66,
	MAX_DEFENCE : 75,
	MAX_SPEED : 135,
	hshots : document.querySelector("#headshots"),
	container : document.querySelector("#characterSelect"),	
	p1Character : document.querySelector("#player1Character"),
	p2Character : document.querySelector("#player2Character"),
	p1Selection : document.querySelector("#player1Selection"),
	p2Selection : document.querySelector("#player2Selection"),
	p1Indicators : null,
	p2Indicators : null,
	isActive : function() { return !this.container.hidden; },
	setActive : function(value) { this.container.hidden = !value; },
	toggle : function()
	{
		this.container.classList.toggle("hide2");
	},
	isVisible : function()
	{
		return this.container.classList.contains("hide2");
	},
	load : function()
	{
		var h, sp;
		for(var i = 0; i < Game.availableCharacters.length; i++)
		{
			c = new Game.availableCharacters[i]();

			h = document.createElement("DIV");
			h.classList.add("char-button");
			if(i == 0) h.classList.add("selected_player1", "selected_player2");
			if(c.isBonus && !Game.isUnlocked) h.classList.add("disabled");
			
			img = document.createElement("IMG");
			img.src = "characters/headshots2/" + c.image;
			img.border = 0;
			img.alt = "";
			h.appendChild(img);

			sp = document.createElement("SPAN");
			sp.className = "p1_indicator";
			sp.innerHTML = "+";
			h.appendChild(sp);

			sp = document.createElement("SPAN");
			sp.className = "p2_indicator";
			sp.innerHTML = "+";
			h.appendChild(sp);			
			
			CharacterSelection.hshots.appendChild(h);
		}

		CharacterSelection.p1Indicators = document.querySelectorAll(".p1_indicator");
		CharacterSelection.p2Indicators = document.querySelectorAll(".p2_indicator");
	},
	movePlayer : function(p)
	{
		var btns = document.querySelectorAll(".char-button");
		var cName = (p == Game.player1 ? "selected_player1" : "selected_player2");
		var which = (p == Game.player1 ? this.p1Character : this.p2Character);
		var c = null;		
		var index = (p.position.Y * 4 + p.position.X);

		for(var i = 0; i < btns.length; i++)
		{
			if(i == index)
			{				
				btns[i].classList.add(cName);
				
				c = new Game.availableCharacters[i]();
				which.classList[(c.isBonus && !Game.isUnlocked ? "add" : "remove")]("disabled");
				which.querySelector(".characterImg").src = "images/sprites/" + c.state.IDLE_FRONT.img;
				which.querySelector(".characterName").innerHTML = c.name;
			}
			else
			{
				btns[i].classList.remove(cName);
			}
		}
	},
	addBonusCharacter : function(p)
	{
		p.addCharacter(Dynaman);

		var which = (p == Game.player1 ? this.p1Character : this.p2Character);
		which.querySelector(".characterImg").src = "images/sprites/dynaman_idle_front.png";
		which.querySelector(".characterName").innerHTML = "Dynaman";
	},
	addSecretCharacter : function(p, s)
	{
		//TO DO: add SPY2k characters
		//p.addCharacter(Dynaman);

		var which = (p == Game.player1 ? CharacterSelection.p1Character : CharacterSelection.p2Character);
		which.querySelector(".characterImg").src = "images/sprites/" + s.image + "_idle_front.png";
		which.querySelector(".characterName").innerHTML = s.name;
	},
	select : function(p)
	{
		var index = (p.position.Y * 4 + p.position.X);
		var btn = document.querySelectorAll(".char-button")[index];
		var indicators = (p == Game.player1 ? CharacterSelection.p1Indicators : CharacterSelection.p2Indicators);
		if(btn.classList.contains("disabled")) return false;

		var c = Game.availableCharacters[index];
		if(!p.hasCharacter(c))
		{
			if(p.characters && p.characters.length >= 3) return;

			Game.uiSound.start("clickOn");
			p.addCharacter(c);

			indicators[index].style.visibility = "visible";
		}
		p.selectionReady = (p.characters.length == 3);
	},
	unselect : function(p)
	{	
		var index = (p.position.Y * 4 + p.position.X);	
		var indicators = (p == Game.player1 ? CharacterSelection.p1Indicators : CharacterSelection.p2Indicators);
		var c = Game.availableCharacters[index];
		
		if(p.hasCharacter(c))
		{
			Game.uiSound.start("clickOff");
			p.removeCharacter(c);

			indicators[index].style.visibility = "hidden";
		}
		p.selectionReady = false;
	},
	isReady : function()
	{
		return Game.player1.selectionReady && Game.player2.selectionReady;
	}
};

function getRating(attr, maxValue)
{
	return (!attr ? 0 : Math.floor(attr.base / maxValue * SCALE_MAX));
}

function showCharacterRating(pElement, c)
{
	var powerRatings = 
	[ 
		getRating(c.health, CharacterSelection.MAX_HEALTH),
		getRating(c.attack, CharacterSelection.MAX_ATTACK),
		getRating(c.defence, CharacterSelection.MAX_DEFENCE),
		getRating(c.speed, CharacterSelection.MAX_SPEED)
	];

	var img = pElement.querySelector("img");
	img.src = "characters/headshots2/" + c.image;

	var ratings = pElement.querySelectorAll(".rating");
	for(var i = 0; i < ratings.length; i++)
	{
		ratings[i].style.backgroundSize = powerRatings[i] + "% 50px";
	}
}
