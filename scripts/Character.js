var CharacterType = { NotSet : -1, Physical : 1, Finesse : 2, Magic : 3 };

function Character()
{
	this.player = null;
	this.active = true;
	this.canMove = true;
	this.isBonus = false;
	
	this.blocksDamage = false;

	this.stunned = false;
    this.interrupt = false;
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
	this.alignment = "";
	this.quote = "";
	
	this.activeSprite = null;
	this.defeatImage = "";
	this.damageImage = "";

	this.defaultHealth = 0;

    this.colour = 0x000000;
    this.obj = null;
    this.charanim = null;
    this.state = null;
    this.healthbar = null;
    this.marker = null;
	this.effects = null;
    
    this.skills = null;
    this.backstory = "";
    
    this.attackHistory = null;
    
    this.retreat = false;	
    this.position = -1;
    this.target = -1;

	this.getHealthPct = function()
	{
		return this.health.base / this.defaultHealth;
	}	

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

		var attr = null;
		var attributes = [ "Health", "Defence", "Attack", "Speed", "Accuracy" ];
		var effects = [ "poisoned", "stunned", "interrupt", "bleeding", "burned", "immune" ];

		if(this.position == 3)
		{
			if(!this.attackHistory) this.attackHistory = [];

			for(var i = 0; i < this.attackHistory.length; i++)
			{
				this.attackHistory[i].duration = 0;
			}

			if(!this.poisoned) 
			{
				this.health.modifier = 1.0;
				this.setEffectIndicator(Game.NoEffect, 0);
			}

			for(var i = 1; i < attributes.length; i++) 
			{
				attr = this[attributes[i].toLowerCase()];
				attr.modifier = 1.0;
				attr.duration = -1;

				this.setEffectIndicator(Game.NoEffect, i);
			}

			for(var i = 1; i < effects.length; i++)
			{
				this[effects[i]] = false;
			}
		}
		else
		{
			if(this.stunned) this.canMove = false;

			for(var i = 1; i < attributes.length; i++)
			{
				attr = attributes[i].toLowerCase();

				//decrement effect duration
				if(this[attr].duration > 0) 
				{
					this[attr].duration--;
				}

				//reset if duration is 0
				if(this[attr].duration == 0) 
				{
					this[attr].modifier = 1.0;
					this[attr].duration = -1;
				}

				//modifier has effect, show indicator
				if(this[attr].modifier != 1.0)
				{
					if(this[attr].modifier.between(0, 0.74))
					{
						this.setEffectIndicator(Game.Effects[attributes[i]].Down2x, i);
					}
					else if(this[attr].modifier.between(0.75, 0.99))
					{
						this.setEffectIndicator(Game.Effects[attributes[i]].Down, i);
					}
					else if(this[attr].modifier.between(1.01, 1.25))
					{
						this.setEffectIndicator(Game.Effects[attributes[i]].Up, i);
					}
					else
					{
						this.setEffectIndicator(Game.Effects[attributes[i]].Up2x, i);
					}
				}
				else
				{
					this.setEffectIndicator(Game.NoEffect, i);
				}
			}			
		}
	};

	this.checkHealth = function()
	{
		if(!this.active || this.position == 3) return;

		this.health.base *= (this.immune && this.health.modifier < 1.0 ? 1.0 : this.health.modifier);
		this.updateHealthBar();

		if(this.health.base == 0) 
		{
			var opp = this.player.getOpponent();

			//proceed if opponent has active characters
			if(opp.activeCharacterCount != 0)
			{
				this.active = false;

				//show defeated image
				Game.skillImgArr.push({ 
					player : this.player, 
					character : this,
					label : string.format("Player {0}.{1} - {2}<br />DEFEATED", (this.player == Game.player1 ? 1 : 2), this.position, this.name), 
					url : this.defeatImage, 
					sound : null, 
					reaction : [] 
				});

				this.player.activeCharacterCount--;
			}
		}
	};

	this.setDeceased = function()
	{
		//rotate out of action position
		this.skills[4].doAction(this);

		//clear effect indicators
		for(var i = 0; i < this.effects.length; i++)
		{
			this.setEffectIndicator(Game.NoEffect, i);
		}

		//switch sprite to tombstone
		this.updateGameObject(null, Game.DeadSprite);

		this.updateHealthBar();
	};
	
    this.getSelectedSkill = function()
    {
		for(var k = 0; k < this.skills.length; k++)
		{
			if(this.skills[k].selected) return this.skills[k];
		}
		return null;
    };

	this.checkActiveEffect = function()
	{
		return this.stunned || this.interrupt || this.bleeding || this.burned || this.poisoned;
	};

	this.checkActiveHistory = function(skill)
	{
		if(!this.attackHistory) return null;

		var active = null;
		for(var i = 0; i < this.attackHistory.length; i++)
		{
			if(this.attackHistory[i].skill instanceof skill && this.attackHistory[i].duration > 0)
			{
				active = this.attackHistory[i];
				break;
			}
		}
		return active;
	};
    
    this.getLastAttack = function() 
	{ 
		if(!this.attackHistory) return null;
		return this.attackHistory[this.attackHistory.length - 1]; 
	};

    this.setLastAttack = function(target)
    {
		var skill = this.getSelectedSkill();

		if(!this.attackHistory) this.attackHistory = [];
				
	    this.attackHistory.push({ "skill" : skill, "target" : target, "duration" : skill.duration }); 
    };

	/*	
		D = ((A * B1) + M) * T - (F * B2)
		D is the amount of damage dealt to HP
		A is the attacking merc's Attack stat
		B1 is the attack buffs currently active on the attacking merc, and B2 is the defence buffs currently active on the defending merc. Buffs can value from 1.25 to 1.5, and debuffs value from 0.5 to 0.75. If no buffs are applied, this value is 1.
		M is the attack value of the move being used by the attacking merc
		T is the type bonus which is 1 for no bonus, 1.25 for an effective matchup, and 0.75 for an ineffective matchup
		F is the defending merc’s Defense stat
	*/
	this.calculateDamage = function(attacker, bonus)
	{
		if(this.blocksDamage) return 0;

		var damage = ((attacker.attack.base * attacker.attack.modifier) + attacker.getSelectedSkill().attackValue) * bonus - (this.defence.base * this.defence.modifier);
		//alert(string.format("(({0} * {1}) + {2}) * {3} - ({4} * {5}) = {6}", attacker.attack.base, attacker.attack.modifier, attacker.getSelectedSkill().attackValue, bonus, this.defence.base, this.defence.modifier, damage));

		return damage;
	};

	this.createGameObject = function(scene, sprite, shape, coords, marker)
	{
		var state = this.state[sprite];
		this.activeSprite = state.img;
		
		var texture  = new THREE.TextureLoader().load(string.format("images/sprites/{0}?v=20180128", this.activeSprite));
		if(state.wrap) texture.wrapS = THREE.RepeatWrapping;
		
		var material = new THREE.MeshLambertMaterial( { map : texture, transparent : true } );

		this.obj = new THREE.Mesh(shape, material);
		this.obj.position.x = coords.x;   
		this.obj.position.y = coords.y;   
		this.obj.position.z = coords.z;
		this.obj.rotation.y = Math.PI * 1.5;
		
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

		var eff;
		this.effects = [];
		for(var i = 0; i < 5; i++)
		{
			this.effects[i] = this.createEffectIndicator(coords, (i - 1));
			scene.add(this.effects[i]);
		}		
		
		this.marker = marker;
		if(marker)
		{
			this.marker.setX(coords.x);
			this.marker.setY(coords.y - 4.4);
			this.marker.setZ(coords.z);
		}
	};

	this.createHealthBar = function(coords)
	{
		var geometry = new THREE.PlaneGeometry( 4, 0.5 );
		var material = new THREE.MeshBasicMaterial( {color: 0x00CC33, side: THREE.DoubleSide } );
		
		this.healthbar = new THREE.Mesh( geometry, material );
		this.healthbar.position.x = coords.x + 0.5;
		this.healthbar.position.y = coords.y + 4;
		this.healthbar.position.z = coords.z;
		this.healthbar.rotation.y = Math.PI * 1.5;
		return this.healthbar;
	};

	this.updateHealthBar = function()
	{
		try
		{
			var width = Math.max(0.001, this.getHealthPct() * 4);
			var barColor = (width < 1 ? 0xFF2424 : 0x00CC33);
			
			this.healthbar.geometry = new THREE.PlaneGeometry( width, 0.5 );
			this.healthbar.material = new THREE.MeshBasicMaterial( {color: barColor, side: THREE.DoubleSide } );
		}
		catch(exception)
		{
			//Game.BattleLog.write("Character.updateHealthBar: " + exception.message);
		}
	};

	//create blank indicator
	this.createEffectIndicator = function(coords, offsetZ)
	{
		var geometry = new THREE.PlaneGeometry(1, 1);
		var texture  = new THREE.TextureLoader().load(string.format("images/effects/{0}?v=20180204", Game.NoEffect));
		var material = new THREE.MeshLambertMaterial( { map : texture, transparent : true } );

		var effect = new THREE.Mesh( geometry, material );
		effect.position.x = coords.x + 0.5;
		effect.position.y = coords.y + 4.75;
		effect.position.z = coords.z - 1 + offsetZ;
		effect.rotation.y = Math.PI * 1.5;

		return effect;
	};

	this.setEffectIndicator = function(spriteImg, index)
	{
		try
		{
			var texture  = new THREE.TextureLoader().load(string.format("images/effects/{0}?v=20180204", spriteImg));
			this.effects[index].material = new THREE.MeshLambertMaterial( { map : texture, transparent : true } );
		}
		catch(exception)
		{
			//Game.BattleLog.write("Character.setEffectIndicator: " + exception.message);
		}
	};
	
	this.updateGameObject = function(coords, sprite)
	{
		try
		{
			if(sprite)
			{
				this.activeSprite = (typeof sprite === "string" ? sprite : sprite.img);
				var texture  = new THREE.TextureLoader().load(string.format("images/sprites/{0}?v=20180204", this.activeSprite));

				this.obj.material = new THREE.MeshLambertMaterial( { map : texture, transparent : true } );
			}

			if(coords)
			{
				this.obj.position.x = coords.x;
				this.obj.position.y = coords.y;
				this.obj.position.z = coords.z;
				
				this.healthbar.position.x = coords.x + 0.5;
				this.healthbar.position.y = coords.y + 4;
				this.healthbar.position.z = coords.z;

				for(var i = 0; i < this.effects.length; i++)
				{
					this.effects[i].position.x = coords.x + 0.5;
					this.effects[i].position.y = coords.y + 4.75;
					this.effects[i].position.z = coords.z - 1 + (i - 1);
				}
				
				if(this.marker)
				{
					this.marker.setX(coords.x);
					this.marker.setY(coords.y - 4.4);
					this.marker.setZ(coords.z);
				}
			}
		}
		catch(exception)
		{
			//Game.BattleLog.write("Character.updateGameObject: " + exception.message);
		}
	};

	this.toString = function() { return this.name; };
}
