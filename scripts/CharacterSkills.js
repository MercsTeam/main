function Retreat()
{
	this.type = SkillType.Reusable;
	this.description = "Causes character to rotate into inactive position.";
	this.duration = 0;

	this.doAction = function(self)
	{
		var c3 = self.player.getCharacterByPosition(3);

		if(c3.active)
		{
			var ally = self.getAlly();
			var coords = self.player.characterCoords;				

			if(self.position == 1)
			{
				ally.position = 1;
				ally.updateGameObject(coords.First);
				
				c3.position = 2;
				c3.updateGameObject(coords.Second);
			}
			else
			{
				ally.position = 2;
				ally.updateGameObject(coords.Second);

				c3.position = 1;
				c3.updateGameObject(coords.First);
			}

			ally.canMove = true;
			
			c3.canMove = true;
			c3.retreat = false;
			
			self.position = 3;
			self.canMove = false;
			self.updateGameObject(coords.Third);			

			if(ally.burned)
			{
				ally.health.modifier = 0.90;
				ally.defence.modifier = 0.5;
			}

			Game.BattleLog.write(string.format("PLAYER{0}: {1} retreats!", (self.player == Game.player1 ? 1 : 2), self.name));
		}
	};
}
Retreat.prototype = new Skill("Retreat");

function forceRetreat(self, target)
{
	var opp = target.player;
	var retreat = target.skills[target.skills.length - 1];

	//if all characters still active
	if(opp.activeCharacterCount == Game.CHARACTERS_PER_TEAM)
	{
		retreat.doAction(target);
	}
}

function SwordChop()
{
    this.type = SkillType.Offensive;
    this.attackValue = 70;
    this.description = "A powerful blow to a lone target.";
	this.imageURL = "characters/BSGComicStills/FRONT-Sword_Chop.jpg";
	this.soundID = "swordChop";
}
SwordChop.prototype = new Skill("Sword Chop");

function SweepingStrike()
{
    this.type = SkillType.Offensive;
    this.attackValue = 50;
    this.description = "A broad strike at both opponents.";
    this.multiTarget = true;
	this.cooldown = 1;
	this.imageURL = "characters/BSGComicStills/FRONT-Sweeping_Strike.jpg";
	this.soundID = "sweepStrike";
}
SweepingStrike.prototype = new Skill("Sweeping Strike");

function DefensiveStance()
{
    this.type = SkillType.Defensive;
    this.description = "Defends against attacks this round.";
    this.blocksDamage = true;
	this.cooldown = 1;
	this.imageURL = "characters/BSGComicStills/FRONT-Defensive_Stance.jpg";
}
DefensiveStance.prototype = new Skill("Defensive Stance");

function Focus()
{
    this.type = SkillType.Reusable;
    this.selfAttackMod = 1.5;
    this.description = "Increases attack power while in battle.";
	this.cooldown = 1;
	this.imageURL = "characters/BSGComicStills/FRONT-Focus.jpg";
}
Focus.prototype = new Skill("Focus");

function Headshot()
{
    this.type = SkillType.Offensive;
    this.attackValue = 100;
    this.accuracy = 0.4;
    this.description = "A tricky shot that deals great damage, but only if it connects.";
	this.imageURL = "characters/SniperGirlComicStills/SG-Headshot.jpg";
	this.soundID  = "headShot";

	this.doAction = function(self, target)
	{
		var c = self.checkActiveHistory(Camouflage);
		if(c) c.duration = 0;
		
		var r = Math.random();
		if(r <= (this.accuracy * self.accuracy.modifier))
		{
			var damage = target[0].calculateDamage(self, Game.getTypeBonus(self.type, target[0].type));
			target[0].health.base = Math.max(0, target[0].health.base - damage);	

			this.logAction(self, target[0], damage);
		}
	};
}
Headshot.prototype = new Skill("Headshot");

function RicochetShot()
{
    this.type = SkillType.Offensive;
    this.attackValue = 50;
    this.multiTarget = true;
    this.accuracy = 0.2;
	this.bleedProb = 1.0;
    this.description = "An incredibly difficult shot that damages both targets, if it connects. May create a wound with a penetrating shot.";
	this.imageURL = "characters/SniperGirlComicStills/SG-Ricochet.jpg";
	this.soundID = "ricochetShotHit";
	this.cooldown = 2;
	
	this.doAction = function(self, target)
	{
		var c = self.checkActiveHistory(Camouflage);
		if(c) c.duration = 0;
		
		var r = Math.random();
		if(r <= (this.accuracy * self.accuracy.modifier))
		{
			var damage = 0;
			
			for(var i = 0; i < target.length; i++)
			{
				damage = target[i].calculateDamage(self, Game.getTypeBonus(self.type, target[i].type));
				target[i].health.base = Math.max(0, target[i].health.base - damage);	

				target[i].setEffectIndicator(Game.StatusEffects.Bleeding, 0);
				target[i].bleeding = true;
				target[i].health.modifier = 0.85;

				this.logAction(self, target[i], damage);
			}
		}
	};
}
RicochetShot.prototype = new Skill("Ricochet Shot");

