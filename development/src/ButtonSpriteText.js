
//===================================================
// Constructor
//===================================================

function ButtonSpriteText(_texture, _imageName, _text, _interactiveLayer){

	this._graphicsContainer = new PIXI.Container();	
	

	this._backgroundSprite = GraphicsManager.prototype.getSpriteFromSpriteSheet(_texture, _imageName);
	this._graphicsContainer.addChild(this._backgroundSprite);

	var _width = this._backgroundSprite.width;
	var _height = this._backgroundSprite.height;

	Button.call(this, _width, _height, _interactiveLayer, null, true);
	
	this.addChild(this._graphicsContainer);
	
	this._graphicsContainer.x = _width * 0.5; 
	this._graphicsContainer.y = _height * 0.5; 
	
	this._graphicsContainer.pivot.x = _width * 0.5;
	this._graphicsContainer.pivot.y = _height * 0.5;
	
	this._init(_texture, _imageName, _text, _width, _height);
};

ButtonSpriteText.prototype = Object.create( Button.prototype );
ButtonSpriteText.prototype.constructor = Button;

//===================================================
// Constants
//===================================================

ButtonSpriteText.DARKNESS_VALUE = 0.7;
ButtonSpriteText.BRIGHTNESS_VALUE = 1.4;
ButtonSpriteText.SPRITE_X_GAP = 10;

ButtonSpriteText.FONT_COLOUR = 0xFFFFFF;
ButtonSpriteText.BUTTON_TEXT = {fontFamily : GraphicsManager.FONT, fontWeight: GraphicsManager.FONT_WEIGHT_NORMAL, 
											fontSize: 16, 
											fill : ButtonSpriteText.FONT_COLOUR, align : 'center'};

//===================================================
// Variables
//===================================================

ButtonSpriteText.prototype._buttonWidth = null;
ButtonSpriteText.prototype._buttonHeight = null;

ButtonSpriteText.prototype._callbackFunction = null;

//===================================================
// Private Methods
//===================================================

ButtonSpriteText.prototype._init = function(_texture, _imageName, _text, _width, _height){

	Button.prototype._init.call(this, _width, _height);

	this._text = new PIXI.Text(_text, ButtonSpriteText.BUTTON_TEXT);			
	this._text.anchor.set(0.5, 0.5);
	this._text.position.x = _width * 0.5;
	this._text.position.y = _height * 0.5;
	this._text.style.wordWrap = true;
	this._text.style.wordWrapWidth = Math.floor(_width * 0.9);
	
	this._graphicsContainer.addChild(this._text);
		
	this._colorMatrix = new PIXI.filters.ColorMatrixFilter();
	this._backgroundSprite.filters = [this._colorMatrix];	
};

ButtonSpriteText.prototype._enabledGraphicsHandler = function(){
	
	this._colorMatrix.brightness(1);
	this.alpha = 1;
};

ButtonSpriteText.prototype._disabledGraphicsHandler = function(){
	
	this._colorMatrix.brightness(1);
	this.alpha = 0.5;
};

ButtonSpriteText.prototype._mouseDownGraphicsHandler = function(){
	
	var scaleAmount = 0.85;
	
	this._colorMatrix.brightness(ButtonSpriteText.DARKNESS_VALUE);	
};

ButtonSpriteText.prototype._mouseUpGraphicsHandler = function(){
	
	this._colorMatrix.brightness(1);	
};

ButtonSpriteText.prototype._mouseOverGraphicsHandler = function(){
		
	this._colorMatrix.brightness(ButtonSpriteText.BRIGHTNESS_VALUE);
	
};

ButtonSpriteText.prototype._mouseOutGraphicsHandler = function(){
			
	if(this._mouseDown === true){
		
		this._colorMatrix.brightness(1);		
	}
	else{
		
		this._colorMatrix.brightness(1);
	}		
};

ButtonSpriteText.prototype._setBrightnessToNormal = function(){
		
	this._colorMatrix.brightness(1);
};

//===================================================
// Public Methods
//===================================================

ButtonSpriteText.prototype.destroy = function(){
	
	GraphicsManager.prototype.destroyObject(this._backgroundSprite);
	GraphicsManager.prototype.destroyObject(this._text);
	GraphicsManager.prototype.destroyObject(this._graphicsContainer);
	
	Button.prototype.destroy.call(this);
	
};

//===================================================
// Events
//===================================================



//===================================================
// GETTERS & SETTERS
//===================================================




