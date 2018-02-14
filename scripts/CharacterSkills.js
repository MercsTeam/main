function Retreat()
{
	this.type = SkillType.Reusable;
	this.description = "Causes character to rotate into inactive position.";
	this.duration = 0;

	this.doAction = function(player, pos)
	{
		var c1 = player.getCharacterByPosition(1);
		var c2 = player.getCharacterByPosition(2);
		var c3 = player.getCharacterByPosition(3);

		if(c3.active)
		{
			c3.retreat = false;

			Game.BattleLog.write(string.format("PLAYER{0}: {1} retreats!", 
				(player == Game.player1 ? 1 : 2), 
				player.getCharacterByPosition(pos).name
			));
			
			if(pos == 1)
			{
				c1.position = 3;
				c1.canMove = false;

				c2.position = 1;
				c2.canMove = true;
				
				c3.position = 2;
				c3.canMove = true;

				if(c2.burned)
				{
					c2.health.modifier = 0.90;
					c2.defence.modifier = 0.5;
				}
			}
			else
			{
				c1.position = 2;
				c1.canMove = true;

				c3.position = 1;
				c3.canMove = true;

				c2.position = 3;
				c2.canMove = false;

				if(c1.burned)
				{
					c1.health.modifier = 0.90;
					c1.defence.modifier = 0.5;
				}
			}
			
			var p = 0, coords = null;
			for(var i = 0; i < player.characters.length; i++)
			{
				p = player.characters[i].position;
				coords = player.characterCoords[(p == 1 ? "First" : (p == 2 ? "Second" : "Third"))];
				player.characters[i].updateGameObject(coords);	
			}			
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
		retreat.doAction(opp, target.position);
		retreat.logAction(self, target, 0);
	}
}

function SwordChop()
{
    this.type = SkillType.Offensive;
    this.attackValue = 70;
    this.description = "Single target attack that deals damage.";
	this.imageURL = "characters/BSGComicStills/FRONT-Sword_Chop.jpg";
	this.soundID = "swordChop";
}
SwordChop.prototype = new Skill("Sword Chop");

function SweepingStrike()
{
    this.type = SkillType.Offensive;
    this.attackValue = 50;
    this.description = "AoE attack hitting both active enemy mercs.";
    this.multiTarget = true;
	this.cooldown = 1;
	this.imageURL = "characters/BSGComicStills/FRONT-Sweeping_Strike.jpg";
}
SweepingStrike.prototype = new Skill("Sweeping Strike");

function DefensiveStance()
{
    this.type = SkillType.Defensive;
    this.description = "Blocks incoming damage for the round.";
    this.blocksDamage = true;
	this.cooldown = 1;
	this.imageURL = "characters/BSGComicStills/FRONT-Defensive_Stance.jpg";
}
DefensiveStance.prototype = new Skill("Defensive Stance");

function Focus()
{
    this.type = SkillType.Reusable;
    this.selfAttackMod = 1.5;
    this.description = "Strengthens the attack stat (+50%) until Artur Hobbe is swapped to an inactive state, or dies.";
	this.cooldown = 1;
	this.imageURL = "characters/BSGComicStills/FRONT-Focus.jpg";
}
Focus.prototype = new Skill("Focus");

function Headshot()
{
    this.type = SkillType.Offensive;
    this.attackValue = 100;
    this.accuracy = 0.4;
    this.description = "High damage single-target attack, with a high chance (60%) of missing.";
	this.imageURL = "characters/SniperGirlComicStills/SG-Headshot.jpg";

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
    this.description = "Medium damage to both frontline targets. Very high chance (80%) of missing. Critical hit results in Penetrating Shot that causes bleeding.";
	this.imageURL = "characters/SniperGirlComicStills/SG-Ricochet.jpg";
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
    this.description = "Increases accuracy for next turn (reduces chance of missing by 50%)";
	this.imageURL = "characters/SniperGirlComicStills/SG-TakeAim.jpg";

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
    this.description = "Become harder to hit (50% chance attacks will miss) for next three turns. Effect is lost when Headshot or Ricochet Shot is used.";
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
    this.description = "Medium damage single-target attack. Low chance of causing burn.";
}
Fireball.prototype = new Skill("Fireball");

function LightningStorm()
{
    this.type = SkillType.Offensive;
    this.attackValue = 30;
    this.multiTarget = true;
    this.stunProb = Probability.Low;
    this.description = "Low damage to both frontline targets. Low chance of causing Stun.";
}
LightningStorm.prototype = new Skill("Lightning Storm");

function DivineShield()
{
    this.type = SkillType.Defensive;
    this.blocksDamage = true;
    this.description = "Prevents next attack from damaging work. Cannot be used twice in a row by same merc.";
	this.cooldown = 1;
}
DivineShield.prototype = new Skill("Divine Shield");

function PoolMana()
{
    this.type = SkillType.Reusable;
    this.selfAttackMod = 1.5;
	this.effectDuration = 2;
    this.description = "Increases attack power significantly (+50%) for next turn.";
	this.cooldown = 1;
	
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
    this.description = "Calls down a single bolt of lightning, deals low damage but has a chance to interrupt the target.";
}
LightningStrike.prototype = new Skill("Lightning Strike");

function CloudBarrier()
{
    this.type = SkillType.Defensive;
    this.selfDefenseMod = 1.25;
    this.selfImmunity = true;
    this.description = "Surrounds himself in protective clouds, increasing defence (+25%) and receives the immunity buff.";
}
CloudBarrier.prototype = new Skill("Cloud Barrier");

function Confidence()
{
	this.type = SkillType.Defensive;
	this.duration = 2;
	this.blocksDamage = true;
	this.selfImmunity = true;
	this.description = "creates a physical embodiment of his own confidence to act as a barrier, blocking incoming "
		+ "attacks and grants immunity for 2 turns.";
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
    this.description = "Summons high winds across the battlefield, increasing the speed of allies(+50%) and reducing the speed of enemies (-50%). Lasts 3-5 rounds.";

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
    this.type = SkillType.Offensive;
    this.allyAttackMod = 1.25;
    this.allyDefenseMod = 1.25;
    this.allySpeedMod = 1.25;
    this.allyImmunity = true;
    this.allyHealthAdd = 25;
	this.affectAlly = true;
    this.description = "Grants an ally increased attack, defence, speed, (+25%) immunity, and minor healing (+25 HP).";
	this.cooldown = 3;
}
Wish.prototype = new Skill("Wish");

function IntegratedBattleSystem()
{
    this.type = SkillType.Offensive;
    this.attackValue = 50;
    this.randomDebuffProb = 0.25;
    this.description = "Deals medium damage and has a chance to apply a random debuff (-25%) to the target.";
}
IntegratedBattleSystem.prototype = new Skill("Integrated Battle System");

function ElectronicBarrier()
{
    this.type = SkillType.Reusable;
    this.multiTarget = true;
    this.oppAttackMod = 0.8;
    this.description = "Deploy a large energy barrier. Reduces the effectiveness of incoming attacks for both active mercs.";
	this.cooldown = 1;

	this.doAction = function(self, target)
	{
		var opp = self.player.getOpponent();
		var oppMerc;

		for(var i = 1; i <= 2; i++)
		{
			oppMerc = opp.getCharacterByPosition(i);

			if(oppMerc.target == self.position)
			{
				oppMerc.accuracy.modifier = 0.5;
				oppMerc.accuracy.duration = 1;
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
    this.description = "Repairs damage to his armour, and adapts it to the situation. This skill regenerates a moderate amount of HP (+50 HP) over two turns, and increases defence (+10%) with each use.";
	this.cooldown = 2;

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
	this.description = "50% total health loss to gain 200% increase for attack.";
	this.cooldown = 2;
	
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

	this.description = "Attacks with a lightning imbued rapier, this attack has a chance to increase the user's speed.";
	this.imageURL = "characters/PirateComicStills/Pirate_StormStrike.png";
}
StormStrike.prototype = new Skill("Storm Strike");

function SingleShot()
{
	this.type = SkillType.Offensive;
	this.attackValue = 40;
	this.description = "Fires a bullet at a single target that deals double damage to targets below 25% health.  When this skill results in the death of an enemy, the speed and attack are increased.";
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
	this.description = "Takes a defensive posture to parry any incoming attacks. Incoming attacks are ineffective, and has a 25% chance to reflect 25% of the damage back at the attacker.";
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
	this.description = "Summons a powerful storm that lasts for 3 turns. While maelstrom is active, pirate's damage is increased, the attacks of all allied mercs have a chance to increase the speed stat, "
		+ "and at the end of each turn the maelstrom is active, the enemy merc with the highest percentage of health is struck by lightning and dealt damage";
	this.cooldown = 6;
	this.imageURL = "characters/PirateComicStills/Pirate_Maelstrom.png";
	
	this.doAction = function(self, target)
	{
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
	this.description = "Summons the Kraken from the depths, smashing enemy active mercs with its large tentacles "
		+ "dealing damage and reducing their speed by 25%.";
	this.cooldown = 4;
}
ReleaseKraken.prototype = new Skill("Release the Kraken");

function RayGun()
{
	this.type = SkillType.Offensive;
	this.attackValue = 40;
	this.stunProb = 0.1;
	this.description = "A low-damage, single target attack with a small (10%) chance of causing stun.";
}
RayGun.prototype = new Skill("Ray Gun");

function Abduction()
{
	var counter = 0;
	var pos = 0;

	this.type = SkillType.Offensive;
	this.duration = 3;
	this.description = "User is unable to move for 3 turns and cannot be swapped out. If user is not KO'd by the end of the 3rd turn, "
		+ "whichever enemy is in the targeted space is abducted and instantly KO'd, regardless of status effects.";
	this.cooldown = 6;

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
	this.description = "Increases defense by 25% for 5 turns.";
	this.cooldown = 5;

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
	this.description = "Forces enemy to swap their mercs if all three enemies are alive; if this attack hits first, the merc swapped to inactive loses their turn. "
		+ "If at least one enemy merc is KO'd, this attack does nothing.";

	this.doAction = function(self, target) { forceRetreat(self, target[0]);	};	
}
Telekinesis.prototype = new Skill("Telekinesis");

function Draw()
{
	this.type = SkillType.Offensive;
	this.attackValue = 40;
	this.cooldown = 1;
	this.description = "If attack hits before the target has attacks, double damage dealt.";
	
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
	this.description = "Deals low damage to both frontline targets.";
}
SixShooter.prototype = new Skill("Six-Shooter");

function LiquidCourage()
{
	this.type = SkillType.Defensive;
	this.cooldown = 3;
	this.effectDuration = 3;
	this.selfSpeedMod = 0.5;
	this.selfDefenceMod = 2;
	
	this.description = "Liquid Courage: Speed is reduced by 50%, and defense is boosted 100% for 3 turns.";
	
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
	this.description = "Forces enemy to swap their mercs if all three enemy mercs are alive; if this attack hits first, "
		+ "the merc swapped to inactive loses their turn. If at least one enemy merc is KO'd, this attack does "
		+ "nothing.";	
	this.doAction = function(self, target) { forceRetreat(self, target[0]);	};	
}
Lasso.prototype = new Skill("Lasso");

function Club()
{
	this.type = SkillType.Offensive;
	this.attackValue = 60;
	this.stunProb = Probability.VeryLow;
	this.description = "A medium-high damage, single-target attack. Very low chance of causing stun.";
	this.cooldown = 1;
}
Club.prototype = new Skill("Club");

function PoisonSpear()
{
	this.type = SkillType.Offensive;
	this.attackValue = 25;
	this.poisonProb = Probability.Medium;
	this.description = "A low-damage, single-target attack with a medium chance of causing Poison.";
}
PoisonSpear.prototype = new Skill("Poison-Tipped Spear");

function PrimalRage()
{
	this.type = SkillType.Defensive;
	this.selfAttackMod = 1.25;
	this.selfDefenceMod = 1.25;
	this.effectDuration = 3;
	this.description = "Boosts attack and defense by 25% for three turns.";
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
	this.description = "Inflict Burn on self. Dramatically increases odds of inflicting status effects. Cannot be "
		+ "used if user already has burn.";
	
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
	this.description ="A high-damage, single-target attack with a medium chance of causing Poison.";
}
Sting.prototype = new Skill("Sting");

function Bite()
{
	this.attackValue = 25;
	this.type = SkillType.Offensive;
	this.poisonProb = Probability.High;
	this.description = "A low-damage, single-target attack with a high chance of causing Poison.";
}
Bite.prototype = new Skill("Bite");

function Exoskeleton()
{
	this.type = SkillType.Defensive;
	this.selfDefenceMod = 1.5;
	this.effectDuration = 2;
	this.description = "Boosts Defense by 50% for 2 turns.";
}
Exoskeleton.prototype = new Skill("Exoskeleton");

function HiveMindHijack()
{
	this.type = SkillType.Offensive;
	this.cooldown = 1;
	this.description = "If poisoned, target will be forced to attack their ally with a medium-damage (50) attack. "
		+ "If target does not have an ally, target will attack themselves with a low-damage (25) attack.";
	this.doAction = function(self, target)
	{
		this.logAction(self, target[0], 0);

		if(target[0].poisoned)
		{
			var ally = target[0].getAlly();
			var damage = 0;
			var bonus = Game.TypeBonus.None;
			var output = "";

			if(ally.active)
			{
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
				damage = ((target[0].attack.base * target[0].attack.modifier) + 25) * bonus - (target[0].defence.base * target[0].defence.modifier);
				target[0].health.base = Math.max(0, target[0].health.base - damage);

				output = string.format("PLAYER{0}: HIVEMIND-HIJACKED {1} attacks SELF. {2} DAMAGE.", 
					(target[0].player == Game.player1 ? "1" : "2"),
					target[0].name, 
					damage
				);
			}
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
	this.description = "A high-damage, single-target attack with a low chance of causing Burn.";
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
	this.desription = "Does medium damage to both targets, with a low chance of causing burn. User cannot move or be attacked next turn. User returns to battle on the turn after, "
		+ "dealing medium damage to both targets and has a low chance of causing burn. NOTE: Player cannot rotate between blast off and re-entry.";

	var counter = 0;

	this.doAction = function(self, target)
	{
		var r = Math.random();
		var damage = 0;

		counter++;

		self.canMove = (counter == 3);
		self.blocksDamage = (counter == 1);

		if(counter == 1 || counter == 3)
		{
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
	};
}
BlastOff.prototype = new Skill("Blast Off!");

function Jetpack()
{
	this.type = SkillType.Defensive;
	this.selfSpeedMod = 1.5;
	this.effectDuration = 3;
	this.description = "Increases Speed by 50% for 3 turns.";

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
	this.description = "Lowers target speed by 50% for 3 turns.";

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
	this.description = "A high-damage, single-target attack.";
}
Hex.prototype = new Skill("Hex");

function Curse()
{
	this.attackValue = 50;
	this.type = SkillType.Offensive;
	this.randomDebuffProb = Probability.Medium;
	this.description = "A medium damage, single-target attack with a medium chance of causing a random status effect (Burn, Stun, or Poison)";
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
	this.description = "Increase Defense of self and ally by 25% for 3 turns.";

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
	this.description = "Has a 50-50 chance of either causing poison, or healing 50 HP.";

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