function TakeAim()
{
    this.type = SkillType.Reusable;
    this.selfAccuracyMod = 1.5;
	this.effectDuration = 2;
    this.description = "Reduces chance of missing next turn.";
	this.imageURL = "characters/SniperGirlComicStills/SG-TakeAim.jpg";
	this.soundID = "takeAim";

	this.doAction = function(self, target)
	{
		self.accuracy.modifier = this.selfAccuracyMod;
		self.accuracy.duration = this.effectDuration;
		this.logAction(self, target[0]);
	};
}
TakeAim.prototype = new Skill("Take Aim");

function Camouflage()
{
    this.type = SkillType.Defensive;
    this.oppAccuracyMod = 0.5;
    this.duration = 3;
    this.description = "Become harder to hit until your next shot is fired.";
	this.cooldown = 1;
	this.imageURL = "characters/SniperGirlComicStills/SG-Camouflage.jpg";
	
	var counter = this.duration;
	
	this.doAction = function(self, target)
	{
		if(counter == 0) counter = this.duration;

		var opp = self.player.getOpponent();
		var oppMerc;

		for(var i = 1; i <= 2; i++)
		{
			oppMerc = opp.getCharacterByPosition(i);

			if(oppMerc.target == self.position)
			{
				oppMerc.accuracy.modifier = this.oppAccuracyMod;				
				oppMerc.accuracy.duration = counter;
 
				this.logAction(self, oppMerc, 0);
			}
			else
			{
				oppMerc.accuracy.modifier = 1.0;				
				oppMerc.accuracy.duration = -1;
			}
		}	
		counter--;
	}
}
Camouflage.prototype = new Skill("Camouflage");

function Fireball()
{
    this.type = SkillType.Offensive;
    this.attackValue = 50;
    this.burnProb = Probability.Low;
    this.description = "A fiery attack that may burn the enemy.";
	this.imageURL = "characters/MageComicStills/MageFireball.png";
}
Fireball.prototype = new Skill("Fireball");

function LightningStorm()
{
    this.type = SkillType.Offensive;
    this.attackValue = 30;
    this.multiTarget = true;
    this.stunProb = Probability.Low;
    this.description = "An electrical attack that strikes both enemies and may stun them.";
	this.imageURL = "characters/MageComicStills/MageLightningStorm.png";
}
LightningStorm.prototype = new Skill("Lightning Storm");

function DivineShield()
{
    this.type = SkillType.Defensive;
    this.blocksDamage = true;
    this.description = "Protects from all damage this turn.";
	this.cooldown = 1;
	this.imageURL = "characters/MageComicStills/MageDivineShield.png";
}
DivineShield.prototype = new Skill("Divine Shield");

function PoolMana()
{
    this.type = SkillType.Reusable;
    this.selfAttackMod = 1.5;
	this.effectDuration = 2;
    this.description = "Increases attack power for next turn.";
	this.cooldown = 1;
	this.imageURL = "characters/MageComicStills/MagePoolMana.png";
	
	this.doAction = function(self, target)
	{
		self.attack.modifier = this.selfAttackMod;
		self.attack.duration = this.effectDuration;
	};
}
PoolMana.prototype = new Skill("Pool Mana");

function LightningStrike()
{
    this.type = SkillType.Offensive;
    this.attackValue = 25;
    this.interruptProb = 0.15;
    this.description = "An electrical blow that may prevent the target from attacking.";	
}
LightningStrike.prototype = new Skill("Lightning Strike");

function CloudBarrier()
{
    this.type = SkillType.Defensive;
    this.selfDefenseMod = 1.25;
    this.selfImmunity = true;
    this.description = "Creates a cloudy veil that increases defence and protects from status effects.";
}
CloudBarrier.prototype = new Skill("Cloud Barrier");

function Confidence()
{
	this.type = SkillType.Defensive;
	this.duration = 2;
	this.blocksDamage = true;
	this.selfImmunity = true;
	this.description = "Manifests confidence to protect from all damage this turn, and temporarily blocks status effects";
	this.cooldown = 1;
}
Confidence.prototype = new Skill("Confidence");

//formerly known as HighWinds
function SinisterDeal()
{
    this.type = SkillType.Offensive;
    this.allySpeedMod = 1.5;
    this.oppSpeedMod = 0.5;
    this.effectDuration = 5;
	this.multiTarget = true;
	this.affectAlly = true;
    this.description = "Summons high winds across the battlefield, making allies faster and enemies slower.";

	this.doAction = function(self, target)
	{
		var ally = self.getAlly();
		ally.speed.modifier = this.allySpeedMod;
		ally.speed.duration = this.effectDuration;
		this.logAction(self, ally);

		for(var i = 0; i < target.length; i++) 
		{
			target[i].speed.modifier = this.oppSpeedMod;
			target[i].speed.duration = this.effectDuration;			
			this.logAction(self, target[i], 0);
		}
	};
}
SinisterDeal.prototype = new Skill("Sinister Deal");

