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
	intro : document.querySelector("#sagaSell"),
	tmrIntro : null,
	title : document.querySelector("#titleScreen"),
	audioLnk : document.querySelector("nav a:nth-child(2)"),
	arena : document.querySelector("#gamePlay"),
	skillImgArr : null,
	DeadSprite : "tombstone.png",
	m1 : null, 
	m2 : null,
	BattleLog :
	{
		console : document.querySelector("textarea"),
		write : function(text) { this.console.value = text + "\n" + this.console.value; },
		flush : function() { this.console.value = ""; }
	},
    scenes : 
	[ 
		{ background : "mars.jpg", floor : "mars.jpg", sound : "" },
		{ background : "Spacecity.png", floor : "spacecity.jpg", sound : "" },
		{ background : "Underwater.png", floor : "underwater.jpg", sound : "" } 
	],
	toggleSound : function()
	{
		this.audioLnk.classList.toggle("audio-off");
		
		this.music.mute(!this.music.isMuted());
		this.uiSound.mute(!this.uiSound.isMuted());
	},
	init : function()
	{
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
		this.BattleLog.write(string.format("ROUND {0} - FIGHT!!\n========================", this.round));
		
		var retreaters = [];
		var defenders = [];
		var attackers = [];
		
		this.skillImgArr = [];
		
		for(var i = 0; i < Game.CHARACTERS_PER_TEAM; i++)
		{
			p1 = this.player1.characters[i];
			if(p1.active) // && p1.canMove)
			{
				s1 = p1.getSelectedSkill();
				last1 = p1.getLastAttack();
				if(p1.retreat)
				{
					retreaters.push(p1);
				}
				else if(s1 || (last1 && last1.duration > 0))
				{
					if(s1.type == SkillType.Offensive)
					{
						attackers.push(p1);
					}
					else
					{
						defenders.push(p1);
					}
				}

				if(p1.stunned) //else if(!p1.canMove)
				{
					p1.canMove = true;
					p1.stunned = false;
				}
			}
			
			p2 = this.player2.characters[i];
			if(p2.active) // && p2.canMove)
			{
				s2 = p2.getSelectedSkill();
				last2 = p2.getLastAttack();
				if(p2.retreat)
				{
					retreaters.push(p2);
				}
				else if(s2 || (last2 && last2.duration > 0))
				{
					if(p2.canMove && s2.type == SkillType.Offensive)
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
				s.doAction(p, all[i].position);
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
							}
							else
							{
								target = [ all[i], all[i].getAlly() ];
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
							label : string.format("Player {0}.{1} - {2}<br />{3} ({4})",
							(p == this.player1 ? 1 : 2),
							all[i].position,
							all[i].name,
							s.name,
							(s.type == SkillType.Offensive ? "ATTACK" : "DEFEND")),
							url : s.imageURL
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
			this.player1.characters[i].update();
			this.player2.characters[i].update();
			
			//alert(string.format("this.player1[{0}] health = {1}\nPlayer2[{0}] health = {2}", i, this.player1.characters[i].health.base, this.player2.characters[i].health.base));
		}
		
		setTimeout("Game.showImages(0)", 2500);
	},
	showImages : function(index)
	{
		var v = document.querySelector("#imgViewer");
		if(index <= this.skillImgArr.length - 1)
		{
			this.uiSound.start("skill");
			
			v.className = (this.skillImgArr[index].player == this.player1 ? "p1-skillImg" : "p2-skillImg");
			v.style.visibility = "visible";
			v.style.backgroundImage = string.format("url('{0}?v=20180128')", this.skillImgArr[index].url);
			
			v.querySelector("span").innerHTML = this.skillImgArr[index].label;
			
			index++;
			setTimeout("Game.showImages(" + index + ")", 2500);
		}
		else
		{
			v.style.visibility = "hidden";
			this.endRound();
		}
	},	
	endRound : function()
	{
		this.uiSound.start("endRound");
		if(this.player1.activeCharacterCount == 0)
		{
			Game.alert.show("Player 2 Wins!");
			Game.BattleLog.write("PLAYER 2 WINS!");
			Game.over = true;
		}
		else if(this.player2.activeCharacterCount == 0)
		{
			Game.alert.show("Player 1 Wins!");
			Game.BattleLog.write("PLAYER 1 WINS!");
			Game.over = true;
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
				Game.over = true;
			});
		}
	},
	surrender : function()
	{
		if(this.player1.isActive())
		{
		}
		else
		{
		}
		Game.over = true;
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
			var geometryFloor = new THREE.BoxGeometry(50, 1, 30); //50,1,20);
			var textureFloor = new THREE.TextureLoader().load(string.format("images/floor/{0}", this.scenes[r].floor));
			var materialFloor = new THREE.MeshLambertMaterial( { map : textureFloor } );
			
			var floor = new THREE.Mesh(geometryFloor, materialFloor);
			floor.translateX(0);
			floor.translateY(-3);
			floor.translateZ(0);
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
			
			this.m2 = new ActiveMarker(0x999966);
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
				   camera.lookAt(new THREE.Vector3(0,-5,0));
				   if (camera.position.z <= -2) //<= 6)
				   {
					   rotate = 0;
				   }
				}
				else
				{
				   camera.position.z += 0.02;
				   camera.lookAt(new THREE.Vector3(0,-5,0));
				   if (camera.position.z >= 2) //>= 2
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

document.onkeydown = function(e)
{
	var keycode = (window.event ? window.event.keyCode : e.which);
	if(keycode == 67)
	{
		showCredits();
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