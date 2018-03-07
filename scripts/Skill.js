var SkillType = { NotSet : -1, Reusable : 1, Defensive : 2, Offensive : 3 };
var Probability = { VeryLow : 0.1, Low : 0.2, Medium : 0.3, High : 0.4, VeryHigh : 0.5 };

function Skill(n)
{
	this.selected = false;
	this.active = true;
	this.imageURL = "";
	this.soundID = "";

	this.name = n;
	this.description = "Description of Skill.";
	this.type = SkillType.NotSet;

	//when cooldownRem = 0, skill can be reused
	this.cooldown = 0;
	this.cooldownRem = 0; 

	//can this skill affect multiple enemies
	this.multiTarget = false;

	//can this skill aid your ally
	this.affectAlly = false;

	this.selfDamage = false;
	this.blocksDamage = false;	   	

	this.attackValue = 0;
	this.accuracy = 1.0;

	//% mod self stats
	this.selfAttackMod = 1.0;
	this.selfDefenceMod = 1.0;
	this.selfSpeedMod = 1.0;
	this.selfAccuracyMod = 1.0;

	//% mod ally stats
	this.allyAttackMod = 1.0;
	this.allyDefenceMod = 1.0;
	this.allySpeedMod = 1.0;
	this.allyAccuracyMod = 1.0;

	//% mod opponent stats
	this.oppAttackMod = 1.0;
	this.oppDefenceMod = 1.0;
	this.oppSpeedMod = 1.0;
	this.oppAccuracyMod = 1.0;

	this.stunProb = 0.0;
	this.interruptProb = 0.0;
	this.poisonProb = 0.0;
	this.bleedProb = 0.0;
	this.burnProb = 0.0;

	this.randomDebuffProb = 0.0;

	this.selfHealthAdd = 0;
	this.selfImmunity = false;

	this.allyHealthAdd = 0;
	this.allyImmunity = false;

	//effective number of rounds
	this.duration = 1;
	this.effectDuration = 0;

	this.isSelected = function() { return this.selected; };    
	this.isActive = function() { return this.active; };

	this.getDescription = function() 
	{ 
		var detail = [];
		var exclude = [ "description", "imageURL", "soundID", "selected" ];
		var altText = "";
		for(var attr in this)
		{
			if(this.hasOwnProperty(attr) && typeof this[attr] != "function" && exclude.indexOf(attr) == -1)
			{
				if(attr == "type")
				{
					altText = (this[attr] == 1 ? "Reusable" : (this[attr] == 2 ? "Defensive" : "Offensive"));
					detail.push(string.format("<strong>{0}:</strong> {1}", attr, altText));
				}
				else if(attr.toLowerCase().contains("prob"))
				{
					detail.push(string.format("<strong>{0}:</strong> {1}%", attr, Math.round(this[attr] * 100)));
				}
				else
				{
					detail.push(string.format("<strong>{0}:</strong> {1}", attr, this[attr]));
				}
			}
		}
		return string.format("<strong>{0}</strong><br />{1}<br /><span style=\"font-size:medium\">{2}</span>", this.name, this.description, detail.join("&nbsp;")); 
	};

	this.toString = function()
	{
		output = string.format("<strong>{0}</strong>: <em>({1})</em> {2}", 
			this.name,
			(this.type == SkillType.Offensive ? "Offensive" : (this.type == SkillType.Defensive ? "Defensive" : "Reusable")),
			this.description			
		);
		return output;
	}

	this.logAction = function(self, target, damage)
	{
		var ally = self.getAlly();
		var output = "";

		if(target == self)
		{
			output = string.format("PLAYER{0}: {1} uses {2} on SELF. {3} {4}", 
				(self.player == Game.player1 ? "1" : "2"),
				self.name, 
				this.name.toUpperCase(),
				(this.selfHealthAdd != 0 ? this.selfHealthAdd + " RESTORE." : ""),
				(this.blocksDamage ? " BLOCK DAMAGE ON." : "")
			);
		}
		else if(target == ally)
		{
			output = string.format("PLAYER{0}: {1} uses {2} on ALLY {3}. {4}", 
				(self.player == Game.player1 ? "1" : "2"),
				self.name, 
				this.name.toUpperCase(),
				target.name,
				(this.allyHealthAdd != 0 ? string.format("ALLY {0} RESTORE", this.allyHealthAdd) : "")
			);
		}
		else
		{
			output = string.format("PLAYER{0}: {1} uses {2} against ENEMY {3}. {4} DAMAGE.", 
				(self.player == Game.player1 ? "1" : "2"),
				self.name, 
				this.name.toUpperCase(),
				target.name,
				damage
			);
			
			if(damage > 0)
			{
				var slide = Game.skillImgArr[Game.skillImgArr.length - 1];

				//show damaged image
				if(slide)
				{
					slide.reaction.push({ player : target.player, label : string.format("Player {0}.{1} - {2}<br />{3} DAMAGE", (target.player == Game.player1 ? 1 : 2), target.position, target.name, damage), url : target.damageImage });
				}
			}
		}		
		Game.BattleLog.write(output);
	}

	this.doAction = function(self, target)
	{
		var r = Math.random();
		var damage = 0;

		for(var i = 0; i < target.length; i++)
		{
			if(r <= (this.accuracy * self.accuracy.modifier))
			{
				if(target[i] == self)
				{
					if(this.selfAttackMod != 1.0) target[i].attack.modifier = this.selfAttackMod;
					if(this.selfDefenceMod != 1.0) target[i].defence.modifier = this.selfDefenceMod;
					if(this.selfSpeedMod != 1.0) target[i].speed.modifier = this.selfSpeedMod;
					if(this.selfAccuracyMod != 1.0) target[i].accuracy.modifier = this.selfAccuracyMod;
					
					target[i].health.base += this.selfHealthAdd;

					if(this.selfImmunity) 
					{
						target[i].setEffectIndicator(Game.StatusEffects.Immune, 0);
						target[i].immune = true;
					}

					if(this.blocksDamage) target[i].blocksDamage = true;
					
					this.logAction(self, target[i]);
				}				
				else
				{
					if(this.type == SkillType.Offensive)
					{
						if(target[i].blocksDamage) break;

						if(this.oppAttackMod != 1.0) target[i].attack.modifier = this.oppAttackMod;
						if(this.oppDefenceMod != 1.0) target[i].defence.modifier = this.oppDefenceMod;
						if(this.oppSpeedMod != 1.0) target[i].speed.modifier = this.oppSpeedMod;
						if(this.oppAccuracyMod != 1.0) target[i].accuracy.modifier = this.oppAccuracyMod;

						if(!target[i].checkActiveEffect())
						{
							if(r <= this.stunProb) 
							{
								target[i].setEffectIndicator(Game.StatusEffects.Stunned, 0);
								target[i].stunned = true;
							}
							
							if(r <= this.interruptProb) 
							{
								target[i].setEffectIndicator(Game.StatusEffects.Interrupt, 0);
								target[i].interrupt = true;

								target[i].accuracy.modifier = 0.75;
								target[i].accuracy.duration = 1;
							}
							if(r <= this.poisonProb)
							{
								target[i].setEffectIndicator(Game.StatusEffects.Poisoned, 0);
								target[i].poisoned = true;							
								target[i].health.modifier = 0.9;
							}
							if(r <= this.bleedProb) 
							{
								target[i].setEffectIndicator(Game.StatusEffects.Bleeding, 0);
								target[i].bleeding = true;
								target[i].health.modifier = 0.85;
							}
							if(r <= this.burnProb)
							{
								target[i].setEffectIndicator(Game.StatusEffects.Burned, 0);
								target[i].burned = true;
								target[i].health.modifier = 0.95;
								target[i].defence.modifier = 0.75;
							}
						}
						
						if(r <= this.randomDebuffProb)
						{
							if(r <= 0.2) 
								target[i].attack.modifier = 0.75;
							else if(r <= 0.4)
								target[i].defence.modifier = 0.75;
							else if(r <= 0.6)
								target[i].speed.modifier = 0.75;
							else if(r <= 0.8)
								target[i].accuracy.modifier = 0.75;
							else
								target[i].stunned = true;
						}
						
						damage = target[i].calculateDamage(self, Game.getTypeBonus(self.type, target[i].type));
						target[i].health.base = Math.max(0, target[i].health.base - damage);	

						this.logAction(self, target[i], damage);
					}
					else
					{
						if(this.allyAttackMod != 1.0) target[i].attack.modifier = this.allyAttackMod;
						if(this.allyDefenceMod != 1.0) target[i].defence.modifier = this.allyDefenceMod;
						if(this.allySpeedMod != 1.0) target[i].speed.modifier = this.allySpeedMod;
						if(this.allyAccuracyMod != 1.0) target[i].accuracy.modifier = this.allyAccuracyMod;

						target[i].health.base += this.allyHealthAdd;

						if(this.allyImmunity) 
						{
							target[i].immune = true;
							target[i].setEffectIndicator(Game.StatusEffects.Immune, 0);
						}
						
						this.logAction(self, target[i]);
					}
				}							
			}			
		}
	}
}
