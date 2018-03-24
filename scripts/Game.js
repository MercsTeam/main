var Session = "";

var Game =
{
	CHARACTERS_PER_TEAM : 3,
	round : 1,
	over : false,
	player1 : null,
	player2 : null,
	music : null,
    uiSound : null,
	"alert" : null,
	"confirm" : null,
	message : document.querySelector("#lgMsg"),
	intro : document.querySelector("#sagaSell"),
	tmrIntro : null,
	title : document.querySelector("#titleScreen"),
	audioLnk : document.querySelector("nav a:nth-child(2)"),
	arena : document.querySelector("#gamePlay"),
	availableCharacters : [ BigSwordGuy, SniperGirl, Mage, Djinn, Cyborg, Pirate, Alien, Caveman, CowboyGuy, HiveDrone, SpaceGirl, Witch, Clown, DinoGirl, SamuraiGirl, Nemesis ],
	skillImgArr : null,
	DeadSprite : "tombstone.png",	
	NoEffect : "blank.png",
	Effects :
	{
		Defence		: { Up2x : "defenceUp2x.png", Down2x : "defenceDown2x.png", Up : "defenceUp.png", Down : "defenceDown.png" },
		Attack		: { Up2x : "attackUp2x.png", Down2x : "attackDown2x.png", Up : "attackUp.png", Down : "attackDown.png" },
		Speed		: { Up2x : "speedUp2x.png", Down2x : "speedDown2x.png", Up : "speedUp.png", Down : "speedDown.png" },
		Accuracy	: { Up2x : "accuracyUp2x.png", Down2x : "accuracyDown2x.png", Up : "accuracyUp.png", Down : "accuracyDown.png" }
	},
	StatusEffects :
	{
		Bleeding	: "BleedSymbol.png",
		Burned		: "BurnSymbol.png",		
		Immunity	: "ImmunitySymbol.png",
		Interrupt	: "InterruptSymbol.png",
		Poisoned	: "PoisonSymbol.png",
		Stunned		: "StunSymbol.png"
	},
	TypeBonus : { Ineffective : 0.75, None : 1.0, Effective : 1.25 },	
	m1 : null, 
	m2 : null,
	BattleLog :
	{
		console : document.querySelector("#battleLog div"),
		lineFeed : function() { this.console.scrollTop = this.console.scrollHeight; },
		write : function(text) 
		{ 
			this.console.appendChild(document.createTextNode(text + "\n")); 
			this.lineFeed();	
		},
        flush : function() { this.console.innerHTML = ""; }
	},
    scenes : 
	[ 
		{ background : "mars.jpg",			floor : "mars.jpg",				sound : "",	arena : new THREE.CircleGeometry(50,100) },
		{ background : "Spacecity.png",		floor : "spacecity.jpg",		sound : "",	arena : new THREE.BoxGeometry(100,20,1)  },
		{ background : "Underwater.png",	floor : "underwater.jpg",		sound : "",	arena : new THREE.CircleGeometry(50,100) },
		{ background : "Forest.png",		floor : "log.jpg",				sound : "",	arena : new THREE.BoxGeometry(100,20,1) },
		{ background : "Castle_dk.jpg",		floor : "drawbridge.jpg",		sound : "",	arena : new THREE.BoxGeometry(100,20,1) },
		{ background : "galaxy.png",		floor : "planetoid.png",		sound : "",	arena : new THREE.CircleGeometry(50,100) },
		{ background : "SpaceShip.png",		floor : "spaceship_floor.png",	sound : "",	arena : new THREE.BoxGeometry(100,20,1) },
		{ background : "bg_desert.png",		floor : "desertPlatform.png",	sound : "",	arena : new THREE.BoxGeometry(100,20,1) }
	],
	toggleSound : function()
	{
		this.audioLnk.classList.toggle("audio-off");
		
		this.music.mute(!this.music.isMuted());
		this.uiSound.mute(!this.uiSound.isMuted());
	},
	init : function()
	{
		if(sessionStorage.record)
		{
			Session = JSON.parse(sessionStorage.record);
		}
		else
		{
			Session = 
			{ 
				"P1" : { "wins" : 0, "loses" : 0 },
				"P2" : { "wins" : 0, "loses" : 0 }
			};
		}

		Game.music = new SoundPlayer(true);
		Game.music.start("mainTheme");
		Game.music.setVolume(60);

		Game.uiSound = new SoundPlayer(false);

		Game.player1 = new Player(true, Game.CHARACTERS_PER_TEAM);
		Game.player1.characterCoords = { First : new THREE.Vector3(-10, 2, -5), Second : new THREE.Vector3(-10, 2, 5), Third : new THREE.Vector3(-17, 2, 0) };
		
		Game.player2 = new Player(false, Game.CHARACTERS_PER_TEAM);
		Game.player2.characterCoords = { First : new THREE.Vector3(10, 2, 5), Second : new THREE.Vector3(10, 2, -5), Third : new THREE.Vector3(17, 2, 0) };		
		
		Game.alert = new MessageBox(document.getElementById('messageBox'), MessageType.ALERT),
		Game.confirm = new MessageBox(document.getElementById('messageBox'), MessageType.CONFIRM),

		Game.BattleLog.flush();
				
		Game.tmrIntro = setTimeout("Game.skipIntro()", 25000);

		CharacterSelection.load();
	},
	start : function()
	{
		Game.title.classList.toggle("inactive");
		CharacterSelection.toggle();
		
		Game.music.setVolume(25);
		Game.uiSound.start("clickOn");
	},
	skipIntro : function()
	{
		clearTimeout(Game.tmrIntro);
		Game.intro.classList.toggle("inactive");
	},
	startRound : function()
	{
		this.BattleLog.write(string.format("\nROUND {0} - FIGHT!!\n========================", this.round));
		
		var retreaters = [];
		var defenders = [];
		var attackers = [];
		
		this.skillImgArr = [];
		
		for(var i = 0; i < Game.CHARACTERS_PER_TEAM; i++)
		{
			p1 = this.player1.characters[i];
			if(p1.active)
			{
				s1 = p1.getSelectedSkill();
				last1 = p1.getLastAttack();
				
				if(p1.retreat)
				{
					retreaters.push(p1);
				}
				else if(s1 || (last1 && last1.duration > 0))
				{
					if(s1 && s1.type == SkillType.Offensive)
					{
						attackers.push(p1);
					}
					else
					{
						defenders.push(p1);
					}
				}

				if(p1.stunned)
				{
					p1.canMove = true;
					p1.stunned = false;
					p1.setEffectIndicator(Game.NoEffect, 0);
				}
			}
			
			p2 = this.player2.characters[i];
			if(p2.active)
			{
				s2 = p2.getSelectedSkill();
				last2 = p2.getLastAttack();
				
				if(p2.retreat)
				{
					retreaters.push(p2);
				}
				else if(s2 || (last2 && last2.duration > 0))
				{
					if(s2 && s2.type == SkillType.Offensive)
					{
						attackers.push(p2);
					}
					else
					{
						defenders.push(p2);
					}
				}

				if(p2.stunned)
				{
					p2.canMove = true;
					p2.stunned = false;
					p2.setEffectIndicator(Game.NoEffect, 0);
				}
			}						
		}
		
		//randomize attackers
		attackers.sort(function() { return 0.5 - Math.random(); });
		
		//sort attackers by speed
		attackers.sort(function(a, b) { return (a.speed.base * a.speed.modifier) - (b.speed.base * b.speed.modifier); });
		
		var all = retreaters.concat(defenders).concat(attackers);
		
		for(var i = 0; i < all.length; i++)
		{
			s = all[i].getSelectedSkill();
			p = all[i].player;
			o = (p == this.player1 ? this.player2 : this.player1);
			
			target = null;
			
			if(all[i].retreat)
			{
				s.doAction(all[i]);
				all[i].setLastAttack(target);
			}
			else
			{
				if(all[i].canMove)
				{
					if(s)
					{
						if(s.multiTarget)
						{
							if(s.type == SkillType.Offensive)
							{
								target = [ o.getCharacterByPosition(1), o.getCharacterByPosition(2) ];
								if(!target[0].active) target.shift();
								else if(!target[1].active) target.pop();
							}
							else
							{
								target = [ all[i], all[i].getAlly() ];
								if(!target[1].active) target.pop();
							}
						}
						else
						{
							if(s.type == SkillType.Offensive)
							{
								target = [ o.getCharacterByPosition(all[i].target) ];
							}
							else
							{
								target = [ (all[i].target == all[i].position ? all[i] : all[i].getAlly()) ];
							}
						}						

						all[i].setLastAttack(target);
						
						//set remaining turns until skill can be reused
						s.cooldownRem = s.cooldown;

						this.skillImgArr.push({
							player : p,
							character : all[i],
							label : string.format("Player {0}.{1} - {2}<br />{3} ({4})",
							(p == this.player1 ? 1 : 2),
							all[i].position,
							all[i].name,
							s.name,
							(s.type == SkillType.Offensive ? "ATTACK" : "DEFEND")),
							url : s.imageURL,
							sound : s.soundID,
							reaction : []
						});
					}
				}
				
				//excute outstanding actions, from oldest to newest
				for(var j = 0; j < all[i].attackHistory.length; j++)
				{
					if(all[i].attackHistory[j].duration > 0)
					{
						all[i].attackHistory[j].skill.doAction(all[i], all[i].attackHistory[j].target);
						if(all[i].attackHistory[j].duration != 0) all[i].attackHistory[j].duration--;
					}
				}
			}
		}
		
		for(var i = 0; i < Game.CHARACTERS_PER_TEAM; i++)
		{
			this.player1.characters[i].checkHealth();
			this.player2.characters[i].checkHealth();
		}

		setTimeout("Game.showImages(0)", 2500);
	},
	showImages : function(index)
	{
		var v = document.querySelector("#imgViewer");
		
		var rv = document.querySelectorAll(".reactView");
		for(var i = 0; i < rv.length; i++) rv[i].style.visibility = "hidden";

		if(index <= this.skillImgArr.length - 1)
		{
			var slide = this.skillImgArr[index];
					
			if(slide.sound)
			{
				this.uiSound.start(slide.sound);
			}
			else
			{
				this.uiSound.start("skill");
			}
			
			v.className = (slide.player == this.player1 ? "p1-skillImg" : "p2-skillImg");
			v.style.visibility = "visible";
			v.style.backgroundImage = string.format("url('{0}?v=20180128')", slide.url);
			
			v.querySelector("span").innerHTML = slide.label;

			if(slide.label.contains("DEFEATED"))
			{
				slide.character.setDeceased();
			}

			if(slide.reaction.length != 0)
			{				
				for(var i = 0; i < slide.reaction.length; i++)
				{
					rv[i].className = string.format("reactView p{0}c{1}-reactImg", (slide.reaction[i].player == this.player1 ? 1 : 2), (i+1));
					rv[i].style.visibility = "visible";
					rv[i].style.backgroundImage = string.format("url('{0}?v=20180212')", slide.reaction[i].url);
					
					rv[i].querySelector("span").innerHTML = slide.reaction[i].label;
				}
			}
			
			index++;
			setTimeout("Game.showImages(" + index + ")", 2500);
		}
		else
		{
			v.style.visibility = "hidden";			

			for(var i = 0; i < Game.CHARACTERS_PER_TEAM; i++)
			{
				this.player1.characters[i].update();
				this.player2.characters[i].update();
				
				//alert(string.format("this.player1[{0}] health = {1}\nPlayer2[{0}] health = {2}", i, this.player1.characters[i].health.base, this.player2.characters[i].health.base));
			}
			setTimeout("Game.endRound()", 1000);
		}
	},	
	showMessage : function(text)
	{
		this.message.style.visibility = "visible";
		this.message.innerHTML = text;
	},
	hideMessage : function(text)
	{
		this.message.style.visibility = "hidden";
		this.message.innerHTML = "";
	},
	endRound : function()
	{				
		this.uiSound.start("endRound");
		if(this.player1.activeCharacterCount == 0)
		{
			Session.P1.loses++;
			Session.P2.wins++;

			Game.endGame(this.player2);
		}
		else if(this.player2.activeCharacterCount == 0)
		{
			Session.P1.wins++;
			Session.P2.loses++;			

			Game.endGame(this.player1);
		}
		else 
		{
			Game.confirm.show("Next round?", function() 
			{
				Game.confirm.hide();

				Game.player1.active = true;
				Game.player2.active = false;
				
				BattleMenu.load();
				BattleMenu.toggle();
				
				Game.round++;
			}, function()
			{
				Game.confirm.hide();
				//Game.over = true;
				Game.surrender();
			});
		}
	},
	endGame : function(winner)
	{
		Game.music.setVolume(10);

		var seq = [];
		for(var i = 0; i < winner.characters.length; i++)
		{
			if(winner.characters[i].active && winner.characters[i].tagline != "")
			{
				seq.push(winner.characters[i].tagline);
			}
		}
		this.uiSound.playSequence(seq);

		Game.showMessage(string.format("<span>Player {0} Wins!</span><br /><a href=\"javascript:Game.playAgain()\">Play Again?</a>", (winner == Game.player1 ? 1 : 2)));;
		Game.BattleLog.write(string.format("PLAYER {0} WINS!", (winner == Game.player1 ? 1 : 2)));		
		Game.over = true;
	},
	getTypeBonus : function(t1, t2)
	{
		if(t1 == t2)
		{
			return this.TypeBonus.None;
		}
		else if((t1 == CharacterType.Physical && t2 == CharacterType.Finesse) 
			|| (t1 == CharacterType.Finesse && t2 == CharacterType.Magic) 
			|| (t1 == CharacterType.Magic && t2 == CharacterType.Physical))
		{
			return this.TypeBonus.Effective;
		}
		else
		{		
			return this.TypeBonus.Ineffective;	
		}
	},
	surrender : function()
	{
		Game.over = true;
		Game.playAgain();
	},   
	playAgain : function()
	{
		/*Game.player1.reset();
		Game.player2.reset();

		Game.hideMessage();
		
		CharacterSelection.reload();*/

		sessionStorage.setItem("record", JSON.stringify(Session));
		document.location.reload();
	},
	loadArena : function()
	{
		if (Detector.webgl)
		{
			// Initiate function or other initializations here
			// Create a scene and perspective camera
			var scene = new THREE.Scene();
			
			var camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
			camera.position.set(-28, 10, 0); //-25,8,10);
			camera.lookAt(new THREE.Vector3(0, -5, 0));
			
			var rotate = 1;
			
			var clock = new THREE.Clock();
			
			// Create the renderer, set it to fill the browser window, and add the canvas
			var renderer = new THREE.WebGLRenderer();
			//renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setSize(1920, 1080);
			
			//document.body.appendChild(renderer.domElement);
			//var gp = document.getElementById('gamePlay');
			this.arena.insertBefore(renderer.domElement, this.arena.childNodes[0]);
			
			//create background
			var r = Math.floor(Math.random() * this.scenes.length);
			
			var bkgrdTexture = new THREE.TextureLoader().load(string.format("images/backgrounds/{0}", this.scenes[r].background));
			var backgroundMesh = new THREE.Mesh(
				new THREE.PlaneGeometry(2, 2, 0),
				new THREE.MeshBasicMaterial({ map: bkgrdTexture })
			);
			backgroundMesh.material.depthTest = false;
			backgroundMesh.material.depthWrite = false;
			
			var backgroundScene = new THREE.Scene();
			var backgroundCamera = new THREE.Camera();
			backgroundScene.add(backgroundCamera);
			backgroundScene.add(backgroundMesh);
			
			// Create the floor
		  //new THREE.CircleGeometry(50,100); new THREE.BoxGeometry(100,20,1);
			var geometryFloor = this.scenes[r].arena;
			var textureFloor = new THREE.TextureLoader().load(string.format("images/floor/{0}", this.scenes[r].floor));
			var materialFloor = new THREE.MeshLambertMaterial( { map : textureFloor } );
			
			var floor = new THREE.Mesh(geometryFloor, materialFloor);
			floor.translateX(-20);
			floor.translateY(-3);
			floor.translateZ(0);
			floor.rotateX(4.7);
			floor.rotateY(0);
			floor.rotateZ(0);
			scene.add(floor);
			
			// Create a flat plane as the char base and UV map it.
			var geometry = new THREE.PlaneGeometry(9,9);
			geometry.computeBoundingBox();
			
			var max = geometry.boundingBox.max, min = geometry.boundingBox.min;
			var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
			var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
			var faces = geometry.faces;
			
			geometry.faceVertexUvs[0] = [];
			for (var i = 0; i < faces.length; i++)
			{
				v1 = geometry.vertices[faces[i].a],
				v2 = geometry.vertices[faces[i].b],
				v3 = geometry.vertices[faces[i].c];
				
				geometry.faceVertexUvs[0].push([
					new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
					new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
					new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
				]);
			}
			geometry.uvsNeedUpdate = true;
			
			this.m1 = new ActiveMarker(0x33CCFF);
			scene.add(this.m1.circle);
			
			this.m2 = new ActiveMarker(0xE6504D);
			scene.add(this.m2.circle);
			
			var counter = 0;
			for(var c in this.player1.characterCoords)
			{
				this.player1.characters[counter].createGameObject(scene, "IDLE_BACK", geometry, this.player1.characterCoords[c], (counter == 0 ? this.m1 : null));
				this.player2.characters[counter].createGameObject(scene, "IDLE_FRONT", geometry, this.player2.characterCoords[c], (counter == 0 ? this.m2 : null));
				counter++;
			}
			
			// Create lighting.
			var lightAmbient = new THREE.AmbientLight(0xffffff);
			scene.add(lightAmbient);
			var sphere = new THREE.SphereGeometry(0.5,16,8);
			
			var lightMain = new THREE.PointLight(0xffffff, 1.5, 10);
			lightMain.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color:0xFFFFFF } ) ) );
			lightMain.translateX(0);
			lightMain.translateY(20);
			lightMain.translateZ(0);
			scene.add(lightMain);
			
			// Animate/rendering loop
			function animate()
			{
				setTimeout(function()
				{
					requestAnimationFrame( animate );
					var delta = clock.getDelta();

					//charanim.update(1000 * delta);
					for(var i = 0; i < Game.player1.characters.length; i++) if(Game.player1.characters[i].charanim) Game.player1.characters[i].charanim.update(1000 * delta);
					for(var i = 0; i < Game.player2.characters.length; i++) if(Game.player2.characters[i].charanim) Game.player2.characters[i].charanim.update(1000 * delta);

					//controls.update();
				}, 1000/30);

				renderer.autoClear = false;
				renderer.clear();

				if (rotate == 1)
				{
				   camera.position.z -= 0.02;
				   camera.lookAt(new THREE.Vector3(0, -5, 0));
				   if (camera.position.z <= -2) //<= 6)
				   {
					   rotate = 0;
				   }
				}
				else
				{
				   camera.position.z += 0.02;
				   camera.lookAt(new THREE.Vector3(0, -5,  0));
				   if (camera.position.z >= 2) //>= 10)
				   {
					   rotate = 1;
				   }
				}

				renderer.render( backgroundScene , backgroundCamera );
				renderer.render( scene, camera );
			}
			animate();
		}
		else
		{
			Game.BattleLog.write(Detector.getWebGLErrorMessage());
		}
	}          
};
window.onload = Game.init;

