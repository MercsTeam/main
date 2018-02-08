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
	
	this.damageImage = "characters/BSGComicStills/BSG-Damaged.jpg";
	this.defeatImage = "characters/BSGComicStills/FRONT-Defeat.jpg";
}
Nemesis.prototype = new Character();

function SamuraiGirl()
{
    this.name = "SAMURAI GIRL";
	this.realName = "Tatsu Sasaki";
	this.image = "samuraigirl.png";
	this.type = CharacterType.Finesse;
	this.alignment = "Good";

	//https://www.livestrong.com/article/349257-japanese-samurai-sword-techniques/
    this.skills = [ new Skill("Yoko Giri/Side Cut"), new Skill("Kesi Giri/Slash"), new Skill("Overhead Cut"), new Skill("Nukitsuke/Intimidation Stance"), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "samuraigirl_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "samuraigirl_idle_back.png", wrap : true, animate : null }
    };

	this.quote = "";
    this.backstory = "";
}
SamuraiGirl.prototype = new Character();

function DinoGirl()
{
    this.name = "DINOGIRL";
	this.realName = "Qastra";
	this.image = "dinogirl.png";
	this.type = CharacterType.Finesse;
	this.alignment = "Good";

    this.skills = [ new Skill("Tail Whip"), new Skill("Snarl"), new Skill("Heat Vision"), new Skill("Ripping Claws"), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "dinogirl_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "dinogirl_idle_back.png", wrap : true, animate : null }
    };

	this.quote = "";
    this.backstory = "";
}
DinoGirl.prototype = new Character();

function Clown()
{
	this.name = "CLOWN";
	this.realName = "Mr. Giggles";
	this.image = "clown.png";
	this.type = CharacterType.Physical;
	this.alignment = "Evil";

	this.skills = [ new Skill("Seltzer Bottle"), new Skill("Exploding Pie"), new Skill("Balloon Animal"), new Skill("Honk"), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "clown_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "clown_idle_back.png", wrap : true, animate : null }
    };

	this.quote = "";
    this.backstory = "";
}
Clown.prototype = new Character();
