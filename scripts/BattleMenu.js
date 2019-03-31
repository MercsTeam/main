var BattleMenu =
{
	container : document.querySelector("#battleMenu"),
	p1ReadyMsg : document.querySelector("#p1Ready"),
	p2ReadyMsg : document.querySelector("#p2Ready"),
	isActive : function() { return !this.container.hidden; },
	setActive : function(value) { this.container.hidden = !value; },
	toggle : function()
	{
		if(CharacterSelection.isVisible() && !Game.over)
		{
			this.container.classList.toggle("hide1");
		}
	},	
	Timeout :
	{
		intv : null,
		tmr : document.querySelector(".timer"), 
		msk : document.querySelector(".mask"),
		lbl : document.querySelector(".timer-container span"),
		trot : 0, 
		mrot : 0,
		secs : 60,
		start : function()
		{
			this.trot = 0;
			this.mrot = 0;
			this.secs = 60;

			this.intv = setInterval("BattleMenu.Timeout.countdown()", 1000);
		},
		countdown : function()
		{
			this.secs--;
			this.lbl.innerHTML = this.secs;

			this.trot += 6;
			this.tmr.style.transform = "rotate(" + this.trot + "deg)";

			this.mrot -= 6;					
			this.msk.style.transform = "rotate(" + this.mrot + "deg)";
			this.msk.style.backgroundColor = (this.trot > 180 ? "#000000" : "#808080");
			
			if(this.mrot == -180) this.mrot = 0;
			if(this.trot == 360)
			{
				this.stop();

				BattleMenu.reset();
				BattleMenu.setActive(false);

				Game.startRound();
			}
		},
		stop : function()
		{
			clearInterval(this.intv);
		}
	},
	load : function()
	{
		this.Timeout.start();

		var p, c;
		for(var i = 1; i <= 2; i++)
		{
			p = Game["player" + i];			
			for(var j = 1; j <= p.characters.length; j++)
			{
				c = p.getCharacterByPosition(j);
				c.retreat = false;

				document.querySelector("#character" + i + " .cmenuImg" + j).src = "images/sprites/" + c.state.IDLE_FRONT.img;
			}

			if(this.skipCharacter(p)) 
			{
				p.characterPos = 2;
				this.switchCharacter(p);
			}
			this.showSkills(p);
		}
	},
	reset : function()
	{
		Game.player1.characterPos = 1;
		Game.player1.position = { X : 0, Y : 0 };
		Game.player1.activeSkill = null;
		Game.player1.battleReady = false;
		
		Game.player2.characterPos = 1;
		Game.player2.position = { X : 0, Y : 0 };
		Game.player2.activeSkill = null;
		Game.player2.battleReady = false;
		
		this.p1ReadyMsg.hidden = true;
		this.p2ReadyMsg.hidden = true;

		var id = "";
		for(var i = 1; i <= 2; i++)
		{
			id = "#character" + i;

			document.querySelector(id + " .cmenuImg1").classList.add("active");
			document.querySelector(id + " .marker1").style.visibility = "visible";
				
			document.querySelector(id + " .cmenuImg2").classList.remove("active");
			document.querySelector(id + " .marker2").style.visibility = "hidden";
		}
		
		this.Timeout.stop();
	},	
	skipCharacter : function(p)
	{
		var character = p.getCharacterByPosition(p.characterPos);
		return (!character.active || !character.canMove);
	},
	switchCharacter : function(p)
	{
		var id = (p == Game.player1 ? "#character1" : "#character2");
		
		document.querySelector(id + " .cmenuImg1").classList.remove("active");
		document.querySelector(id + " .marker1").style.visibility = "hidden";
		
		document.querySelector(id + " .cmenuImg2").classList.add("active");
		document.querySelector(id + " .marker2").style.visibility = "visible";
	},
	showSkills : function(p)
	{
		p.position = { X : 0, Y : 0 };

		var id = "#character" + (p == Game.player1 ? 1 : 2);
		var c = p.getCharacterByPosition(p.characterPos);
		var a = document.querySelectorAll(id + " .skill");
		var s = null;

		var noRetreat = (p.activeCharacterCount < Game.CHARACTERS_PER_TEAM);

		for(var k = 0; k < c.skills.length; k++)
		{
			s = c.skills[k];

			isLongName = (s.name.length > 16);
			a[k].innerHTML = (isLongName ? "<span class=\"longName\">" : "") + s.name + (isLongName ? "</span>" : "");
			if(s.name == "Retreat" && noRetreat) a[k].classList.add("disabled");

			if(s.cooldownRem != 0)
			{
				a[k].classList.add("disabled");
				s.cooldownRem--;
			}
			else
			{
				a[k].classList.remove("disabled");
			}

			if(k == 0)
			{
				a[k].classList.add("active");

				if(!a[k].classList.contains("disabled"))
				{
					document.querySelector(id + " .skill-desc").innerHTML = s.getDescription();
					
					s.selected = true;
					this.setTarget(p);
				}
				else
				{
					document.querySelector(id + " .skill-desc").innerHTML = "Not Available";
				}
			}
			else
			{
				a[k].classList.remove("active");
				s.selected = false;
			}
		}
	},
	moveSkill : function(p)
	{
		if(p.battleReady) return;

		var id = (p == Game.player1 ? "#character1" : "#character2");
		var skills = document.querySelectorAll(id + " .skill");
		var s = null;

		for(var i = 0; i < skills.length; i++)
		{
			s = p.getCharacterByPosition(p.characterPos).skills[i];

			if(i == p.position.Y)
			{				
				skills[i].classList.add("active");

				if(!skills[i].classList.contains("disabled"))
				{
					s.selected = true
					
					//set description
					document.querySelector(id + " .skill-desc").innerHTML = s.getDescription();

					//toggle targets
					this.setTarget(p);
				}
				else
				{
					document.querySelector(id + " .skill-desc").innerHTML = "Not available";
				}
			}
			else
			{
				skills[i].classList.remove("active");
				s.selected = false;
			}
		}
	},
	setTarget : function(p)
	{
		var character = p.getCharacterByPosition(p.characterPos);

		var skill = character.getSelectedSkill();
		var targets = document.querySelectorAll((p == Game.player1 ? "#character2" : "#character1") + " [class^='target']");

		var oppActive = [ p.getOpponent().getCharacterByPosition(1).active, p.getOpponent().getCharacterByPosition(2).active ];
		
		for(var j = 0; j < targets.length; j++)
		{
			if(skill.type != SkillType.Offensive || !oppActive[j])
			{
				targets[j].hidden = true;
			}
			else if(skill.multiTarget && oppActive[0] && oppActive[1])
			{
				targets[j].hidden = false;
			}
			else 
			{
				if(oppActive[0])
				{
					targets[0].hidden = false;
					targets[1].hidden = true;
				}
				else
				{
					targets[0].hidden = true;
					targets[1].hidden = false;
				}
				break;
			}
		}
	},
	getTarget : function(c)
	{
		var skill = c.getSelectedSkill();
		////console.log("getTarget says: " + c.name + "=>" + skill.name);
		c.retreat = (skill.name == "Retreat");
		
		if(c.retreat || skill.multiTarget)
		{
			return -1;
		}
		else if(skill.type != SkillType.Offensive)
		{
			return (skill.affectAlly ? c.getAlly() : c).position;
		}
		else
		{
			var targets = document.querySelectorAll((c.player == Game.player1 ? "#character2" : "#character1") + " [class^='target']");
			for(var j = 0; j < targets.length; j++)
			{
				if(!targets[j].hidden)
				{
					return j + 1;
				}
			}
		}
	},
	moveTarget : function(p)
	{
		if(p.battleReady) return;

		var character = p.getCharacterByPosition(p.characterPos);
		var skill = character.getSelectedSkill();
		if(skill.type != SkillType.Offensive) return;

		var id = (p == Game.player1 ? "#character2" : "#character1");
		var targets = document.querySelectorAll(id + " [class^='target']");
		
		for(var i = 0; i < targets.length; i++)
		{
			if(i == p.position.X)
			{
				targets[i].hidden = true;
			}
			else
			{
				targets[i].hidden = false;
			}
		}
	},
	select : function(p)
	{
		var c = p.getCharacterByPosition(p.characterPos);
		if(!c.getSelectedSkill()) return;

		Game.uiSound.start("clickOn");
				
		c.target = this.getTarget(c);		
		////console.log("select says: " + c.target);

		if(p.characterPos == 1)
		{
			p.characterPos = 2;
			if(this.skipCharacter(p))
			{
				p.battleReady = true;
			}
			else
			{
				this.switchCharacter(p);
				this.showSkills(p);	
			}
		}
		else
		{
			p.battleReady = true;
		}
	},
	unselect : function(p)
	{
	},
	isReady : function()
	{
		if(Game.player1.battleReady) this.p1ReadyMsg.hidden = false;
		if(Game.player2.battleReady) this.p2ReadyMsg.hidden = false;

		return Game.player1.battleReady && Game.player2.battleReady;
	}
};