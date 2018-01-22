var CharacterType = { NotSet : -1, Physical : 1, Finesse : 2, Magic : 3 };
var TypeBonus = { Ineffective : 0.75, None : 1.0, Effective : 1.25 };

function getTypeBonus(t1, t2)
{
	if(t1 == t2)
	{
		return TypeBonus.None;
	}
	else if((t1 == CharacterType.Physical && t2 == CharacterType.Finesse) || (t1 == CharacterType.Finesse && t2 == CharacterType.Magic))
	{
		return TypeBonus.Effective;
	}
	else
	{		
		return TypeBonus.Ineffective;	
	}
}

function Character()
{
	this.player = null;
	this.active = true;
	this.canMove = true;

	this.stunned = false;
	this.blocksDamage = false;

    this.dazed = false;
    this.poisoned = false;
    this.bleeding = false;
	this.burned = false;	
	this.immune = false;

	this.health = null;
    
	this.defence = null;
    this.attack = null;
    this.speed = null;
	this.accuracy = null;
    
    this.name = "";
    this.image = "";
    this.type = CharacterType.NotSet;   
	
	this.defeatImage = "";

    this.colour = 0x000000;
    this.obj = null;
    this.charanim = null;
    this.state = null;
    this.healthbar = null;
    this.marker = null;
    
    this.skills = null;
    this.backstory = "";
    
    this.attackHistory = null;
    
    this.retreat = false;	
    this.position = -1;
    this.target = -1;

	this.getAlly = function()
	{
		var ally = null;
		for(var i = 0; i < this.player.characters.length; i++)
		{
			//not self + not inactive position
			if(this.player.characters[i] != this && this.player.characters[i].position != 3)
			{
				ally = this.player.characters[i];
			}
		}
		return ally;
	};

	this.update = function()
	{
		if(!this.active) return;

		this.blocksDamage = false;

		var attr = [ this.defence, this.attack, this.speed, this.accuracy ];

		if(this.position == 3)
		{
			for(var i = 0; i < attr.length; i++) 
			{
				attr[i].modifier = 1.0;
			}

			if(!this.poisoned) 
			{
				this.health.modifier = 1.0;
			}

			this.stunned = false;
			this.dazed = false;
			this.bleeding = false;
			this.burned = false;	
			this.immune = false;
		}
		else
		{
			this.health.base *= (this.immune && this.health.modifier < 1.0 ? 1.0 : this.health.modifier);

			if(this.stunned || this.dazed) this.canMove = false;

			for(var i = 0; i < attr.length; i++)
			{
				if(attr[i].duration > 0) 
				{
					//alert(attr[i] + " decrements.");
					attr[i].duration--;
				}
				if(attr[i].duration == 0) 
				{
					//alert(attr[i] + " resets.");
					attr[i].modifier = 1.0;
					attr[i].duration = -1;
				}
			}
			this.updateHealthBar();

			if(this.health.base == 0) 
			{
				this.active = false;
				this.skills[4].doAction(this.player, this.position);

				skillImgArr.push({ player : this.player, label : string.format("Player {0}.{1} - {2}<br />DEFEATED", (this.player == player1 ? 1 : 2), this.position, this.name), url : this.defeatImage });

				this.player.activeCharacterCount--;
			}
		}
	}
	
    this.getSelectedSkill = function()
    {
		for(var k = 0; k < this.skills.length; k++)
		{
			if(this.skills[k].isSelected()) return this.skills[k];
		}
		return null;
    };
    
    this.getLastAttack = function() 
	{ 
		if(!this.attackHistory) return null;
		return this.attackHistory[this.attackHistory.length - 1]; 
	};

    this.setLastAttack = function()
    {
	    var str = "";
		var skill = this.getSelectedSkill();

		if(skill)
		{
			if(skill.name == "Retreat")
			{
				str = "RETREATS.";
			}
			else
			{
				str += "uses " + skill.name.toUpperCase() 
					+ (skill.type == SkillType.Offensive ? " against ENEMY MERC " + this.target 
					: " on " + (this.target == this.position ? "SELF" : "ALLY " + this.target)) + ".";
			}
		}

		if(!this.attackHistory) this.attackHistory = [];
	    this.attackHistory.push({ "skill" : skill, "text" : str }); 
    };

	/*	
		D = ((A * B1) + M) * T - (F * B2)
		D is the amount of damage dealt to HP
		A is the attacking merc's Attack stat
		B1 is the attack buffs currently active on the attacking merc, and B2 is the defence buffs currently active on the defending merc. Buffs can value from 1.25 to 1.5, and debuffs value from 0.5 to 0.75. If no buffs are applied, this value is 1.
		M is the attack value of the move being used by the attacking merc
		T is the type bonus which is 1 for no bonus, 1.25 for an effective matchup, and 0.75 for an ineffective matchup
		F is the defending merc�s Defense stat
	*/
	this.calculateDamage = function(attacker, bonus)
	{
		if(this.blocksDamage) return;

		var damage = ((attacker.attack.base * attacker.attack.modifier) + attacker.getSelectedSkill().attackValue) * bonus - (this.defence.base * this.defence.modifier);
		//alert(string.format("(({0} * {1}) + {2}) * {3} - ({4} * {5}) = {6}", attacker.attack.base, attacker.attack.modifier, attacker.getSelectedSkill().attackValue, bonus, this.defence.base, this.defence.modifier, damage));

		return damage;
	};

	this.createGameObject = function(scene, sprite, shape, coords, marker)
	{
		var state = this.state[sprite];
		
		var texture  = new THREE.TextureLoader().load(textureBaseURL + state.img);
		if(state.wrap) texture.wrapS = THREE.RepeatWrapping;
		
		var material = new THREE.MeshLambertMaterial( { map : texture, transparent : true } );

		this.obj = new THREE.Mesh(shape, material);
		this.obj.position.x = coords.x;   
		this.obj.position.y = coords.y;   
		this.obj.position.z = coords.z;
		this.obj.rotation.y = Math.PI * 1.6;
		
		this.charanim = null;
		if(state.animate)
		{
			this.charanim = new TextureAnimator(
				texture, 
				state.animate.hor, 
				state.animate.vert, 
				state.animate.num, 
				state.animate.dur
			);
		}
		
		scene.add(this.obj);		
		scene.add(this.createHealthBar(coords));
		
		this.marker = marker;
		if(marker)
		{
			this.marker.setX(coords.x);
			this.marker.setY(coords.y - 2.4);
			this.marker.setZ(coords.z);
		}
	};

	this.createHealthBar = function(coords)
	{
		var geometry = new THREE.PlaneGeometry( 4, 0.5, 32 );
		var material = new THREE.MeshBasicMaterial( {color: 0x00CC33, side: THREE.DoubleSide} );
		
		this.healthbar = new THREE.Mesh( geometry, material );
		this.healthbar.position.x = coords.x;
		this.healthbar.position.y = coords.y + 4;
		this.healthbar.position.z = coords.z;
		this.healthbar.rotation.y = Math.PI * 1.6;
		return this.healthbar;
	};

	this.updateHealthBar = function()
	{
		var width = Math.max(0.001, this.health.base / 200 * 4);
		var barColor = (width < 1 ? 0xFF2424 : 0x00CC33);
		
		this.healthbar.geometry = new THREE.PlaneGeometry( width, 0.5, 32 );
		this.healthbar.material = new THREE.MeshBasicMaterial( {color: barColor, side: THREE.DoubleSide} );
	};
	
	this.updateGameObject = function(coords)
	{
		this.obj.position.x = coords.x;
		this.obj.position.y = coords.y;
		this.obj.position.z = coords.z;
		
		this.healthbar.position.x = coords.x;
		this.healthbar.position.y = coords.y + 4;
		this.healthbar.position.z = coords.z;
		
		if(this.marker)
		{
			this.marker.setX(coords.x);
			this.marker.setY(coords.y - 2.4);
			this.marker.setZ(coords.z);
		}
	};

	this.toString = function() { return this.name; };
}