function Wish()
{
    this.type = SkillType.Defensive;
    this.allyAttackMod = 1.25;
    this.allyDefenseMod = 1.25;
    this.allySpeedMod = 1.25;
    this.allyImmunity = true;
    this.allyHealthAdd = 25;
	this.affectAlly = true;
    this.description = "Grants an ally increased attack, defence, speed, immunity from status effects, and minor healing.";
	this.cooldown = 3;
}
Wish.prototype = new Skill("Wish");

function IntegratedBattleSystem()
{
    this.type = SkillType.Offensive;
    this.attackValue = 50;
    this.randomDebuffProb = 0.25;
    this.description = "An attack that may randomly lower one of the enemy's stats.";
	this.imageURL = "characters/CyborgComicStills/Cyborg_IntegratedBattleSystem.png";
}
IntegratedBattleSystem.prototype = new Skill("Integrated Battle System");

function ElectronicBarrier()
{
    this.type = SkillType.Reusable;
    this.oppAttackMod = 0.75;
	this.affectAlly = true;
    this.description = "Deploy a large energy barrier that reduces damage from all incoming attacks against allies.";
	this.cooldown = 1;
	this.imageURL = "characters/CyborgComicStills/Cyborg_ElectronicBarrier.png";

	this.doAction = function(self, target)
	{
		var opp = self.player.getOpponent();
		var oppMerc;

		for(var i = 1; i <= 2; i++)
		{
			oppMerc = opp.getCharacterByPosition(i);

			if(oppMerc.target != self.position)
			{
				oppMerc.attack.modifier = this.oppAttackMod;
				oppMerc.attack.duration = 1;
				this.logAction(self, oppMerc, 0);
			}
		}
		this.logAction(self, target[0]);
	}
}
ElectronicBarrier.prototype = new Skill("Electronic Barrier");

function NanobotRepairs()
{
    this.type = SkillType.Defensive;
    this.selfHealthAdd = 50;
    this.selfDefenseMod = 1.1;
    this.duration = 2;
    this.description = "Repairs damage to his armour and adapts it to the situation, temporarily regenerating HP and increasing defence.";
	this.cooldown = 2;
	this.imageURL = "characters/CyborgComicStills/Cyborg_NanobotRepairs.png";

	this.doAction = function(self, target)
	{
		self.health.base += 25;

		self.defence.modifier += 0.1;
		self.defence.duration = this.duration;

		this.logAction(self, target[0]);
	}
}
NanobotRepairs.prototype = new Skill("Nanobot Repairs");

function PassiveEffect()
{
    this.type = SkillType.Defensive;
    this.selfAttackMod = 1.5;
    this.selfSpeedMod = 1.5;
	this.duration = Number.MAX_VALUE;
    this.description = "Emergency Systems Engage: When below 20% HP, Attack and Speed is greatly increased (+50%). Effect ends if HP rises above 20%.";
	this.cooldown = 1;

	this.doAction = function(self, target)
	{
		if(self.getHealthPct() < 0.2)
		{
			self.attack.modifier = this.selfAttackMod;
			self.attack.duration = 1;

			self.speed.modifier = this.selfSpeedMod;
			self.speed.duration = 1;

			this.logAction(self, target[0]);
		}
	};
}
PassiveEffect.prototype = new Skill("Passive Effect");

function EnhancedCombatSystem()
{
	this.type = SkillType.Defensive;
	this.selfDamage = true;
	//this.selfSpeedMod = 3;
	this.selfAttackMod = 3;
	this.description = "Sacrifice half of health to dramatically increase attack power.";
	this.cooldown = 2;
	this.imageURL = "characters/CyborgComicStills/Cyborg_EnhancedCombatSystem.png";
	
	this.doAction = function(self, target)
	{
		self.health.modifier = 0.5;
		self.health.duration = 1;
		
		//self.speed.modifier = this.selfSpeedMod;
		self.attack.modifier = this.selfAttackMod;
		
		this.logAction(self, target[0]);
	};
}
EnhancedCombatSystem.prototype = new Skill("Enhanced Combat System");

function StormStrike()
{
	this.type = SkillType.Offensive;
	this.attackValue = 50;
	this.selfSpeedMod = 1.25;
	this.accuracy = 0.25;

	this.description = "Attacks with a lightning imbued rapier, which may increase the user’s speed.";
	this.imageURL = "characters/PirateComicStills/Pirate_StormStrike.png";
}
StormStrike.prototype = new Skill("Storm Strike");

