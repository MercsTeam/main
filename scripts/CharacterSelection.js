const SCALE_MAX = 10;

var CharacterSelection =
{
	MAX_HEALTH : 250,
	MAX_ATTACK : 66,
	MAX_DEFENCE : 75,
	MAX_SPEED : 135,
	container : document.querySelector("#characterSelect"),	
	btnSelect : document.querySelectorAll(".player button"),
	commit : function(btn)
	{
		btn.classList.toggle("selected");
		btn.disabled = true;
		
		Game.uiSound.start("clickOn");
		
		if(Game.player1.isActive())
		{
			Game.player1.commit();

			this.btnSelect[1].innerHTML = "Player 2: Pick 3";
			
			Game.player1.active = false;
			Game.player2.active = true;
		}
		else
		{
			Game.player2.commit();
			
			Game.player2.active = false;
			Game.player1.active = true;
			
			this.toggle();
			Game.loadArena();
			
			window.setTimeout( function() {
				BattleMenu.toggle();
				BattleMenu.load();
			}, 1500);
		}
	},
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
		this.btnSelect[0].innerHTML = "Player 1: Pick 3";
		this.btnSelect[0].disabled = true;
		
		this.btnSelect[1].innerHTML = "Player 2: Wait";
		this.btnSelect[1].disabled = true;

		var btn;

		for(var i = 0; i < Game.availableCharacters.length; i++)
		{
			c = new Game.availableCharacters[i]();
			
			/*f = document.createElement("FIGURE");
			f.dataset.cindex = i;*/

			btn = document.createElement("BUTTON");
			btn.className = "char-button";
			btn.type = "button";
			btn.dataset.cindex = i;

			//f.onclick = function()
			btn.onclick = function()
			{
				var cName = (Game.player1.isActive() ? "selected_player1" : "selected_player2");
				var p = (Game.player1.isActive() ? Game.player1 : Game.player2);
				
				this.classList.toggle(cName);
				
				//if(this.className.indexOf("selected") != -1)
				if(this.classList.contains(cName))
				{
					if(p.selectedCount < 3)
					{
						Game.uiSound.start("clickOn");
						p.addCharacter(Game.availableCharacters[this.dataset.cindex]);
						p.selectedCount++;
					}
					else
					{
						this.classList.toggle(cName);
					}
				}
				else
				{
					Game.uiSound.start("clickOff");
					p.removeCharacter(Game.availableCharacters[this.dataset.cindex]);
					p.selectedCount--;
				}
				
				var btn = CharacterSelection.btnSelect[(Game.player1.isActive() ? 0 : 1)];
				btn.disabled = (p.selectedCount != 3);
				if(!btn.disabled) btn.innerHTML = btn.innerHTML.replace("Pick 3", "Commit");
			};
			
			img = document.createElement("IMG");
			img.src = "characters/headshots/" + c.image;
			img.border = 0;
			img.alt = "";
			
			//fcap = document.createElement("FIGCAPTION");
			//fcap.innerHTML = c.name;

			sp = document.createElement("SPAN");
			sp.innerHTML = c.name;

			rdiv = document.createElement("DIV");
			rdiv.className = "rating-container";
			rdiv.appendChild(HTMLRatingChart(
			{
				"HEALTH"	: getRating(c.health, this.MAX_HEALTH),
				"ATTACK"	: getRating(c.attack, this.MAX_ATTACK),
				"DEFEND"	: getRating(c.defence, this.MAX_DEFENCE),
				"SPEED"		: getRating(c.speed, this.MAX_SPEED)
			}));
			
			/*f.appendChild(img);
			f.appendChild(fcap);
			f.appendChild(rdiv);
			
			this.container.appendChild(f);*/

			btn.appendChild(img);
			btn.appendChild(sp);

			if(c.isBonus && !(Session.P1.wins >= 3 || Session.P2.wins >= 3))
			{
				btn.disabled = true;
			}
			else
			{
				btn.appendChild(rdiv);
			}
			
			this.container.appendChild(btn);
		}
	}
};

function getRating(attr, maxValue)
{
	return (!attr ? 0 : Math.floor(attr.base / maxValue * SCALE_MAX));
}

function HTMLRatingChart(powerRatings)
{
	var table = document.createElement('TABLE');
	table.id = "rateChart";
	table.style.width = "100%"
	table.cellPadding = 0;
	table.cellSpacing = 3;

	var tr = table.insertRow(-1);
	tr.className = "tableHead";
	
	var th = document.createElement('TH');
	th.style.width = "50%";
	th.innerHTML = "&nbsp;";
	tr.appendChild(th);

	for(var i = 1; i <= SCALE_MAX; i++)
	{
		th = document.createElement('TH');
		th.style.width = "5%";
		th.innerHTML = "";
		tr.appendChild(th);
	}

	var td = null;
	for(var value in powerRatings)
	{
		tr = table.insertRow(-1);

		td = tr.insertCell(-1);
		td.className = "power_rating";
		td.innerHTML = "&nbsp;" + value;
		
		for(var i = 1; i <= SCALE_MAX; i++)
		{
			td = tr.insertCell(-1);
			td.className = (i <= powerRatings[value] ? "power_rating" : "not_set");
		}
	}
	return table;
}
