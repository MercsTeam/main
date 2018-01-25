function Retreat()
{
	this.type = SkillType.Reusable;
	this.description = "Causes character to rotate into inactive position.";

	this.doAction = function(player, pos)
	{
		var c1 = player.getCharacterByPosition(1);
		var c2 = player.getCharacterByPosition(2);
		var c3 = player.getCharacterByPosition(3);

		if(c3.active)
		{
			gameLog.write(string.format("PLAYER{0}: {1} retreats!", 
				(player == player1 ? 1 : 2), 
				player.getCharacterByPosition(pos).name
			));
			
			if(pos == 1)
			{
				c1.position = 3;
				c2.position = 1;
				c3.position = 2;

				if(c2.burned)
				{
					c2.health.modifier = 0.90;
					c2.defence.modifier = 0.5;
				}
			}
			else
			{
				c1.position = 2;
				c2.position = 3;
				c3.position = 1;

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

function SwordChop()
{
    this.type = SkillType.Offensive;
    this.attackValue = 70;
    this.description = "Single target attack that deals damage.";
	this.imageURL = "characters/BSGComicStills/FRONT-Sword_Chop.jpg";
}
SwordChop.prototype = new Skill("Sword Chop");

function SweepingStrike()
{
    this.type = SkillType.Offensive;
    this.attackValue = 50;
    this.description = "AoE attack hitting both active enemy mercs.";
    this.multiTarget = true;
	this.imageURL = "characters/BSGComicStills/FRONT-Sweeping_Strike.jpg";
}
SweepingStrike.prototype = new Skill("Sweeping Strike");

function DefensiveStance()
{
    this.type = SkillType.Defensive;
    this.description = "Blocks incoming damage for the round.";
    this.blocksDamage = true;
	this.imageURL = "characters/BSGComicStills/FRONT-Defensive_Stance.jpg";
}
DefensiveStance.prototype = new Skill("Defensive Stance");

function Focus()
{
    this.type = SkillType.Reusable;
    this.selfAttackMod = 1.5;
    this.description = "Strengthens the attack stat (+50%) until Artur Hobbe is swapped to an inactive state, or dies.";
	this.imageURL = "characters/BSGComicStills/FRONT-Focus.jpg";
}
Focus.prototype = new Skill("Focus");

function Headshot()
{
    this.type = SkillType.Offensive;
    this.attackValue = 100;
    this.accuracy = 0.4;
    this.description = "High damage single-target attack, with a high chance (60%) of missing.";
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
}
RicochetShot.prototype = new Skill("Ricochet Shot");

function TakeAim()
{
    this.type = SkillType.Reusable;
    this.selfAccuracyMod = 1.5;
    this.description = "Increases accuracy for next turn (reduces chance of missing by 50%)";
}
TakeAim.prototype = new Skill("Take Aim");

function Camouflage()
{
    this.type = SkillType.Defensive;
    this.oppAccuracyMod = 0.5;
    this.duration = 3;
    this.description = "Become harder to hit (50% chance attacks will miss) for next three turns. Effect is lost when Headshot or Ricochet Shot is used.";

	this.doAction = function(self, target)
	{
		//to do
	}
}
Camouflage.prototype = new Skill("Camouflage");

function Fireball()
{
    this.type = SkillType.Offensive;
    this.attackValue = 50;
    this.burnProb = 0.33;
    this.description = "Medium damage single-target attack. Low chance of causing burn.";
}
Fireball.prototype = new Skill("Fireball");

function LightningStorm()
{
    this.type = SkillType.Offensive;
    this.attackValue = 30;
    this.multiTarget = true;
    this.stunProb = 0.33;
    this.description = "Low damage to both frontline targets. Low chance of causing Stun.";
}
LightningStorm.prototype = new Skill("Lightning Storm");

function DivineShield()
{
    this.type = SkillType.Defensive;
    this.blocksDamage = true;
    this.repeatable = false;
    this.description = "Prevents next attack from damaging work. Cannot be used twice in a row by same merc.";
}
DivineShield.prototype = new Skill("Divine Shield");

function PoolMana()
{
    this.type = SkillType.Reusable;
    this.selfAttackMod = 1.5;
    this.description = "Increases attack power significantly (+50%) for next turn.";
}
PoolMana.prototype = new Skill("Pool Mana");

function LightningStrike()
{
    this.type = SkillType.Offensive;
    this.attackValue = 25;
    this.stunProb = 0.8;
    this.description = "Calls down a single bolt of lightning, deals low damage but has a chance to stun.";
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

function HighWinds()
{
    this.type = SkillType.Reusable;
    this.allySpeedMod = 1.5;
    this.oppSpeedMod = 0.5;
    this.duration = 4;
	this.multiTarget = true;
	this.affectAlly = true;
    this.description = "Summons high winds across the battlefield, increasing the speed of allies(+50%) and reducing the speed of enemies (-50%). Lasts 3-5 rounds.";

	this.doAction = function(self, target)
	{
		self.getAlly().speed.modifier = this.allySpeedMod;
		self.getAlly().speed.duration = this.duration;

		for(var i = 0; i < target.length; i++) 
		{
			target[i].speed.modifier = this.oppSpeedMod;
			target[i].speed.duration = this.duration;
		}
	};
}
HighWinds.prototype = new Skill("High Winds");

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
}
ElectronicBarrier.prototype = new Skill("Electronic Barrier");

function NanobotRepairs()
{
    this.type = SkillType.Defensive;
    this.selfHealthAdd = 50;
    this.selfDefenseMod = 1.1;
    this.duration = 2;
    this.description = "Repairs damage to his armour, and adapts it to the situation. This skill regenerates a moderate amount of HP (+50 HP) over two turns, and increases defence (+10%) with each use.";

	this.doAction = function(self, target)
	{
		self.health.base += 50;

		self.defence.modifier = 1.1;
		self.defence.duration = 2;
	}
}
NanobotRepairs.prototype = new Skill("Nanobot Repairs");

function PassiveEffect()
{
    this.type = SkillType.Offensive;
    this.selfAttackMod = 1.5;
    this.selfSpeedMod = 1.5;
    this.description = "Emergency Systems Engage: When below 20% HP, Attack and Speed is greatly increased (+50%). Effect ends if HP rises above 20%.";
    
    this.setActive = function(hp)
    {
        active = (hp < 20 ? true : false);
    };

	this.doAction = function(self, target)
	{
		//to do
	}
}
PassiveEffect.prototype = new Skill("Passive Effect");

function StormStrike()
{
	this.type = SkillType.Offensive;
	this.attackValue = 50;
	this.selfSpeedMod = 1.25;
	this.accuracy = 0.25;
}
StormStrike.prototype = new Skill("Storm Strike");

function SingleShot()
{
	this.type = SkillType.Offensive;
	this.attackValue = 40;

	this.doAction = function(self, target)
	{
		if(target.getHealthPct() < 0.25)
		{
			this.attackValue *= 2;
		}

		target.health.base = Math.max(0, target.calculateDamage(self, getTypeBonus(self.type, target.type)));
		if(target.health.base == 0)
		{
			self.attack.modifier = 1.25;
			self.speed.modified = 1.25;
		}
	}	
}
SingleShot.prototype = new Skill("Single Shot");

function Parry()
{
	this.type = SkillType.Defensive;
	this.blocksDamage = true;
	this.accuracy = 0.25;

	this.doAction = function(self, target)
	{
		self.blocksDamage = this.blocksDamage;

		var r = Math.random();
		var targetAttack = target.getLastAttack();

		if(r <= this.accuracy && targetAttack.type == SkillType.Offensive)
		{
			target.health.base -= (targetAttack.attackValue * 0.25);
		}
	};
}
Parry.prototype = new Skill("Parry");


function Maelstrom()
{
	this.type = SkillType.Reusable;
	this.duration = 3;
	this.accuracy = 0.25;
	this.allySpeedMod = 1.25;
	this.multiTarget = true;
	
	this.doAction = function(self, target)
	{
		self.health.modifer = 0.75;		

		var r = Math.random();
		if(r <= this.accuracy)
		{
			ally = self.getAlly()
			ally.speed.modifier = this.allySpeedMod;
			ally.health.duration = this.duration;
		}

		var h = target[0];
		for(var i = 0; i < target.length; i++)
		{
			if(target[i].health.base > h.health.base) h = target[i];
		}
		h.health.base -= 25;
	};
}
Maelstrom.prototype = new Skill("Maelstrom");