function SingleShot()
{
	this.type = SkillType.Offensive;
	this.attackValue = 40;
	this.description = "An attack that deals extra damage to dying enemies. Finishing off an enemy this way increases speed and attack.";
	this.imageURL = "characters/PirateComicStills/Pirate_SingleShot.png";
	this.cooldown = 1;

	this.doAction = function(self, target)
	{
		var multiplier = (target[0].getHealthPct() < 0.25 ? 2 : 1)
		this.attackValue *= multiplier;

		var damage = target[0].calculateDamage(self, Game.getTypeBonus(self.type, target[0].type));
		target[0].health.base = Math.max(0, target[0].health.base - damage);	

		this.logAction(self, target[0], damage);		
		
		if(target[0].health.base == 0)
		{
			self.attack.modifier = 1.25;
			self.speed.modified = 1.25;

			this.logAction(self, self);
		}
	}	
}
SingleShot.prototype = new Skill("Single Shot");

function Parry()
{
	this.type = SkillType.Defensive;
	this.blocksDamage = true;
	this.accuracy = 0.25;
	this.description = "Takes a defensive posture to parry any incoming attacks, nullifying all damage with a chance of reflecting some back at the enemy.";
	this.cooldown = 1;
	this.imageURL = "characters/PirateComicStills/Pirate_Parry.png";

	this.doAction = function(self, target)
	{
		self.blocksDamage = this.blocksDamage;
		this.logAction(self, self);

		var r = Math.random();
		var targetAttack = target[0].getLastAttack();

		if(r <= (this.accuracy * self.accuracy.modifier) && targetAttack.type == SkillType.Offensive)
		{
			var damage = (targetAttack.attackValue * 0.25);
			target[0].health.base = Math.max(0, target[0].health.base - damage);	

			this.logAction(self, target[0], damage);
		}
	};
}
Parry.prototype = new Skill("Parry");

function Maelstrom()
{
	this.type = SkillType.Offensive;
	this.selfDamage = true;
	this.attackValue = 25;
	this.duration = 3;
	this.accuracy = 0.25;
	this.allySpeedMod = 1.25;
	this.multiTarget = true;
	this.description = "Summons a powerful storm that increases the user’s damage, may make allies faster, and will strike the healthiest enemy at the end of each turn.";
	this.cooldown = 6;
	this.imageURL = "characters/PirateComicStills/Pirate_Maelstrom.png";
	
	this.doAction = function(self, target)
	{
		this.selected = true;

		self.health.modifer = 0.75;
		self.health.duration = 1;

		var r = Math.random();
		if(r <= (this.accuracy * self.accuracy.modifier))
		{
			ally = self.getAlly()
			ally.speed.modifier = this.allySpeedMod;
			ally.health.duration = 1;
			this.logAction(self, ally);
		}

		var highest = target[0];
		for(var i = 0; i < target.length; i++)
		{
			if(target[i].health.base > highest.health.base) highest = target[i];
		}

		var damage = highest.calculateDamage(self, Game.getTypeBonus(self.type, highest.type));
		highest.health.base = Math.max(0, highest.health.base - damage);	

		this.logAction(self, highest, damage);
	};
}
Maelstrom.prototype = new Skill("Maelstrom");

function ReleaseKraken()
{
	this.type = SkillType.Offensive;
	this.attackValue = 65;
	this.oppSpeedMod = 0.75;
	this.multiTarget = true;
	this.description = "Summons the Kraken from the depths, smashing enemies with its tentacles and reducing their speed.";
	this.cooldown = 4;
	this.imageURL = "characters/PirateComicStills/Pirate_ReleaseTheKraken.png";
}
ReleaseKraken.prototype = new Skill("Release the Kraken");

function RayGun()
{
	this.type = SkillType.Offensive;
	this.attackValue = 40;
	this.stunProb = 0.1;
	this.description = "A single shot with a mysterious beam that may stun the enemy.";
	this.imageURL = "characters/AlienComicStills/Alien_Raygun_rough.png";
}
RayGun.prototype = new Skill("Ray Gun");

function Abduction()
{
	var counter = 0;
	var pos = 0;

	this.type = SkillType.Offensive;
	this.duration = 3;
	this.description = "Calls in a UFO to abduct the enemy for an instant KO, but leaves the user vulnerable for a few turns.";
	this.cooldown = 6;
	this.imageURL = "characters/AlienComicStills/Alien_Abduction_rough.png";

	this.doAction = function(self, target)
	{
		self.canMove = false;

		if(counter == 0)
		{			
			pos = target[0].position;
			this.logAction(self, self);
		}
		counter++;

		if(counter == this.duration)
		{
			//alert("Abduction elapsed!");
			if(self.health.base > 0)
			{
				var opp = self.player.getOpponent();
				var oppMerc = opp.getCharacterByPosition(pos);

				oppMerc.updateGameObject(null, self.AbductionSprite);

				var damage = oppMerc.health.base;
				oppMerc.health.base = 0;

				this.logAction(self, oppMerc, damage);
			}

			self.canMove = true;
			counter = 0;
		}
	};
}
Abduction.prototype = new Skill("Abduction");

