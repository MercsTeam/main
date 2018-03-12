var SoundLibrary = 
{
	mainTheme : "MERCS_THEME_JAN21.mp3",
	clickOn : "330048__paulmorek__beep-04-positive.mp3",
	clickOff : "330049__paulmorek__beep-04-negative.mp3",
	skill : "330063__paulmorek__swish-02-2015-06-21.mp3",
	endRound : "346425__soneproject__ecofuture3.mp3",
	
	swordChop : "BSG_SwordChop.mp3",
	sweepStrike : "BSG_Sweepingstrike.mp3",
	swordDraw : "BSG_Sworddraw.mp3",
	defensiveStance : "BSG_DefensiveStance.mp3",
	focus : "BSG_Focus.mp3",
	bsgTag : "BSG_Tagline.mp3",
	
	headShot : "Snipergirl_Headshot.mp3",
	ricochetShotHit : "SniperGirl_RicochetShot_directhit.mp3",
	ricochetShotMiss : "SniperGirl_RicochetShot_missedshot.mp3",
	takeAim : "Snipergirl_TakeAim.mp3",
	camouflage : "SniperGirl_Camouflage.mp3",
	snipergirlTag : "Snipergirl_Tagline.mp3",
	
	fireBall : "Mage_Fireball.mp3",
	lightningStorm : "Mage_LightningStorm.mp3",
	poolMana : "Mage_PoolMana.mp3",
	divineShield : "Mage_DivineShield.mp3",

	lightningStrike : "Djinn_LightningStrike.mp3",
	confidence : "Djinn_Confidence.mp3",
	sinisterDeal : "Djinn_SinisterDeal.mp3",
	wish : "Djinn_Wish.mp3",
	djinnTag : "Djinn_Tagline.mp3",	
	
	club : "cm_club.mp3",
	poisonSpear : "cm_spear.mp3",
	primalRage : "cm_screams.mp3",
	fireDance : "cm_fire.mp3",
	cavemanTag : "Caveman_Tagline.mp3",
	
	sixShooter : "Cowboy_Six-Shooter.mp3",
	draw : "Cowboy_Draw.mp3",
	lasso : "Cowboy_Lasso.mp3",
	liquidCourage : "Bubbling-SoundBible.com-1684132696.mp3",
	cowboyTag : "Cowboy_Tagline.mp3",

	raygun : "Laser_Gun-Mike_Koenig-1975537935.mp3",
	abduction : "Martian_Death_Ray-Mike_Koenig-937891031.mp3",
	forceShield : "Electric Shock Zap-SoundBible.com-68983399.mp3",
	telekinesis : "End_Fx-Mike_Devils-724852498.mp3",
	alienTag : "Alien_tagline.mp3",

	intBattleSys : "Laser_Machine_Gun-Mike_Koenig-1194129298.mp3",
	electronicBarrier : "Jump-SoundBible.com-1007297584.mp3",
	nanobotRepairs : "Robot Computing-SoundBible.com-1094568858.mp3",
	enhCombatSys : "Alien_Machine_Gun-Matt_Cutillo-2023875589.mp3",
	cyborgTag : "Cyborg_Tagline.mp3",

	stormStrike : "Thunder_HD-Mark_DiAngelo-587966950.mp3",
	parry : "Swords Clashing-SoundBible.com-912903192.mp3",
	singleShot : "Cannon-SoundBible.com-1661203605.mp3",
	releaseKraken : "Monster_Gigante-Doberman-1334685792.mp3",
	pirateTag : "Pirate_Tagline.mp3"
};

var soundPath = "https://raw.githubusercontent.com/MercsTeam/main/master/Mercs_sound_library";
//var soundPath = "http://nickcomics.ca/Brock/Mercs/sounds";

function SoundPlayer(loop)
{	
	var sp = this;

	this.soundObj = new Audio();
	this.soundObj.autoplay = true;
	this.soundObj.controls = false;
	this.soundObj.loop = loop;
	this.soundObj.volume = 0.5;
	this.soundObj.muted = false;

	this.start = function(name)
	{
		this.soundObj.src = soundPath + "/" + SoundLibrary[name];
		this.soundObj.play();
	};

	this.playSequence = function(seq)
	{
		var index = 0;

		this.soundObj.src = soundPath + "/" + SoundLibrary[seq[index]];
		this.soundObj.play();
		this.soundObj.onended = function()
		{
			index++;
			if(index < seq.length)
			{
				sp.soundObj.src = soundPath + "/" + SoundLibrary[seq[index]];
				sp.soundObj.play();
			}
		};
	};

	this.mute = function(value) { this.soundObj.muted = value; };
	this.isMuted = function() { return this.soundObj.muted; };

	this.pause = function() { this.soundObj.pause(); };
	this.isPaused = function() { return this.soundObj.paused; };

	this.setVolume = function(value) { this.soundObj.volume = value/100.0; };
	this.hasEnded = function() { return this.soundObj.hasEnded; };
}
