var SkillType = { NotSet : -1, Reusable : 1, Defensive : 2, Offensive : 3 };

function Skill(n)
{
	this.selected = false;
	this.active = true;
	this.imageURL = "";
    
    this.name = n;
    this.description = "Description of Skill.";
    this.type = SkillType.NotSet;
    
    this.multiTarget = false;
    
	this.blocksDamage = false;
    this.repeatable = true;
    
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

    this.dazeProb = 0.0;
	this.poisonProb = 0.0;
	this.bleedProb = 0.0;
	this.burnProb = 0.0;
    
    this.randomDebuffProb = 0.0;
    
    this.selfHealthAdd = 0;
    this.selfImmunity = false;
    
    this.allyHealthAdd = 0;
    this.allyImmunity = false;
    
    //effective number of rounds
    this.duration = 0;

	this.isSelected = function() { return this.selected; };    
    this.isActive = function() { return this.active; };

	this.toLog = function() { return "<strong>" + this.name + "</strong><br />" + this.description; };

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
					target[i].attack.modifier = this.selfAttackMod;
					target[i].defence.modifier = this.selfDefenceMod;
					target[i].speed.modifier = this.selfSpeedMod;
					target[i].accuracy.modifier = this.selfAccuracyMod;
					
					target[i].health.base += this.selfHealthAdd;

					if(this.selfImmunity) target[i].immune = true;
					if(this.blocksDamage) target[i].blocksDamage = true;
				}				
				else
				{
					if(this.type == SkillType.Offensive)
					{
						//alert("Offensive!!");

						target[i].attack.modifier = this.oppAttackMod;
						target[i].defence.modifier = this.oppDefenceMod;
						target[i].speed.modifier = this.oppSpeedMod;
						target[i].accuracy.modifier = this.oppAccuracyMod;

						if(r <= this.stunProb) target[i].stunned = true;
						if(r <= this.dazeProb) target[i].dazed = true;

						if(r <= this.poisonProb)
						{
							target[i].poisoned = true;							
							target[i].health.modifier = 0.9;
						}
						if(r <= this.bleedProb) 
						{
							target[i].bleeding = true;
							target[i].health.modifier = 0.85;
						}
						if(r <= this.burnProb)
						{
							target[i].burned = true;
							target[i].health.modifier = 0.95;
							target[i].defence.modifier = 0.75;
						}
						
						if(r <= this.randomDebuffProb)
						{
							if(r <= 0.2) 
								target[i].attack.modifier = 0.75;
							else if(r <= 0.4)
								target[i].defence.modifier = 0.75;
							else if(r <= 0.6)
								target[i].speed.modifier = 0.75;
							else if(r <= 0.6)
								target[i].accuracy.modifier = 0.75;
							else
								target[i].stunned = true;
						}
						
						damage = target[i].calculateDamage(self, getTypeBonus(self.type, target[i].type));
						target[i].health.base = Math.max(0, target[i].health.base - damage);	
						
						gameLog.write(string.format(string.format("PLAYER{0}: {1} does {2} damage to {3}",.", 
							(self.player == player1 ? "1" : "2"),
							self.name, 
							target[i].name
							damage
						));
					}
					else
					{
						target[i].attack.modifier = this.allyAttackMod;
						target[i].defence.modifier = this.allyDefenceMod;
						target[i].speed.modifier = this.allySpeedMod;
						target[i].accuracy.modifier = this.allyAccuracyMod;

						target[i].health.base += this.allyHealthAdd;

						if(this.allyImmunity) target[i].immune = true;
					}
				}							
			}			
		}
	}
}