function ForceShield()
{
	this.type = SkillType.Defensive;
	this.selfDefenceMod = 1.25;
	this.effectDuration = 5;
	this.description = "Creates a barrier that increases defence for a while.";
	this.cooldown = 5;
	this.imageURL = "characters/AlienComicStills/Alien_ForceShield_rough.png";

	this.doAction = function(self, target)
	{
		self.defence.modifier = this.selfDefenceMod;
		self.defence.duration = this.effectDuration;

		this.logAction(self, target[0]);
	}
}
ForceShield.prototype = new Skill("Force Shield");

function Telekinesis()
{
	this.type = SkillType.Offensive;
	this.description = "Uses psychic-like powers to force an enemy into the inactive position, if possible.";
	this.imageURL = "characters/AlienComicStills/Alien_Telekinesis_rough.png";

	this.doAction = function(self, target) 
	{ 
		forceRetreat(self, target[0]);	
		this.logAction(self, target[0]);
	};	
}
Telekinesis.prototype = new Skill("Telekinesis");

function Draw()
{
	this.type = SkillType.Offensive;
	this.attackValue = 40;
	this.cooldown = 1;
	this.description = "A dramatic showdown that deals double damage if it connects before the enemy attacks.";
	this.imageURL = "characters/CowboyComicStills/cg_quickdraw.png";
	
	this.doAction = function(self, target)
	{
		var sSpeed = (self.speed.base * self.speed.modifier);
		var tSpeed = (target[0].speed.base * target[0].speed.modifier);
		var r = Math.random();
		
		var multiplier = (sSpeed > tSpeed || (sSpeed == tSpeed && r > 0.5) ? 2 : 1);
		this.attackValue *= multiplier;
		
		var damage = target[0].calculateDamage(self, Game.getTypeBonus(self.type, target[0].type));
		target[0].health.base = Math.max(0, target[0].health.base - damage);	

		this.logAction(self, target[0], damage);
	}
}
Draw.prototype = new Skill("Draw");

function SixShooter()
{
	this.type = SkillType.Offensive;
	this.attackValue = 30;
	this.multiTarget = true;
	this.description = "Unloads an entire cylinder on both enemies.”";
	this.imageURL = "characters/CowboyComicStills/cb_six_shooter.png";
}
SixShooter.prototype = new Skill("Six-Shooter");

function LiquidCourage()
{
	this.type = SkillType.Defensive;
	this.cooldown = 3;
	this.effectDuration = 3;
	this.selfSpeedMod = 0.5;
	this.selfDefenceMod = 2;	
	this.description = "Take a long, strong drink. Sacrifices speed to dramatically increase defence.";
	this.imageURL = "characters/CowboyComicStills/cb_liquid_courage.png";
	
	this.doAction = function(self, target)
	{
		self.speed.modifier = this.selfSpeedMod;
		self.speed.duration = this.effectDuration;
		
		self.defence.modifier = this.selfDefenceMod;
		self.defence.duration = this.effectDuration;
	};	
}
LiquidCourage.prototype = new Skill("Liquid Courage");

function Lasso()
{
	this.type = SkillType.Offensive;
	this.description = "Hogties the enemy and whips them into the inactive position, if possible.";
	this.imageURL = "characters/CowboyComicStills/cb_lasso2.png";
		
	this.doAction = function(self, target) 
	{ 
		forceRetreat(self, target[0]);	
		this.logAction(self, target[0]);
	};	
}
Lasso.prototype = new Skill("Lasso");

function Club()
{
	this.type = SkillType.Offensive;
	this.attackValue = 60;
	this.stunProb = Probability.VeryLow;
	this.description = "A powerful blow to the head that may stun the enemy.";
	this.cooldown = 1;
}
Club.prototype = new Skill("Club");

function PoisonSpear()
{
	this.type = SkillType.Offensive;
	this.attackValue = 25;
	this.poisonProb = Probability.Medium;
	this.description = "A stab with a spear covered in toxic substances that may poison the enemy.";
}
PoisonSpear.prototype = new Skill("Poison-Tipped Spear");

function PrimalRage()
{
	this.type = SkillType.Defensive;
	this.selfAttackMod = 1.25;
	this.selfDefenceMod = 1.25;
	this.effectDuration = 3;
	this.description = "Tap into heart of survival instincts to temporarily boost attack and defence.";
	this.cooldown = 3;
	
	this.doAction = function(self, target)
	{
		self.attack.modifier = this.selfAttackMod;
		self.attack.duration = this.effectDuration;
		
		self.defence.modifier = this.selfDefenceMod;
		self.defence.duration = this.effectDuration;
		
		this.logAction(self, target[0]);
	}
}
PrimalRage.prototype = new Skill("Primal Rage");

