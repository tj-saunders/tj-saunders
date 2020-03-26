
// This class stores what interactive layer is currently being used so only the top layer remains interative when modals etc. appear

//===================================================
// Constructor
//===================================================

function InteractionManager(){

			
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

InteractionManager.prototype._currentLayer = null;
InteractionManager.prototype._interactive = null;

//===================================================
// Private Methods
//===================================================

InteractionManager.prototype._init = function(){

	this._currentLayer = 0;
	this._interactive = true;
};


//===================================================
// Public Methods
//===================================================

InteractionManager.prototype.setInteractive = function(_interactive){
	
	this._interactive = _interactive;
};

InteractionManager.prototype.getCurrentLayer = function(){
	
	return this._currentLayer;
};

InteractionManager.prototype.increaseCurrentLayer = function(){
	
	this._currentLayer += 1;
};

InteractionManager.prototype.decreaseCurrentLayer = function(){
	
	this._currentLayer -= 1;
};

InteractionManager.prototype.isInteractive = function(_layer){ 

	return (this._interactive === true && this._currentLayer === _layer) 

};


//===================================================
// Events
//===================================================



//===================================================
// GETTERS & SETTERS
//===================================================

//InteractionManager.prototype.getCurrentLayer = function(){ return this._currentLayer; };




