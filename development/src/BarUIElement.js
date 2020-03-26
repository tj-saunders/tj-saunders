
//===================================================
// Constructor
//===================================================

function BarUIElement(_width, _height, _backgroundColour, _barColour, _roundedCornerValue){

	PIXI.Container.call(this);

	this._barWidth = _width;
	this._barHeight = _height;
	this._backgroundColour = _backgroundColour || BarUIElement.BACKGROUND_COLOUR;
	this._barColour = _barColour || BarUIElement.FILL_COLOUR;
	this._roundedCornerValue = _roundedCornerValue || 0;

	this._init();
};

BarUIElement.prototype = Object.create( PIXI.Container.prototype );
BarUIElement.prototype.constructor = BarUIElement;

//===================================================
// Constants
//===================================================

BarUIElement.BACKGROUND_COLOUR = 0x888888;
BarUIElement.FILL_COLOUR = 0xCCCCCC;

//===================================================
// Variables
//===================================================

// This stores all the lines currently in existence
BarUIElement.prototype._barWidth = null;
BarUIElement.prototype._barHeight = null;
BarUIElement.prototype._backgroundColour = null;
BarUIElement.prototype._barColour = null;
BarUIElement.prototype._roundedCornerValue = null;

BarUIElement.prototype._backgroundRectangle = null;
BarUIElement.prototype._filledRectangle = null;

BarUIElement.prototype._currentPercentage = null;
BarUIElement.prototype._targtPercentage = null;


//===================================================
// Private Methods
//===================================================

BarUIElement.prototype._init = function(){

	this._backgroundRectangle = new PIXI.Graphics();
	this._backgroundRectangle.beginFill(this._backgroundColour);
	
	this._backgroundRectangle.drawRoundedRect(0, 0, this._barWidth, this._barHeight, this._roundedCornerValue);
	this.addChild(this._backgroundRectangle);
		
	this._filledRectangle = new PIXI.Graphics();
	this._filledRectangle.beginFill(this._barColour);
	
	this._filledRectangle.drawRoundedRect(0, 0, 0, 0, this._roundedCornerValue);
	this.addChild(this._filledRectangle);
};

//===================================================
// Public Methods
//===================================================

// This will tween to the value
BarUIElement.prototype.setFillTargetPercentage = function(_percentage){
	
	this._targetPercentage = _percentage;
};
	
// This will jump to the value
BarUIElement.prototype.setFillPercentage = function(_percentage){
	
	this._currentPercentage = _percentage;
	this._targetPercentage = _percentage;
	
	this.redraw();
};

BarUIElement.prototype.redraw = function(){
	
	this._filledRectangle.clear();	
	this._filledRectangle.beginFill(this._barColour);	
	
	if(this._currentPercentage * this._barWidth >= this._roundedCornerValue){
		
		this._filledRectangle.drawRoundedRect(0, 0, this._currentPercentage * this._barWidth, this._barHeight, this._roundedCornerValue);
	}
};

BarUIElement.prototype.update = function(){
	
	if(this._currentPercentage !== this._targetPercentage){
		
		var diff = this._targetPercentage - this._currentPercentage;
		
		this._currentPercentage = this._currentPercentage + diff * 0.1;
		
		if(Math.abs(this._targetPercentage - this._currentPercentage) < 0.01){
			
			this._currentPercentage = this._targetPercentage;
		}
		
		this.redraw();
	}	
};

BarUIElement.prototype.destroy = function(){

	GraphicsManager.prototype.destroyObject(this._backgroundRectangle);
	GraphicsManager.prototype.destroyObject(this._filledRectangle);
};

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================

