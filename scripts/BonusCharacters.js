function Nemesis()
{
    this.name = "NEMESIS";
	this.realName = "";
    this.image = "nemesis.png";
    this.type = CharacterType.Physical;
	this.alignment = "Evil";

    this.skills = [ new SwordChop(), new SweepingStrike(), new DefensiveStance(), new Focus(), new Retreat() ];
	
	//override BSG skill images
	this.skills[0].imageURL = "characters/BSGComicStills/Nemesis_SwordChop.png";
	this.skills[1].imageURL = "characters/BSGComicStills/Nemesis_SweepingStrike.png";
	this.skills[2].imageURL = "characters/BSGComicStills/Nemesis_DefensiveStance.png";
	this.skills[3].imageURL = "characters/BSGComicStills/Nemesis_Focus.png";

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
    this.backstory = "Nemesis is  ■ ■■■■■■■ ■■■ ■■ ■■■■■■■■■■■■■■ ■■■ ■■■■  Cerotis. ■ ■■■ ■■■■■■■■■ ■ ■■■■ ■■■■■ "
	+ "■■■■■■■■■ ■■■■■■■■■■ ■■■■■. ■■■■■■■■■■■ ■■■■■ ■■■ dead ■■■■■■■■■■■ ■■■■■■■ ■■■ ■■■■■ ■ Killed. ■■■■■■■■ "
	+ "■■■ ■■ ■■ ■■■■■■■■■■ ■■■■■ ■■■■■■ ■ ■■■■■■■■■■■ ■■■■■■■■■■ ■■■■■■■ ■■■ ■■ hunting ■■■■■■■ ■ ■■■■■■■■■ ■■■■ "
	+ "■■■■■■ ■■ ■ ■■■■ ■■■ ■■ ■■■■■■■■■  ■■■■■ ■■■■■■■■■.";
	
	this.damageImage = "characters/BSGComicStills/Nemesis_Damaged.png";
	this.defeatImage = "characters/BSGComicStills/Nemesis_Defeat.png";
}
Nemesis.prototype = new Character();

function SamuraiGirl()
{
    this.name = "SAMURAI GIRL";
	this.realName = "Tatsu Sasaki";
	this.image = "samuraigirl.png";
	this.type = CharacterType.Finesse;
	this.alignment = "Good";

    this.skills = [ new YokoGiri(), new KesiGiri(), new OverheadCut(), new Nukitsuke(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "samuraigirl_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "samuraigirl_idle_back.png", wrap : true, animate : null }
    };
	
	this.health = { base : 150, modifier : 1.0 };
	this.baseHealth = 150;
	
	this.defence = { base : 30, modifier : 1.0, duration : -1 };
	this.attack = { base : 60, modifier : 1.0, duration : -1 };
	this.speed = { base : 175, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "";
    this.backstory = "Tatsu applies her samurai arts as a personal bodyguard for hire, working alone or as part of a "
	+ "small team. On the battlefield, she relies on an overwhelming offence to deter would be attackers, although "
	+ "she prefers to avoid conflicts when possible.";
}
SamuraiGirl.prototype = new Character();

function DinoGirl()
{
    this.name = "DINOGIRL";
	this.realName = "Qastra";
	this.image = "dinogirl.png";
	this.type = CharacterType.Physical;
	this.alignment = "Good";

    this.skills = [ new TailWhip(), new Snarl(), new HeatVision(), new RippingClaws(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "dinogirl_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "dinogirl_idle_back.png", wrap : true, animate : null }
    };
	
	this.health = { base : 250, modifier : 1.0 };
	this.baseHealth = 250;
	
	this.defence = { base : 50, modifier : 1.0, duration : -1 };
	this.attack = { base : 50, modifier : 1.0, duration : -1 };
	this.speed = { base : 50, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };

	this.quote = "";
    this.backstory = "Qastra is the living experiment of the mad scientist known as Doctor Jurassic, who made a "
	+ "life-long career out of his ancient research and brutal cross-DNA mutation procedures. As these things "
	+ "typically go, Qastra broke out of Jurassic’s laboratory and is struggling with the concept of humanity as "
	+ "she fights her way to freedom.";
}
DinoGirl.prototype = new Character();

function Clown()
{
	this.name = "CLOWN";
	this.realName = "Mr. Giggles";
	this.image = "clown.png";
	this.type = CharacterType.Magic;
	this.alignment = "Evil";

	this.skills = [ new SeltzerBottle(), new ExplodingPie(), new BalloonAnimal(), new Honk(), new Retreat() ];

	this.state = 
    {
		IDLE_FRONT : { img : "clown_idle_front.png", wrap : false, animate : null },
		IDLE_BACK  : { img : "clown_idle_back.png", wrap : true, animate : null }
    };
	
	this.health = { base : 200, modifier : 1.0 };
	this.baseHealth = 200;
	
	this.defence = { base : 10, modifier : 1.0, duration : -1 };
	this.attack = { base : 10, modifier : 1.0, duration : -1 };
	this.speed = { base : 150, modifier : 1.0, duration : -1 };
	
	this.accuracy = { modifier : 1.0, duration : -1 };


	this.quote = "";
    this.backstory = "Once a carnival clown, Mr. Giggles has now cast off the laws of his new world, just as he cast off "
	+ "the chains of mortality. Now he serves the Great Destroyer and plans to bring what remains of the tattered "
	+ "universe to a dark and dreadful end, in the hope that one day he will be justly rewarded.";
}
Clown.prototype = new Character();
