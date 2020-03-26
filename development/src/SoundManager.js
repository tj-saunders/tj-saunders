
// This class stores what interactive layer is currently being used so only the top layer remains interative when modals etc. appear

//===================================================
// Constructor
//===================================================

function SoundManager(){

			
	this._init();
};

//InteractionMananger.prototype = Object.create( Screen.prototype );
//InteractionMananger.prototype.constructor = InteractionMananger;

//===================================================
// Constants
//===================================================

//===================================================
// Variables
//===================================================

SoundManager.prototype._interactive = null;
SoundManager.prototype._soundOn = null;

//===================================================
// Private Methods
//===================================================

SoundManager.prototype._init = function(){

	this._interactive = false;
	this._soundOn = Main.PLAY_SOUNDS;
};


//===================================================
// Public Methods
//===================================================

SoundManager.prototype.playSound = function(_soundName){
	
	if(this._interactive === true && this._soundOn === true){
		
		var tempSound = Main.SOUNDS[_soundName];
		
		tempSound.play();
		
		return tempSound;
	}
};

SoundManager.prototype.setSoundInteractive = function(_interactive){
	
	this._interactive = _interactive;
};

SoundManager.prototype.setSoundOn = function(_soundOn){
	
	this._soundOn = _soundOn;
};



//===================================================
// Events
//===================================================



//===================================================
// GETTERS & SETTERS
//===================================================

//InteractionManager.prototype.getCurrentLayer = function(){ return this._currentLayer; };




