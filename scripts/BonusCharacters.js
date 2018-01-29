function Nemesis()
{
    this.name = "NEMESIS";
	this.realName = "";
    this.image = "nemesis.png";
    this.type = CharacterType.Physical;
	this.alignment = "Evil";

    this.skills = [ new SwordChop(), new SweepingStrike(), new DefensiveStance(), new Focus(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "nemesis_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "nemesis_idle_back.png", wrap : true, animate : null }
    };

	this.health = { base : 100, modifier : 1.0  };
	this.defaultHealth = 100;
    
	this.defence = { base : 20, modifier : 1.0, duration : -1 };
    this.attack = { base : 66, modifier : 1.0, duration : -1 };
    this.speed = { base : 111, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "";
    this.backstory = "";
	this.defeatImage = "characters/BSGComicStills/FRONT-Defeat.jpg";
}
Nemesis.prototype = new Character();

function SamuraiGirl()
{
    this.name = "SAMURAI GIRL";
	this.realName = "";
	this.image = "samuraigirl.png";
	this.alignment = "Good";

    this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

	this.health = { base : 170, modifier : 1.0  };
	this.defaultHealth = 170;
    
	this.defence = { base : 35, modifier : 1.0, duration : -1 };
    this.attack = { base : 65, modifier : 1.0, duration : -1 };
    this.speed = { base : 130, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "";
    this.backstory = "";
}
SamuraiGirl.prototype = new Character();

function DinoGirl()
{
    this.name = "DINOGIRL";
	this.realName = "";
	this.image = "dinogirl.png";
	this.alignment = "Good";

    this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

	this.health = { base : 230, modifier : 1.0  };
	this.defaultHealth = 230;
    
	this.defence = { base : 60, modifier : 1.0, duration : -1 };
    this.attack = { base : 40, modifier : 1.0, duration : -1 };
    this.speed = { base : 65, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "";
    this.backstory = "";
}
DinoGirl.prototype = new Character();

function Clown()
{
	this.name = "CLOWN";
	this.realName = "";
	this.image = "clown.png";
	this.alignment = "Evil";

	this.skills = [ new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Skill("Skill"), new Retreat() ];

	this.quote = "";
    this.backstory = "";
}
Clown.prototype = new Character();