function FireDance()
{
	this.type = SkillType.Offensive;
	this.burnProb = Probability.VeryHigh;
	this.selfDamage = true;
	this.description = "A tribal dance that burns the user in order to grant better odds of inflicting status effects. Can't be used if already burned.";
	
	this.doAction = function(self, target)
	{
		if(!self.burned)
		{
			self.setEffectIndicator(Game.StatusEffects.Burned, 0);
			self.burned = true;	
			self.health.modifier = 0.95;
			self.defence.modifier = 0.75;
			
			this.logAction(self, self);
			
			var r = Math.random();
			if(r <= this.burnProb)
			{
				target[0].setEffectIndicator(Game.StatusEffects.Burned, 0);
				target[0].burned = true;	
				target[0].health.modifier = 0.95;
				target[0].defence.modifier = 0.75;
				
				this.logAction(self, target[0], 0);
			}
		}
	};
}
FireDance.prototype = new Skill("Fire Dance");

function Sting()
{
	this.attackValue = 75;
	this.type = SkillType.Offensive;
	this.cooldown = 2;
	this.poisonProb = Probability.Medium;
	this.description = "A stabbing attack with an anatomical weapon, with a chance of poisoning the enemy.";
}
Sting.prototype = new Skill("Sting");

function Bite()
{
	this.attackValue = 25;
	this.type = SkillType.Offensive;
	this.poisonProb = Probability.High;
	this.description = "A bite with venomous fangs that is very likely to poison the enemy.";
}
Bite.prototype = new Skill("Bite");

function Exoskeleton()
{
	this.type = SkillType.Defensive;
	this.selfDefenceMod = 1.5;
	this.effectDuration = 2;
	this.description = "Hardens the outer shell to increase defence temporarily.";
}
Exoskeleton.prototype = new Skill("Exoskeleton");

function HiveMindHijack()
{
	this.type = SkillType.Offensive;
	this.cooldown = 1;
	this.description = "Manipulates a poisoned enemy into attacking either their ally or themselves if they are alone.";

	this.doAction = function(self, target)
	{
		var t = null;

		if(target[0].poisoned)
		{
			var ally = target[0].getAlly();
			var damage = 0;
			var bonus = Game.TypeBonus.None;
			var output = "";

			if(ally.active)
			{
				t = ally;
				bonus = Game.getTypeBonus(target[0].type, ally.type);

				damage = ((target[0].attack.base * target[0].attack.modifier) + 50) * bonus - (ally.defence.base * ally.defence.modifier);
				ally.health.base = Math.max(0, ally.health.base - damage);	

				output = string.format("PLAYER{0}: HIVEMIND-HIJACKED {1} attacks ALLY {2}. {3} DAMAGE.", 
					(target[0].player == Game.player1 ? "1" : "2"),
					target[0].name, 
					ally.name,
					damage
				);
			}
			else
			{
				t = target[0];
				damage = ((target[0].attack.base * target[0].attack.modifier) + 25) * bonus - (target[0].defence.base * target[0].defence.modifier);
				target[0].health.base = Math.max(0, target[0].health.base - damage);

				output = string.format("PLAYER{0}: HIVEMIND-HIJACKED {1} attacks SELF. {2} DAMAGE.", 
					(target[0].player == Game.player1 ? "1" : "2"),
					target[0].name, 
					damage
				);
			}
			
			this.logAction(self, t, damage);
			Game.BattleLog.write(output);
		}
	};
}
HiveMindHijack.prototype = new Skill("Hivemind Hijack");

function DeathRay()
{
	this.attackValue = 70;
	this.type = SkillType.Offensive;
	this.cooldown = 1;
	this.burnProb = Probability.Low;
	this.description = "A powerful energy beam using advanced technology that may burn the enemy.";
}
DeathRay.prototype = new Skill("Death Ray");

function BlastOff()
{
	this.attackValue = 50;
	this.type = SkillType.Offensive;
	this.multiTarget = true;	
	this.burnProb = Probability.Low;
	this.blocksDamage = true;
	this.duration = 3;
	this.description = "Leaves the battlefield temporarily in a rocket ship, damaging the enemy on both liftoff and re-entry.";

	var counter = 0;
	var defaultState = null;

	this.doAction = function(self, target)
	{
		this.selected = true;

		var r = Math.random();
		var damage = 0;		

		self.canMove = (counter == 2);
		self.blocksDamage = true;

		if(counter == 0 || counter == 2)
		{
			if(counter == 0)
			{
				for(var i in self.state)
				{
					if(self.state[i].img == self.activeSprite) 
					{
						defaultState = self.state[i];
						break;
					}
				}
				self.updateGameObject(null, self.state.BLAST_OFF);
			}
			if(counter == 2)
			{	
				self.updateGameObject(null, defaultState);
			}

			for(var i = 0; i < target.length; i++)
			{
				damage = target[i].calculateDamage(self, Game.getTypeBonus(self.type, target[i].type));
				target[i].health.base = Math.max(0, target[i].health.base - damage);
				
				if(r <= this.burnProb)
				{
					target[i].setEffectIndicator(Game.StatusEffects.Burned, 0);
					target[i].burned = true;	
					target[i].health.modifier = 0.95;
					target[i].defence.modifier = 0.75;
				}

				this.logAction(self, target[i], damage);
			}
		}
		counter++;
	};
}
BlastOff.prototype = new Skill("Blast Off!");

