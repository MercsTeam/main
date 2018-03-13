function Dynaman()
{
    this.name = "DYNAMAN";
	this.realName = "Kurt Clarence, aka Lar-M";
    this.image = "dynaman.png";
    this.type = CharacterType.Physical;
	this.alignment = "Good";
	this.isBonus = true;

    this.skills = [ new DynaPunch(), new LaserVision(), new DynaSpeed(), new DynaBreath(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "dynaman_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "dynaman_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 225, modifier : 1.0  };
	this.defaultHealth = 225;
    
	this.defence = { base : 68, modifier : 1.0, duration : -1 };
    this.attack = { base : 60, modifier : 1.0, duration : -1 };
    this.speed = { base : 158, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "";
    this.backstory = "Kurt Clarence once believed that he was a normal person who had been adopted and raised by simple Saskatchewan farmers.  He pursued a career in journalism and this eventually led to a job with a major metropolitan TV station.  "
		+ "Kurt's investigation of numerous political scandals made him a famous and respected man, but a near fatal accident revealed to him that he was not human at all!  Kurt was in fact an alien with abilities far beyond those of mortal men and "
		+ "suspected that he might have been the last of his race, propelled to safety from his planet's annihilation.  He decided to use his abilities for the benefit of Canada and all mankind as the super-hero Dynaman! "
		+ "Dynaman would later discover that almost everything he believed about himself was a lie.  None of his memories prior to arriving in Toronto were real, they had all been implanted into his mind along with the persona of Kurt Clarence prior "
		+ "to arriving on Earth.  He was a sleeper agent, one of thousand that the militant Klyptonians seeded on a thousand different worlds.  Each was to gain a position of trust or authority in their target world, the better to facilitate its "
		+ "surrender when the Klyptonians finally invaded.  The native facade was supposed to endure until a predetermined signal activated his real persona, that of a ruthless Klyptonian soldier named Vell-Mar. "
		+ "The accident which had uncovered his powers had also prematurely uncovered the alien persona.  Dynaman rejected his alien heritage and embraced humanity, vowing to defeat the Klyptonians if they ever attempted to invade.  Fortunately, that "
		+ "would never come to pass, as Klypton actually had been destroyed by an intergalactic alliance of races they had oppressed for thousands of years. "
		+ "Later in his career, Dynaman encountered the Questors, a group of super-heroes from a future alternate-Earth who were doing battle with his older counterpart who had become a villain known as Dominion.  Although they possessed the same "
		+ "abilities, Dominion was considerably more ruthless and experienced, and would have defeated him without the help of the surviving members of the RCLH.";
	
	this.damageImage = "characters/DynamanComicStills/Dynaman_Damage.png";
	this.defeatImage = "characters/DynamanComicStills/Dynaman_Defeat.png";
}
Dynaman.prototype = new Character();

function DynaPunch()
{
	this.type = SkillType.Offensive;
	this.attackValue = 75;
	this.description = "Super-strength powered punch inflicts high damage against opponent.";
	this.imageURL = "characters/DynamanComicStills/Dynaman_DynaPunch.png";
	this.soundID = "dynaPunch";
}
DynaPunch.prototype = new Skill("Dyna-Punch");

function LaserVision()
{
	this.type = SkillType.Offensive;
	this.attackValue = 150;
	this.cooldown = 3;
	this.description = "Projects laser beams from eyes to inflict extreme damage against opponent.";
	this.imageURL = "characters/DynamanComicStills/Dynaman_LaserVision.png";
	this.soundID = "laserVision";
}
LaserVision.prototype = new Skill("Laser Vision");

function DynaSpeed()
{
	this.type = SkillType.Reusable;
	this.selfSpeedMod = 2;
	this.effectDuration = 3;
	this.cooldown = 3;
	this.description = "Doubles speed for three rounds.";
	this.imageURL = "characters/DynamanComicStills/Dynaman_DynaSpeed.png";
	this.soundID = "dynaSpeed";

	this.doAction = function(self, target)
	{
		self.speed.modifier = this.selfSpeedMod;
		self.speed.duration = this.effectDuration;

		this.logAction(self, target);
	};
}
DynaSpeed.prototype = new Skill("Dyna-Speed");

function DynaBreath()
{
	this.type = SkillType.Defensive;
	this.oppAttackMod = 0.5;
	this.oppSpeedMod = 0.5;
	this.description = "Unleash super-breath to reduce opponent speed and ability to attack.";
	this.imageURL = "characters/DynamanComicStills/Dynaman_DynaBreath.png";
	this.soundID = "dynaBreath";

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

				oppMerc.speed.modifier = this.oppSpeedMod;
				oppMerc.speed.duration = 1;
				
				this.logAction(self, oppMerc, 0);
			}
		}
		this.logAction(self, target[0]);
	};
}
DynaBreath.prototype = new Skill("Dyna-Breath");