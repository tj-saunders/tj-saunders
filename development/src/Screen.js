
// This is the game class. 

//===================================================
// Constructor
//===================================================

function Screen(_screenManager){

	PIXI.Container.call(this);

	this._screenManager = _screenManager;
	
};

Screen.prototype = Object.create( PIXI.Container.prototype );
Screen.prototype.constructor = Screen;

//===================================================
// Constants
//===================================================

//===================================================
// Variables
//===================================================

// This stores all the lines currently in existence
Screen.prototype._screenManager = null;


//===================================================
// Private Methods
//===================================================

Screen.prototype._init = function(){


	
};


//===================================================
// Public Methods
//===================================================

Screen.prototype.transitionFinished = function(){
	
	
};

Screen.prototype.update = function(){
	


};

Screen.prototype.destroy = function(){

	
};

//===================================================
// Events
//===================================================

Screen.prototype.mouseWheelEvent = function(_sign){
	
	
};


//===================================================
// GETTERS & SETTERS
//===================================================


//Map.prototype.getWidth = function(){ return this._buttonWidth; };
//Button.prototype.getHeight = function(){ return this._buttonHeight; };


