var CharacterSelection =
{
	container : document.querySelector("#characterSelect"),	
	btnSelect : document.querySelectorAll(".player button"),
	commit : function(btn)
	{
		btn.classList.toggle("selected");
		Game.uiSound.start("clickOn");
		
		if(Game.player1.isActive())
		{
			Game.player1.commit();
			
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
			
			BattleMenu.toggle();
			BattleMenu.load();
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
		this.btnSelect[0].disabled = true;
		this.btnSelect[1].disabled = true;

		for(var i = 0; i < Game.availableCharacters.length; i++)
		{
			c = new Game.availableCharacters[i]();
			
			f = document.createElement("FIGURE");
			f.dataset.cindex = i;
			f.onclick = function()
			{
				var cName = (Game.player1.isActive() ? "selected_player1" : "selected_player2");
				var p = (Game.player1.isActive() ? Game.player1 : Game.player2);
				
				this.classList.toggle(cName);
				
				if(this.className.indexOf("selected") != -1)
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
				
				CharacterSelection.btnSelect[(Game.player1.isActive() ? 0 : 1)].disabled = (p.selectedCount != 3);
			};
			
			img = document.createElement("IMG");
			img.src = "characters/headshots/" + c.image;
			img.border = 0;
			img.alt = "";
			
			fcap = document.createElement("FIGCAPTION");
			fcap.innerHTML = c.name;
			
			f.appendChild(img);
			f.appendChild(fcap);
			
			this.container.appendChild(f);
		}
	}
};