function Jetpack()
{
	this.type = SkillType.Defensive;
	this.selfSpeedMod = 1.5;
	this.effectDuration = 3;
	this.description = "Uses the power of advanced thrust mechanics to increase the user's speed temporarily.";

	this.doAction = function(self, target)
	{
		self.speed.modifier = this.selfSpeedMod;
		self.speed.duration = this.effectDuration;

		this.logAction(self, target[0]);
	};
}
Jetpack.prototype = new Skill("Jetpack");

function GravityGun()
{
	this.type = SkillType.Offensive;
	this.oppSpeedMod = 0.5;
	this.effectDuration = 3;
	this.description = "Bombards the enemy with gravitons to make them heavier, lowering their speed significantly.";

	this.doAction = function(self, target)
	{
		target[0].speed.modifier = this.oppSpeedMod;
		target[0].speed.duration = this.effectDuration;

		this.logAction(self, target[0], 0);
	};
}
GravityGun.prototype = new Skill("Gravity Gun");

function Hex()
{
	this.attackValue = 80;
	this.type = SkillType.Offensive;
	this.description = "An aggressive spell with nothing but pure malice behind it.";
	this.imageURL = "characters/WitchComicStills/Hex.png";
}
Hex.prototype = new Skill("Hex");

function Curse()
{
	this.attackValue = 50;
	this.type = SkillType.Offensive;
	this.randomDebuffProb = Probability.Medium;
	this.description = "A bitter curse that wishes harm and affliction against the enemy.";
}
Curse.prototype = new Skill("Curse");

function Blessing()
{
	this.type = SkillType.Defensive;
	this.selfDefenceMod = 1.25;
	this.allyDefenceMod = 1.25;
	this.effectDuration = 3;
	this.affectsAlly = true;
	this.multiTarget = true;
	this.description = "A benevolent spell that helps protect self and allies by increasing defence temporarily.";

	this.doAction = function(self, target)
	{
		target[0].defence.modifier = this.selfDefenceMod;
		target[0].defence.duration = this.effectDuration;
		this.logAction(self, target[0]);

		target[1].defence.modifier = this.allyDefenceMod;
		target[1].defence.duration = this.effectDuration;
		this.logAction(self, target[1]);
	};

}
Blessing.prototype = new Skill("Blessing");

function PoisonApple()
{
	this.attackValue = -50;
	this.type = SkillType.Offensive;
	this.poisonProb = 0.5;
	this.description = "Offers the enemy a cursed apple, which can either harm or heal them.";

	this.doAction = function(self, target)
	{
		var r = Math.random();

		if(r <= this.poisonProb)
		{
			target[0].setEffectIndicator(Game.StatusEffects.Poisoned, 0);
			target[0].poisoned = true;	
			target[0].health.modifier = 0.9;
			
			this.logAction(self, target[0], 0);
		}
		else
		{
			target[0].health.base = Math.max(0, target[0].health.base - this.attackValue);	

			this.logAction(self, target[0], this.attackValue);
		}
	};
}
PoisonApple.prototype = new Skill("Poison Apple");

function SeltzerBottle() 
{
	this.type = SkillType.Offensive;
	this.attackValue = 10;
	this.description = "Sprays water at the enemy. May do serious damage if it hits the opponent in the eye.";

	this.doAction = function(self, target)
	{
		this.attackValue = (Math.random() <= 0.01 ? 110 : 10);

		var damage = target[0].calculateDamage(self, Game.getTypeBonus(self.type, target[0].type));
		target[0].health.base = Math.max(0, target[0].health.base - damage);
		
		this.logAction(self, target[0], damage);
	};
}
SeltzerBottle.prototype = new Skill("Seltzer Bottle");

function ExplodingPie()
{
	this.type = SkillType.Offensive;
	this.attackValue = 50;
	this.multiTarget = true;
	this.selfDamage = true;
	this.description = "A classic piece of cartoonish slapstick that damages both the user and the enemy.";
	
	this.doAction = function(self, target)
	{
		self.health.base = Math.max(0, self.health.base - this.attackValue);
		
		var damage = 0;
		for(var i = 0; i < target.length; i++)
		{
			damage = target[i].calculateDamage(self, Game.getTypeBonus(self.type, target[i].type));
			target[i].health.base = Math.max(0, target[i].health.base - damage);
			this.logAction(self, target[i], damage);
		}
	};
}
ExplodingPie.prototype = new Skill("Exploding Pie");

