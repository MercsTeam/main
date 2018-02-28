var BattleMenu =
{
	container : document.querySelector("#dialog1"),
	btnCommit : document.querySelector("#btnCommit"),
	active1 : 
	{ 
		btns : document.querySelectorAll(".active1 button"), 
		img : document.querySelector("#active_img1"),
		skill : document.querySelector("#skillOverlay1"),
		skillDesc : document.querySelector("#skillOverlay1 .skillDesc"),
		btnAlly : document.querySelector(".active2 button:last-child"),
		toggleSkill : function() { this.skill.classList.toggle("inactive"); },
		ready : document.querySelector("#characterReady1"),
		toggleReady : function() { this.ready.classList.toggle("inactive"); },
		targetBtns : document.querySelectorAll("#skillOverlay1 button"),
		action : document.querySelector("#characterReady1 .characterAction")
	},
	active2 : 
	{ 
		btns : document.querySelectorAll(".active2 button"), 
		img : document.querySelector("#active_img2"),
		skill : document.querySelector("#skillOverlay2"),
		skillDesc : document.querySelector("#skillOverlay2 .skillDesc"),
		btnAlly : document.querySelector(".active1 button:last-child"),
		toggleSkill : function() { this.skill.classList.toggle("inactive"); },
		ready : document.querySelector("#characterReady2"),
		toggleReady : function() { this.ready.classList.toggle("inactive"); },
		targetBtns : document.querySelectorAll("#skillOverlay2 button"),
		action : document.querySelector("#characterReady2 .characterAction")
	},
	toggle : function()
	{
		if(CharacterSelection.isVisible() && !Game.over)
		{
			this.container.classList.toggle("hide1");
		}
	},	
	Timeout :
	{
		label : document.querySelector("#timeout"),
		intvl : null,
		start : function()
		{
			this.label.innerHTML = "00:60";
			this.intvl = setInterval("BattleMenu.Timeout.countdown()", 1000);
		},
		countdown : function()
		{
			var r = parseInt(this.label.innerHTML.substring(3));
			r--;
			
			if(r > -1)
			{
				this.label.innerHTML = "00:" + (r < 10 ? "0" : "") + r;
			}
			else
			{
				this.stop();
				BattleMenu.commit();
			}
		},
		stop : function()
		{
			clearInterval(this.intvl);
		}
	},
	load : function()
	{
		this.Timeout.start();
		
		var p = (Game.player1.isActive() ? Game.player1 : Game.player2);
		var btns;
		var retreatIndex = 4;
		var immobileCount = 0;
		
		for(var i = 0; i < p.characters.length; i++)
		{
			p.characters[i].retreat = false;

			if(p.characters[i].position == 1 || p.characters[i].position == 2)
			{
				if(!p.characters[i].active || !p.characters[i].canMove) immobileCount++;
				
				if(p.characters[i].position == 1)
				{
					btns = this.active1.btns;
					this.active1.img.src = "characters/headshots/" + (p.characters[i].active ? p.characters[i].image : "inactive.png");
				}
				else
				{
					btns = this.active2.btns;
					this.active2.img.src = "characters/headshots/" + (p.characters[i].active ? p.characters[i].image : "inactive.png");
				}
				
				//if less than 3 characters, disable retreat
				if(p.activeCharacterCount < Game.CHARACTERS_PER_TEAM) 
				{
					btns[retreatIndex].disabled = true;
				}
				
				for(var j = 0; j < btns.length; j++)
				{
					p.characters[i].skills[j].selected = false;
					
					btns[j].innerHTML = p.characters[i].skills[j].name;
					
					if(p.characters[i].skills[j].cooldownRem != 0)
					{
						btns[j].disabled = true;
						p.characters[i].skills[j].cooldownRem--;
					}
					else
					{
						btns[j].disabled = (!p.characters[i].active || (!p.characters[i].canMove && j < retreatIndex) || (p.activeCharacterCount < Game.CHARACTERS_PER_TEAM && j == retreatIndex));
					}
					
					btns[j].onclick = function()
					{
						Game.uiSound.start("clickOn");
						var index = -1;
						
						var btns = this.parentElement.querySelectorAll("button");
						for(var k = 0; k < btns.length; k++)
						{
							if(btns[k] == this)
							{
								btns[k].classList.add("selected");
								index = k;
							}
							else
							{
								btns[k].classList.remove("selected");
							}
						}
						
						var pos = (this.parentElement.parentElement.classList.contains("active1") ? 1 : 2);
						var character = p.getCharacterByPosition(pos);
						
						if(this.innerHTML == "Retreat")
						{
							character.retreat = !character.retreat;
							if(!character.retreat)
							{
								this.classList.remove("selected");
							}
							else
							{
								BattleMenu.showSkill(character, index, pos, -1);
							}
						}
						else
						{
							var skill = character.skills[index];
							if(skill.multiTarget)
							{
								BattleMenu.showSkill(character, index, pos, -1);
							}
							else if(skill.type != SkillType.Offensive)
							{
								BattleMenu.showSkill(character, index, pos, (skill.affectAlly ? character.getAlly().position : pos));
							}
							else
							{
								BattleMenu.showSkill(character, index, pos);
							}
						}
					};					
				}
			}
		}

		if(immobileCount == 2) this.btnCommit.disabled = false;
	},
	reset : function()
	{
		var b = document.querySelectorAll(".abilities button");
		for(var i = 0; i < b.length; i++)
		{
			b[i].disabled = false;
			b[i].classList.remove("selected");
		}
		
		var f = document.querySelectorAll(".skillOverlay, .characterReady");
		for(var i = 0; i < f.length; i++)
		{
			f[i].classList.add("inactive");
		}
		
		this.Timeout.stop();
		this.btnCommit.disabled = true;
	},	
	showSkill : function(character, index, pos, target)
	{
		var sType = character.skills[index].type;
		
		var which = (pos == 1 ? this.active1 : this.active2);
		which.toggleSkill();		
		which.skillDesc.innerHTML = character.skills[index].getDescription();
		
		var btns = which.targetBtns;
		if(target)
		{
			btns[0].innerHTML = "Continue";
			btns[0].onclick = function() { BattleMenu.showReady(character, index, pos, target); };
			btns[0].disabled = false;
			
			btns[1].style.display = "none";
			
			if(character.retreat) which.btnAlly.disabled = true;
		}
		else
		{
			var img1 = btns[0].querySelector("IMG"); 
			var img2 = btns[1].querySelector("IMG");
			
			//btns[0].innerHTML = (sType == SkillType.Offensive ? "Enemy 1" : (pos == 1 ? "Self" : "Ally 1"));
			btns[0].onclick = function() { BattleMenu.showReady(character, index, pos, 1); };
			
			btns[1].style.display = "";
			//btns[1].innerHTML = (sType == SkillType.Offensive ? "Enemy 2" : (pos == 2 ? "Self" : "Ally 2"));
			btns[1].onclick = function() { BattleMenu.showReady(character, index, pos, 2); };
			
			if(sType == SkillType.Offensive)
			{
				var opp = character.player.getOpponent();
				
				img1.src = "characters/headshots/" + opp.getCharacterByPosition(1).image;
				img2.src = "characters/headshots/" + opp.getCharacterByPosition(2).image;
				
				btns[0].disabled = (!opp.getCharacterByPosition(1).active);
				btns[1].disabled = (!opp.getCharacterByPosition(2).active);
			}
			else
			{
				var ally = character.getAlly();
				
				img1.src = "characters/headshots/" + (pos == 1 ? character : ally).image;
				img2.src = "characters/headshots/" + (pos == 2 ? character : ally).image;
				
				btns[0].disabled = (ally.position == 1 && !ally.active);
				btns[1].disabled = (ally.position == 2 && !ally.active);
			}
		}
		
		btns[2].onclick = function()
		{
			Game.uiSound.start("clickOff");
			
			which.toggleSkill();
			which.btnAlly.disabled = (character.player.activeCharacterCount < Game.CHARACTERS_PER_TEAM);
		};
	},
	showReady : function(character, index, pos, target)
	{
		Game.uiSound.start("clickOn");

		var s = character.skills[index];
		s.selected = true;

		character.target = target;

		var which = (pos == 1 ? this.active1 : this.active2);
		var overlay = which.ready;
		overlay.classList.toggle("inactive");
		overlay.style.backgroundImage = string.format("url('characters/{0}')", character.image);

		which.action.innerHTML = (!character.retreat
			? s.name.toUpperCase() + "<br />" + (s.type == SkillType.Offensive
			? "<span>against</span><br />" + (target == -1 ? "ENEMY 1 + 2" : "ENEMY " + target)
			: "<span>on</span><br />" + (target == -1 ? "SELF + ALLY" : (pos == target  ? "SELF" : "ALLY " + target)))
			: "RETREAT");

		this.btnCommit.disabled = !this.isComplete();
		if(!character.getAlly().active || !character.getAlly().canMove) this.btnCommit.disabled = false;

		overlay.querySelector("button").onclick = function()
		{
			Game.uiSound.start("clickOff");
			s.selected = false;
			character.target = null;
			which.toggleReady();

			BattleMenu.btnCommit.disabled = true;
		};
	},
	isComplete : function() { return (document.querySelectorAll(".characterReady.inactive").length == 0); },
	commit : function()
	{
		Game.uiSound.start("clickOn");
		this.reset();
		
		if(Game.player1.isActive())
		{
			Game.player1.active = false;
			Game.player2.active = true;
			this.load();
		}
		else
		{
			this.toggle();
			Game.startRound();
		}
	}
};
