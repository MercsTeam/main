//var availableCharacters = [ BigSwordGuy, SniperGirl, Mage, Djinn, Cyborg, Alien, Caveman, CowboyGuy, HiveDrone, SpaceGirl, Pirate, Witch ];
var availableCharacters = [ BigSwordGuy, SniperGirl, Mage, Djinn, Cyborg, Pirate, BigSwordGuy, BigSwordGuy, BigSwordGuy, BigSwordGuy, BigSwordGuy, BigSwordGuy ];

var textureBaseURL = "https://raw.githubusercontent.com/MercsTeam/threejs-testing/master/textures/";

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

	this.quote = "You're not cut out for this life...";
    this.backstory = "A simple man with simple origins. A peaceful farmer forced to take up the sword to defend his family and livelihood. Big sword guy quickly found out he was a better swordsman than farmer, and began working as a sword for hire.";
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
	this.alignment = "Good";

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
    this.backstory = "A military sniper war veteran that turned to freelance mercenary work after the war ended.";
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
    this.backstory = "A woodland mage seeking to use their powers for profit.";
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

    this.skills = [ new LightningStrike(), new CloudBarrier(), new HighWinds(), new Wish(), new Retreat() ];

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
	this.alignment = "Evil";

    this.skills = [ new IntegratedBattleSystem(), new ElectronicBarrier(), new NanobotRepairs(), new PassiveEffect(), new Retreat() ];

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
    this.backstory = "A rogue scientist obsessed with furthering human evolution through the development of "
		+ "technological body modifications. When he ran out of willing test subjects, he began augmenting his "
		+ "own body. After years of replacing parts of his body one by one with his technology, there is nearly "
		+ "nothing left of his human self.";
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

	this.health = { base : 200, modifier : 1.0, duration : -1 };
	this.defaultHealth = 200;

	this.defence = { base : 50, modifier : 1.0, duration : -1 };
    this.attack = { base : 40, modifier : 1.0, duration : -1 };
    this.speed = { base : 80, modifier : 1.0, duration : -1 };

	this.accuracy = { modifier : 1.0, duration : -1 };

	this.skills = [ new Skill("Ray Gun"), new Skill("Abduction"), new Skill("Force Shield"), new Skill("Telekinesis"), new Retreat() ];

	this.quote = "Blublbublubblubblub.";
    this.backstory = "Xiklak may be one of the only remaining life-forms native to the ammonia oceans of Neptune. He is also a crack-shot with a laser rifle. That's about the only two things people know about this hired gun.";
}
Alien.prototype = new Character();

function Caveman()
{
	this.name = "CAVEMAN";
	this.realName = "Krorlaag";
	this.image = "caveman.png";
	this.colour = 0x59D8EF;
	this.alignment = "Evil";

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

	this.quote = "Krorlaag like shiny... Krorlaag smashes!";
    this.backstory = "";
}
Caveman.prototype = new Character();

function CowboyGuy()
{
	this.name = "COWBOY GUY";
	this.realName = "Augustus \"Lucky\" Townsend";
	this.image = "cowboy.png";
	this.colour = 0x800DBC;
	this.alignment = "Good";

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

	this.quote = "Look what the cat dragged in.";
    this.backstory = "Quick-witted gunslinger with unusually good luck";
}
CowboyGuy.prototype = new Character();

function HiveDrone()
{
	this.name = "HIVE DRONE";
	this.realName = "Oryctolagus";
	this.image = "drone.png";
	this.colour = 0xBD4038;
	this.alignment = "Neutral";

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

	this.quote = "Klikliklikliklikliklik!";
    this.backstory = "Mindless worker";
}
HiveDrone.prototype = new Character();

function SpaceGirl()
{
	this.name = "SPACE GIRL";
	this.realName = "";
	this.image = "spacegirl.png";
	this.colour = 0x440383;
	this.alignment = "Good";

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

	this.quote = "";
    this.backstory = "An astronaut from the Canadian Space Program, very smart, space-age technology";
}
SpaceGirl.prototype = new Character();

function Pirate()
{
	this.name = "PIRATE";
	this.realName = "";
	this.image = "pirate.png";
	this.colour = 0x75F927;
	this.alignment = "Evil";

	this.skills = [ new StormStrike(), new SingleShot(), new Parry(), new Maelstrom(), new Retreat() ];

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

	this.quote = "";
    this.backstory = "Zeus but a pirate. Long flowing white hair and beard. Wields a rapier with a flintlock pistol built into the hilt. Surrounded by electrical energy.";
}
Pirate.prototype = new Character();

function Witch()
{
	this.name = "WITCH";
	this.realName = "";
	this.image = "witch.png";
	this.colour = 0xE7CBBA;
	this.alignment = "Evil";

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

	this.quote = "";
    this.backstory = "Purple and gold robed, wise, old";
}
Witch.prototype = new Character();