function BalloonAnimal()
{
	this.type = SkillType.Defensive;
	this.description = "The user taps into the power of latex creatures to raise all stats by 0%.";
}
BalloonAnimal.prototype = new Skill("Balloon Animal");

function Honk()
{
	this.type = SkillType.Reusable;
	this.description = "Makes a funny noise. Honk! Honk!";
}
Honk.prototype = new Skill("Honk");

function TailWhip()
{
	this.type = SkillType.Offensive;
	this.attackValue = 100;
	this.cooldown = 1;
	this.accuracy = 0.5;
	this.description = "A powerful bludgeoning attack with a significant chance of missing.";
}
TailWhip.prototype = new Skill("Tail Whip");

function Snarl()
{
	this.type = SkillType.Defensive;
	this.selfAttackMod = 1.5;
	this.selfDefenceMod = 1.5;
	this.effectDuration = 3;
	this.description = "Tap into primal aggression to temporarily raise attack and defence.";
	
	this.doAction = function(self, target)
	{
		self.attack.modifier = this.selfAttackMod;
		self.attack.duration = this.effectDuration + 1;
		
		self.defence.modifier = this.selfDefenceMod;
		self.defence.duration = this.effectDuration;
		
		this.logAction(self, target[0]);
	};
}
Snarl.prototype = new Skill("Snarl");

function HeatVision()
{
	this.type = SkillType.Defensive;
	this.effectDuration = 2;
	this.description = "Adjusts the user’s eyes to focus on their prey better, reducing likelihood of missing.";
	
	this.doAction = function(self, target)
	{
		self.accuracy.modifier = 10;
		self.accuracy.duration = this.effectDuration;		
		this.logAction(self, target[0]);
	};
}
HeatVision.prototype = new Skill("Heat Vision");

function RippingClaws()
{
	this.type = SkillType.Offensive;
	this.attackValue = 75;
	this.accuracy = 0.5;
	this.cooldown = 1;
	this.description = "A devastating attack with powerful claws which may cause bleeding, with a significant chance of missing.";
}
RippingClaws.prototype = new Skill("Ripping Claws");

function YokoGiri()
{
	this.type = SkillType.Offensive;
	this.attackValue = 30;
	this.multiTarget = true;
	this.bleedProb = Probability.High;
	this.description = "A horizontal slash at both enemies with a significant chance of causing bleeding.";
	
	this.doAction = function(self, target)
	{
		var r = Math.random();
		var probMod = (self.checkActiveHistory(Nukitsuke) ? 2 : 1);		
		var damage = 0;
		
		for(var i = 0; i < target.length; i++)
		{
			if(r <= (this.burnProb * probMod))
			{
				target[i].setEffectIndicator(Game.StatusEffects.Bleeding, 0);
				target[i].bleeding = true;
				target[i].health.modifier = 0.85;
			}
			
			damage = target[i].calculateDamage(self, Game.getTypeBonus(self.type, target[i].type));
			target[i].health.base = Math.max(0, target[i].health.base - damage);
			this.logAction(self, target[i], damage);
		}
	};
}
YokoGiri.prototype = new Skill("Yoko Giri");

function KesiGiri()
{
	this.type = SkillType.Offensive;
	this.attackValue = 60;
	this.bleedProb = Probability.Medium;
	this.description = "A diagonal strike at a lone target with a significant chance of causing bleeding.";
	
	this.doAction = function(self, target)
	{
		var r = Math.random();
		var probMod = (self.checkActiveHistory(Nukitsuke) ? 2 : 1);		
	
		if(r <= (this.bleedProb * probMod))
		{
			target[0].setEffectIndicator(Game.StatusEffects.Bleeding, 0);
			target[0].bleeding = true;
			target[0].health.modifier = 0.85;
		}

		var damage = target[0].calculateDamage(self, Game.getTypeBonus(self.type, target[0].type));
		target[i].health.base = Math.max(0, target[0].health.base - damage);
		this.logAction(self, target[0], damage);
	};
}
KesiGiri.prototype = new Skill("Kesi Giri");

function OverheadCut()
{
	this.type = SkillType.Offensive;
	this.attackValue = 90;
	this.cooldown = 2;
	this.description = "A powerful, two-handed vertical slashing attack.";
}
OverheadCut.prototype = new Skill("Overhead Cut");

function Nukitsuke()
{
	this.type = SkillType.Defensive;
	this.selfDefenceMod = 1.5;
	this.description = "Assume an intimidating position that increases attack and makes causing bleeding more likely.";
}
Nukitsuke.prototype = new Skill("Nukitsuke");
