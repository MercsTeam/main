//var availableCharacters = [ BigSwordGuy, SniperGirl, Mage, Djinn, Cyborg, Alien, Caveman, CowboyGuy, HiveDrone, SpaceGirl, Pirate, Witch ];
var availableCharacters = [ BigSwordGuy, SniperGirl, Mage, Djinn, Cyborg, BigSwordGuy, BigSwordGuy, BigSwordGuy, BigSwordGuy, BigSwordGuy, BigSwordGuy, BigSwordGuy ];

var textureBaseURL = "https://raw.githubusercontent.com/MercsTeam/threejs-testing/master/textures/";

function BigSwordGuy()
{
    this.name = "Artur Hobbe";
    this.image = "bigsword.png";
    this.colour = 0x934095;
    this.type = CharacterType.Physical;

    this.skills = [ new SwordChop(), new SweepingStrike(), new DefensiveStance(), new Focus(), new Retreat() ];
    /*this.state = 
    {
		IDLE_FRONT : { img : "bigswordguy/idle.front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "bigswordguy/idle.back.png", wrap : true, animate : null },
		SLASH_FRONT : { img : "bigswordguy/slash.front.png", wrap : false, animate : { hor : 30, vert : 1, num : 30, dur : 33 } }	    
    };*/

	this.state = 
    {
		IDLE_FRONT : { img : "bsg_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "bsg_idle_back.png", wrap : true, animate : null },
		SLASH_FRONT : { img : "bigswordguy/slash.front.png", wrap : false, animate : { hor : 30, vert : 1, num : 30, dur : 33 } }	    
    };

	this.health = { base : 200, modifier : 1.0  };
    
	this.defence = { base : 50, modifier : 1.0, duration : -1 };
    this.attack = { base : 50, modifier : 1.0, duration : -1 };
    this.speed = { base : 100, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

    this.backstory = "A simple man with simple origins. A peaceful farmer forced to take up the sword to defend his family and livelihood. Big sword guy quickly found out he was a better swordsman than farmer, and began working as a sword for hire.";
	this.defeatImage = "characters/BSGComicStills/FRONT-Defeat.jpg";
}
BigSwordGuy.prototype = new Character();

function SniperGirl()
{
    this.name = "Artemis";
	this.image = "snipergirl.png";
    this.colour = 0x9CFE9A;
	this.type = CharacterType.Finesse;

    this.skills = [ new Headshot(), new RicochetShot(), new TakeAim(), new Camouflage(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "snipergirl_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "snipergirl_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 200, modifier : 1.0  };
    
	this.defence = { base : 50, modifier : 1.0, duration : -1 };
    this.attack = { base : 50, modifier : 1.0, duration : -1 };
    this.speed = { base : 100, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

    this.backstory = "A crack-shot special forces veteran, this career soldier grew disinterested in civilian life after the war and turned to mercenary work. If you can afford her rate, and you can find her, maybe you can hire Artemis.";
}
SniperGirl.prototype = new Character();

function Mage()
{
    this.name = "Zocoma";
	this.image = "mage.png";
    this.colour = 0x64CA99;
	this.type = CharacterType.Magic;

    this.skills = [ new Fireball(), new LightningStorm(), new DivineShield(), new PoolMana(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "mage_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "mage_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 200, modifier : 1.0  };
    
	this.defence = { base : 50, modifier : 1.0, duration : -1 };
    this.attack = { base : 50, modifier : 1.0, duration : -1 };
    this.speed = { base : 100, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

    this.backstory = "This reclusive wizard had her first taste of fame and wealth after a quest to slay a dragon. Now Zocoma has a taste for the spotlight and uses her powers for profiteering.";
}
Mage.prototype = new Character();

function Djinn()
{
    this.name = "Odesai the Ancient";
	this.image = "djinn.png";
    this.colour = 0x16C05D;
	this.type = CharacterType.Magic;

    this.skills = [ new LightningStrike(), new CloudBarrier(), new HighWinds(), new Wish(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "djinn_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "djinn_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 200, modifier : 1.0  };
    
	this.defence = { base : 50, modifier : 1.0, duration : -1 };
    this.attack = { base : 50, modifier : 1.0, duration : -1 };
    this.speed = { base : 100, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

    this.backstory = "He lifts.";
}
Djinn.prototype = new Character();

function Cyborg()
{
    this.name = "Proto";
	this.image = "cyborg.png";
    this.colour = 0x8049D2;
	this.type = CharacterType.Finesse;

    this.skills = [ new IntegratedBattleSystem(), new ElectronicBarrier(), new NanobotRepairs(), new PassiveEffect(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "cyborg_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "cyborg_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 200, modifier : 1.0  };
    
	this.defence = { base : 50, modifier : 1.0, duration : -1 };
    this.attack = { base : 50, modifier : 1.0, duration : -1 };
    this.speed = { base : 100, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

    this.backstory = "After the hovertrain accident that killed his tycoon parents and left his body broken, He spent months in intensive care, clawing at the last shreds of his life. "
		+ "With the help of an experimental transhumanist program, Proto was offered a second chance. Now almost eighty percent cybernetic, Proto uses his lightning fast synapses "
		+ "and near indestructible body to fight intergalactic crime.";
}
Cyborg.prototype = new Character();

function Alien()
{
	this.name = "ALIEN";
	this.image = "alien.png";
	this.colour = 0xCF744D;

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

    this.backstory = "Emotionless as he completes his task. From planet Neptune.";
}
Alien.prototype = new Character();

function Caveman()
{
	this.name = "CAVEMAN";
	this.image = "caveman.png";
	this.colour = 0x59D8EF;

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

    this.backstory = "Always looking for a bigger challenge";
}
Caveman.prototype = new Character();

function CowboyGuy()
{
	this.name = "COWBOY GUY";
	this.image = "cowboy.png";
	this.colour = 0x800DBC;

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

    this.backstory = "Quick-witted gunslinger with unusually good luck";
}
CowboyGuy.prototype = new Character();

function HiveDrone()
{
	this.name = "HIVE DRONE";
	this.image = "drone.png";
	this.colour = 0xBD4038;

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

    this.backstory = "Mindless worker";
}
HiveDrone.prototype = new Character();

function SpaceGirl()
{
	this.name = "SPACE GIRL";
	this.image = "spacegirl.png";
	this.colour = 0x440383;

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

    this.backstory = "An astronaut from the Canadian Space Program, very smart, space-age technology";
}
SpaceGirl.prototype = new Character();

function Pirate()
{
	this.name = "PIRATE";
	this.image = "pirate.png";
	this.colour = 0x75F927;

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

    this.backstory = "Captain of the Rusty Bucket Corsairs";
}
Pirate.prototype = new Character();

function Witch()
{
	this.name = "WITCH";
	this.image = "witch.png";
	this.colour = 0xE7CBBA;

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

    this.backstory = "Purple and gold robed, wise, old";
}
Witch.prototype = new Character();
