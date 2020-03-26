
//===================================================
// Constructor
//===================================================

function Button(_width, _height, _interactiveLayer, _colour, _noBackground){

	PIXI.Container.call(this);
	
	this._colour = _colour || 0x33DDFF;
	
	this._noBackground = _noBackground || false;
	
	_interactiveLayer = _interactiveLayer || 0;
	
	this._interactiveLayer = _interactiveLayer;
	
};

Button.prototype = Object.create( PIXI.Container.prototype );
Button.prototype.constructor = Button;

//===================================================
// Constants
//===================================================

Button.AUTO_PRESS_THRESHOLD = 7;
Button.AUTO_PRESS_THRESHOLD_FAST = 4;

Button.SPEED_UP_TOTAL_AMOUNT = Button.AUTO_PRESS_THRESHOLD*4;

//===================================================
// Variables
//===================================================

Button.prototype._buttonWidth = null;
Button.prototype._buttonHeight = null;

Button.prototype._callbackFunction = null;
Button.prototype._callbackArgs = null;
Button.prototype._interactiveLayer = null;

Button.prototype._mouseDown = null;
Button.prototype._isDisabled = null;

Button.prototype._autoPressCounter = null;
Button.prototype._autoPressCounterTotal = null;


//===================================================
// Private Methods
//===================================================

Button.prototype._init = function(_width, _height){

	this.interactive = true;
	
	this._isDisabled = false;
	
	this._mouseDown = false;

	this._buttonWidth = _width || 200;
	this._buttonHeight = _height || 80;
	
	this._autoPressCounter = 0;
	this._autoPressCounterTotal = 0;
			
	this._backgroundRectangle = new PIXI.Graphics();
	this._backgroundRectangle.beginFill(this._colour);
	
	this._backgroundRectangle.drawRect(0, 0, this._buttonWidth, this._buttonHeight);
	this._backgroundRectangle.visible = this._noBackground === false;
	
	this.addChild(this._backgroundRectangle);
	
	this.hitArea = new PIXI.Rectangle(0, 0, this._buttonWidth, this._buttonHeight);
	

	this.on('mousedown', (this._mouseDownEvent).bind(this));
	this.on('mouseup', (this._mouseUpEvent).bind(this));
	this.on('mouseover', (this._mouseOverEvent).bind(this));
	this.on('mouseout', (this._mouseOutEvent).bind(this));

	this.on('touchstart', (this._mouseDownEvent).bind(this));
	this.on('touchend', (this._mouseUpEvent).bind(this));

};

//===================================================
// Public Methods
//===================================================

Button.prototype.setDisabled = function(_disabled){

	this._isDisabled = _disabled;
	
	if(_disabled === true){
		
		this._disabledGraphicsHandler();
	}
	else{
		
		this._enabledGraphicsHandler();
	}	
};

Button.prototype.addCallbackFunction = function(_callback){
	
	this._callbackFunction = _callback;
}

Button.prototype.addCallbackArgs = function(_args){
	
	this._callbackArgs = _args;
}

Button.prototype.update = function(){
	
	if(this._mouseDown === true){
		
		this._autoPressCounter += 1;
		this._autoPressCounterTotal += 1;
		
		var tempThreshold = Button.AUTO_PRESS_THRESHOLD 
		
		if(this._autoPressCounterTotal > Button.SPEED_UP_TOTAL_AMOUNT){
			
			tempThreshold = Button.AUTO_PRESS_THRESHOLD_FAST;
		}
					
		if(this._autoPressCounter >= tempThreshold){
			
			if(this._callbackFunction){
		
				this._callbackFunction(this._callbackArgs);
			}
			
			this._autoPressCounter = 0;
		}
	}
	

};

Button.prototype.destroy = function(){

	this.off('mousedown', (this._mouseDownEvent).bind(this));
	this.off('mouseup', (this._mouseUpEvent).bind(this));
	this.off('mousemove', (this._mouseMoveEvent).bind(this));
	this.off('mouseover', (this._mouseOverEvent).bind(this));
	this.off('mouseout', (this._mouseOutEvent).bind(this));
	
	this.off('touchstart', (this._mouseDownEvent).bind(this));
	this.off('touchend', (this._mouseUpEvent).bind(this));
	
	this._callbackFunction = null;

	GraphicsManager.prototype.destroyObject(this._backgroundSprite);
	
	PIXI.Container.call(this);
	
};

//===================================================
// Events
//===================================================

Button.prototype._enabledGraphicsHandler = function(){
	
};

Button.prototype._disabledGraphicsHandler = function(){
	
};

Button.prototype._mouseOverGraphicsHandler = function(){
		
	
};

Button.prototype._mouseOutGraphicsHandler = function(){
	
	
	
};

Button.prototype._mouseDownGraphicsHandler = function(){
	
	
	
};

Button.prototype._mouseUpGraphicsHandler = function(){
	
	
	
};

Button.prototype._buttonPressedHandler = function(){
	
	
	
};

Button.prototype._mouseDownEvent = function(e){
	
	console.log("mouse down event on Button");
	
	if(Main.INTERACTION_MANAGER.isInteractive(this._interactiveLayer) === false || this._isDisabled === true) { return };	
	
	e.stopPropagation();
	
	if(this._mouseDown === false){
		
		this._mouseDown = true;
		this._mouseDownGraphicsHandler();
		
		this._autoPressCounter = 0;
		this._autoPressCounterTotal = 0;
				
		//Main.SOUND_MANAGER.playSound('sound_Default_Click');
	}
	
		
};

Button.prototype._mouseUpEvent = function(e){
			
	if(Main.INTERACTION_MANAGER.isInteractive(this._interactiveLayer) === false || this._isDisabled === true) { return };			
	
	e.stopPropagation();
	
	if(this._mouseDown === true && this._callbackFunction){
				
		this._callbackFunction(this._callbackArgs);
		this._buttonPressedHandler();
	}
	
	this._mouseDown = false;
	
	this._autoPressCounter = 0;
	this._autoPressCounterTotal = 0;
	
	this._mouseUpGraphicsHandler();
	
	console.log("mouse up event on Button");
};

Button.prototype._mouseMoveEvent = function(e){
	
	if(this._interactiveLayer !== Main.INTERACTION_MANAGER.getCurrentLayer() || this._isDisabled === true) { return };
	
	e.stopPropagation();
		
};

Button.prototype._mouseOverEvent = function(e){
	
	if(Main.INTERACTION_MANAGER.isInteractive(this._interactiveLayer) === false || this._isDisabled === true) { return };	
	
	e.stopPropagation();
		
	this._mouseOverGraphicsHandler();
	
	this._mouseDown = false;
	
	this._autoPressCounter = 0;
	this._autoPressCounterTotal = 0;	
};

Button.prototype._mouseOutEvent = function(e){
	
	if(Main.INTERACTION_MANAGER.isInteractive(this._interactiveLayer) === false || this._isDisabled === true) { return };	
	
	this._mouseDown = false;
	
	this._autoPressCounter = 0;
	this._autoPressCounterTotal = 0;
	
	this._mouseOutGraphicsHandler();
	
	e.stopPropagation();
	
};


//===================================================
// GETTERS & SETTERS
//===================================================

Button.prototype.getWidth = function(){ return this._buttonWidth; };
Button.prototype.getHeight = function(){ return this._buttonHeight; };


