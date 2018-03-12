function BigSwordGuy()
{
    this.name = "BIG SWORD GUY";
	this.realName = "Artur Hobbe";
    this.image = "bigsword.png";
    this.colour = 0x934095;
    this.type = CharacterType.Physical;
	this.alignment = "Good";

    this.skills = [ new SwordChop(), new SweepingStrike(), new DefensiveStance(), new Focus(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "bsg_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "bsg_idle_back.png", wrap : true, animate : null },
		SLASH_FRONT : { img : "bigswordguy/slash.front.png", wrap : false, animate : { hor : 30, vert : 1, num : 30, dur : 33 } }	    
    };

	this.health = { base : 200, modifier : 1.0  };
	this.defaultHealth = 200;
    
	this.defence = { base : 50, modifier : 1.0, duration : -1 };
    this.attack = { base : 50, modifier : 1.0, duration : -1 };
    this.speed = { base : 100, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "You're not <em>cut</em> out for this life...";
	this.tagline = "bsgTag";

    this.backstory = "Once a peaceful farmer, forced to take up the sword to defend his family and livelihood.  Hobbe "
	+ "quickly found out he was a better bladesman than farmer, and found work in the village as a sellsword.";
	
	this.damageImage = "characters/BSGComicStills/BSG-Damaged.jpg";
	this.defeatImage = "characters/BSGComicStills/FRONT-Defeat.jpg";
}
BigSwordGuy.prototype = new Character();

function SniperGirl()
{
    this.name = "SNIPER GIRL";
	this.realName = "Artemis";
	this.image = "snipergirl.png";
    this.colour = 0x9CFE9A;
	this.type = CharacterType.Finesse;
	this.alignment = "Evil";

    this.skills = [ new Headshot(), new RicochetShot(), new TakeAim(), new Camouflage(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "snipergirl_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "snipergirl_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 170, modifier : 1.0  };
	this.defaultHealth = 170;
    
	this.defence = { base : 35, modifier : 1.0, duration : -1 };
    this.attack = { base : 65, modifier : 1.0, duration : -1 };
    this.speed = { base : 130, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Bullseye!";
	this.tagline = "snipergirlTag";

    this.backstory = "A crack-shot special forces veteran, this career soldier grew disinterested in civilian life after "
	+ "the war and turned to mercenary work. If you can afford her rate, and you can find her, maybe you can hire "
	+ "Artemis.";

	this.damageImage = "characters/SniperGirlComicStills/SG-Damage.jpg";
	this.defeatImage = "characters/SniperGirlComicStills/SG-Death.png";
}
SniperGirl.prototype = new Character();

function Mage()
{
    this.name = "MAGE";
	this.realName = "Zocoma";
	this.image = "mage.png";
    this.colour = 0x64CA99;
	this.type = CharacterType.Magic;
	this.alignment = "Good";

    this.skills = [ new Fireball(), new LightningStorm(), new DivineShield(), new PoolMana(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "mage_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "mage_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 190, modifier : 1.0  };
	this.defaultHealth = 190;

	this.defence = { base : 35, modifier : 1.0, duration : -1 };
    this.attack = { base : 65, modifier : 1.0, duration : -1 };
    this.speed = { base : 110, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "I cast SERPENTUS LIMBUS!";
    this.backstory = "This reclusive wizard had her first taste of fame and wealth after a quest to slay a dragon. "
		+ "Now Zocoma has a taste for the spotlight and uses her powers for profiteering as a Cerotis mercenary.";

	this.damageImage = "characters/MageComicStills/MageDamaged.png";
	this.defeatImage = "characters/MageComicStills/MageDead.png";
}
Mage.prototype = new Character();

function Djinn()
{
    this.name = "DJINN";
	this.realName = "Odesai the Ancient Evil";
	this.image = "djinn.png";
    this.colour = 0x16C05D;
	this.type = CharacterType.Magic;
	this.alignment = "Evil";

    this.skills = [ new LightningStrike(), new Confidence(), new SinisterDeal(), new Wish(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "djinn_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "djinn_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 250, modifier : 1.0  };
	this.defaultHealth = 250;
    
	this.defence = { base : 40, modifier : 1.0, duration : -1 };
    this.attack = { base : 35, modifier : 1.0, duration : -1 };
    this.speed = { base : 135, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Allow me to make an offer you cannot refuse.";
    this.backstory = "For those caught in desperation, Odesai offers easy alleviation, but always for a price."
		+ "Odesai the Ancient Evil has appeared in story and myth all throughout human history. A true demon of pure greed, he offers his power and wealth to those in the hardest of times, to those who can not afford to decline his offer."
		+ "Those who accept his offer live a life of luxury and fortune, and have all goals and aspirations met. But when it comes time to collect on his end of the deal, Odesai takes it all, and more.";
}
Djinn.prototype = new Character();

function Cyborg()
{
    this.name = "CYBORG";
	this.realName = "Proto";
	this.image = "cyborg.png";
    this.colour = 0x8049D2;
	this.type = CharacterType.Finesse;
	this.alignment = "Good";

    this.skills = [ new IntegratedBattleSystem(), new ElectronicBarrier(), new NanobotRepairs(), new EnhancedCombatSystem(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "cyborg_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "cyborg_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 230, modifier : 1.0  };
	this.defaultHealth = 230;
    
	this.defence = { base : 60, modifier : 1.0, duration : -1 };
    this.attack = { base : 40, modifier : 1.0, duration : -1 };
    this.speed = { base : 65, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Your actions are illogical.";
    this.backstory = "After the hovertrain accident that killed his tycoon parents and left his body broken, He spent "
		+ "months in intensive care, clawing at the last shreds of his life. With the help of an experimental "
		+ "transhumanist program, Proto was offered a second chance. Now almost eighty percent cybernetic, Proto "
		+ "uses his lightning fast synapses and near indestructible body to fight intergalactic crime, provided "
		+ "justice pays up front.";

	this.damageImage = "characters/CyborgComicStills/Cyborg_damage.png";
	this.defeatImage = "characters/CyborgComicStills/Cyborg_defeat.png";
}
Cyborg.prototype = new Character();

function Alien()
{
	this.name = "ALIEN";
	this.realName = "Xiklak";
	this.image = "alien.png";
	this.colour = 0xCF744D;
	this.type = CharacterType.Magic;
	this.alignment = "Neutral";

	this.skills = [ new RayGun(), new Abduction(), new ForceShield(), new Telekinesis(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "alien_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "alien_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 200, modifier : 1.0, duration : -1 };
	this.defaultHealth = 200;

	this.defence = { base : 50, modifier : 1.0, duration : -1 };
    this.attack = { base : 40, modifier : 1.0, duration : -1 };
    this.speed = { base : 80, modifier : 1.0, duration : -1 };

	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Blublbublubblubblub.";
    this.backstory = "Xiklak may be one of the only remaining life-forms native to the ammonia oceans of Neptune. He is also a crack-shot with a laser rifle. That's about the only two things people know about this hired gun.";

	this.AbductionSprite = "abduction.png";

	this.damageImage = "characters/AlienComicStills/Alien_Damage_rough.png";
	this.defeatImage = "characters/AlienComicStills/Alien_Defeat_rough.png";
}
Alien.prototype = new Character();

function Caveman()
{
	this.name = "CAVEMAN";
	this.realName = "Krorlaag";
	this.image = "caveman.png";
	this.colour = 0x59D8EF;
	this.type = CharacterType.Physical;
	this.alignment = "Evil";

	this.skills = [ new Club(), new PoisonSpear(), new PrimalRage(), new FireDance(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "caveman_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "caveman_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 250, modifier : 1.0  };
	this.defaultHealth = 250;
    
	this.defence = { base : 25, modifier : 1.0, duration : -1 };
    this.attack = { base : 60, modifier : 1.0, duration : -1 };
    this.speed = { base : 80, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Krorlaag like shiny... Krorlaag smashes!";
    this.backstory = "Dumb as rocks, Krorlaag makes up for his underdeveloped brain with more than enough brawn. "
		+ "Krorlaag used to be one of his village’s best hunters. He was on one of his hunts when the world's dimensions "
		+ "shifted, erasing all trace of his home and former life. Resigned to a nomadic existence, Krorlaag will do just "
		+ "about anything for food or \"shinies\".";

	this.damageImage = "characters/CavemanComicStills/caveman_damage.png";
	this.defeatImage = "characters/CavemanComicStills/caveman_defeat.png";
}
Caveman.prototype = new Character();

function CowboyGuy()
{
	this.name = "COWBOY GUY";
	this.realName = "Augustus \"Lucky\" Townsend";
	this.image = "cowboy.png";
	this.colour = 0x800DBC;
	this.type = CharacterType.Finesse;
	this.alignment = "Good";

	this.skills = [ new Draw(), new SixShooter(), new LiquidCourage(), new Lasso(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "cowboy_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "cowboy_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 150, modifier : 1.0  };
	this.defaultHealth = 150;
    
	this.defence = { base : 25, modifier : 1.0, duration : -1 };
    this.attack = { base : 50, modifier : 1.0, duration : -1 };
    this.speed = { base : 130, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Lookee what the cat dragged in.";
	this.tagline = "cowboyTag";

    this.backstory = "A quick-witted gunslinger with unusually good luck, \"Lucky\" Townsend earned his renown as a "
		+ "bounty hunter in the Wild West. No space-time phenomenon will change his plan to retire as a rich man.";

	this.damageImage = "characters/CowboyComicStills/cowboy_damage.png";
	this.defeatImage = "characters/CowboyComicStills/cb_death2.png";
}
CowboyGuy.prototype = new Character();

function Pirate()
{
	this.name = "PIRATE";
	this.realName = "Salvatore the Accursed";
	this.image = "pirate.png";
	this.colour = 0x75F927;
	this.type = CharacterType.Finesse;
	this.alignment = "Evil";

	this.skills = [ new StormStrike(), new SingleShot(), new Parry(), new ReleaseKraken(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "pirate_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "pirate_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 200, modifier : 1.0  };
	this.defaultHealth = 200;
    
	this.defence = { base : 40, modifier : 1.0, duration : -1 };
    this.attack = { base : 60, modifier : 1.0, duration : -1 };
    this.speed = { base : 120, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Yohohoho!";
    this.backstory = "Captain of the Rusty Bucket Corsairs, cursed to eternally sail the stormy seas. Salvatore "
		+ "never was much of a sailor however, and prefers dry land, taking an accursed stormcloud with him wherever "
		+ "the wind blows. He figured out how to harness the energies of his curse and now considers it a blessing.";

	this.damageImage = "characters/PirateComicStills/Pirate_Damage.png";
	this.defeatImage = "characters/PirateComicStills/Pirate_Death.png";
}
Pirate.prototype = new Character();

function HiveDrone()
{
	this.name = "HIVE DRONE";
	this.realName = "Oryctolagus Jigat";
	this.image = "drone.png";
	this.colour = 0xBD4038;
	this.type = CharacterType.Physical;
	this.alignment = "Neutral";

	this.skills = [ new Sting(), new Bite(), new Exoskeleton(), new HiveMindHijack(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "drone_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "drone_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 250, modifier : 1.0  };
	this.defaultHealth = 250;
    
	this.defence = { base : 75, modifier : 1.0, duration : -1 };
    this.attack = { base : 25, modifier : 1.0, duration : -1 };
    this.speed = { base : 50, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Klikliklikliklikliklik! ELIMINATE! ELIMINATE!";
    this.backstory = "One of thousands of mindless drones. This creature enacts the will of the hive with no thought of self-preservation.";
}
HiveDrone.prototype = new Character();

function SpaceGirl()
{
	this.name = "SPACE GIRL";
	this.realName = "Flight Engineer Valerie Zemanová";
	this.image = "spacegirl.png";
	this.colour = 0x440383;
	this.type = CharacterType.Finesse;
	this.alignment = "Good";

	this.skills = [ new DeathRay(), new BlastOff(), new Jetpack(), new GravityGun(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "spacegirl_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "spacegirl_idle_back.png", wrap : true, animate : null },
		BLAST_OFF  : { img : "spacegirl_blastoff.png", wrap : false, animate : null }
    };

	this.health = { base : 200, modifier : 1.0  };
	this.defaultHealth = 200;
    
	this.defence = { base : 50, modifier : 1.0, duration : -1 };
    this.attack = { base : 40, modifier : 1.0, duration : -1 };
    this.speed = { base : 90, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Count down to your defeat!";
    this.backstory = "An astronaut from the well funded and highly advanced Canadian Space Program, Zemanová "
		+ "is a veteran of many scientific missions. She went AWOL after an attack on Moon Base Alpha, which was "
		+ "orchestrated by a small group of mercenaries.";
}
SpaceGirl.prototype = new Character();

function Witch()
{
	this.name = "WITCH";
	this.realName = "Azalea Wraith";
	this.image = "witch.png";
	this.colour = 0xE7CBBA;
	this.type = CharacterType.Magic;
	this.alignment = "Evil";

	this.skills = [ new Hex(), new Curse(), new Blessing(), new PoisonApple(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "witch_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "witch_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 250, modifier : 1.0  };
	this.defaultHealth = 250;
    
	this.defence = { base : 40, modifier : 1.0, duration : -1 };
    this.attack = { base : 40, modifier : 1.0, duration : -1 };
    this.speed = { base : 100, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "Double, double, toil and trouble; Fire burn and cauldron bubble.";
    this.backstory = "A red-robed witch from an ancient world who practices dangerous magic, brought to Cerotis by "
		+ "the esoteric destruction wrought by the black hole. Quick to adapt to the new surroundings, Azalea set "
		+ "out to establish her power.";

	this.damageImage = "characters/WitchComicStills/Damaged.png";
	this.defeatImage = "characters/WitchComicStills/Defeat.png";
}
Witch.prototype = new Character();