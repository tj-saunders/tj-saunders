
//===================================================
// Constructor
//===================================================

function PopupElement(_interactiveLayer){

	PIXI.Container.call(this);
	
	this._interactiveLayer = _interactiveLayer;
	
	Main.interactionManager.increaseCurrentLayer();
	
};

PopupElement.prototype = Object.create( PIXI.Container.prototype );
PopupElement.prototype.constructor = PopupElement;

//===================================================
// Constants
//===================================================

PopupElement.WIDTH = 901;
PopupElement.HEIGHT = 470; 

//===================================================
// Variables
//===================================================

PopupElement.prototype._width = null;
PopupElement.prototype._height = null;
PopupElement.prototype._interactiveLayer = null;

PopupElement.prototype._parent = null;

//===================================================
// Private Methods
//===================================================

PopupElement.prototype._init = function(_width, _height){

	_width = _width || Main.SCREEN_WIDTH - 250;
	_height = _height || Main.SCREEN_HEIGHT - 200;
	
	this.interactive = true;
	
	this._width = _width;
	this._height = _height;

	this._backgroundRectangle = new PIXI.Graphics();
	this._backgroundRectangle.beginFill(0x000000);
			
	this._backgroundRectangle.drawRect( -Main.SCREEN_WIDTH, -Main.SCREEN_HEIGHT, Main.SCREEN_WIDTH*2, Main.SCREEN_HEIGHT*2);
	this._backgroundRectangle.position.x = 0;
	this._backgroundRectangle.position.y = 0;
	this._backgroundRectangle.alpha = 0.4;
	
	this.addChild(this._backgroundRectangle);

	//var tempColour = Utils.getRandomColour();

	this._backgroundSprite = GraphicsManager.prototype.getSpriteFromSpriteSheet('onboarding_screen', 'panelOnboarding_blankbg.png');	
	this.addChild(this._backgroundSprite);

	this._panelSprite = GraphicsManager.prototype.getSpriteFromSpriteSheet('onboarding_screen', 'panelChoice.png');	
	this.addChild(this._panelSprite);


	//Main.SOUND_MANAGER.playSound('sound_Dialogue_box');

};

//===================================================
// Public Methods
//===================================================

PopupElement.prototype.addToParent = function(_parent){
	
	this._parent = _parent;
	
	_parent.addChild(this);	
};

PopupElement.prototype.destroy = function(){

	if(this._parent !== null){
		
		this._parent.removeChild(this);
	}

	Main.interactionManager.decreaseCurrentLayer();
};

//===================================================
// Events
//===================================================


//===================================================
// GETTERS & SETTERS
//===================================================