function expand(lnk)
{
	lnk.parentElement.classList.toggle("minimize");
}

function expand2(lnk)
{
	lnk.parentElement.classList.toggle("minimize2");
}

function expand3(lnk)
{
	lnk.parentElement.classList.toggle("minimize3");
}

document.onkeydown = function(e)
{
	var keycode = (window.event ? window.event.keyCode : e.which);
	if(keycode == 67)
	{
		showCredits();
	}
	else if (keycode == 83)
	{
		var p = (Game.player1.isActive() ? Game.player1 : Game.player2);
		p.addCharacter(Dynaman);
		p.selectedCount++;
	}
};

// Thanks Stemkoski: https://stemkoski.github.io/Three.js/Texture-Animation.html
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration)
{
	// note: texture passed by reference, will be updated by the update function.
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet.
	this.numberOfTiles = numTiles;
	
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
	
	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;
	
	// how long has the current image been displayed?
	this.currentDisplayTime = 0;
	
	// which image is currently being displayed?
	this.currentTile = 0;
	
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
			{
				this.currentTile = 0;
			}
			
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}

function ActiveMarker(c)
{
	var geometry = new THREE.CircleGeometry( 2, 32 );
	var material = new THREE.MeshBasicMaterial( { color: c } );
	
	this.circle = new THREE.Mesh( geometry, material );
	this.circle.rotation.x = Math.PI * 1.5;
	
	this.setX = function(value) { this.circle.position.x = value; };
	this.setY = function(value) { this.circle.position.y = value; };
	this.setZ = function(value) { this.circle.position.z = value; };
}
