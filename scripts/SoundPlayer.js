var SoundLibrary = 
{
	mainTheme : "MERCS_THEME_JAN21.mp3",
	clickOn : "330048__paulmorek__beep-04-positive.mp3",
	clickOff : "330049__paulmorek__beep-04-negative.mp3",
	skill : "330063__paulmorek__swish-02-2015-06-21.mp3",
	endRound : "346425__soneproject__ecofuture3.mp3",
	swordChop : "MERCS_swordchop.mp3",
	sweepStrike : "BSG_Sweepingstrike.mp3",
	swordDraw : "BSG_Sworddraw.mp3",
	headShot : "Snipergirl_Headshot.mp3",
	ricochetShotHit : "SniperGirl_RicochetShot_directhit.mp3",
	ricochetShotMiss : "SniperGirl_RicochetShot_missedshot.mp3",
	takeAim : "Snipergirl_TakeAim.mp3"
};

var soundPath = "https://raw.githubusercontent.com/MercsTeam/main/master/Mercs_sound_library";
//var soundPath = "http://nickcomics.ca/Brock/Mercs/sounds";

function SoundPlayer(loop)
{	
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

	this.mute = function(value) { this.soundObj.muted = value; };
	this.isMuted = function() { return this.soundObj.muted; };

	this.pause = function() { this.soundObj.pause(); };
	this.isPaused = function() { return this.soundObj.paused; };

	this.setVolume = function(value) { this.soundObj.volume = value/100.0; };
	this.hasEnded = function() { return this.soundObj.hasEnded; };
}
