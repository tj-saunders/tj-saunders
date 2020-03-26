
//===================================================
// Constructor
//===================================================

function TemporaryPopup(_string){

	PIXI.Container.call(this);



	this._init(_string);
};

TemporaryPopup.prototype = Object.create( PIXI.Container.prototype );
TemporaryPopup.prototype.constructor = TemporaryPopup;

//===================================================
// Constants
//===================================================

TemporaryPopup.CURRENT_POPUP = null;

TemporaryPopup.TWEEN_TIME = 0.3;

TemporaryPopup.ONSCREEN_TIME = 2.0;

TemporaryPopup.SCREEN_Y_POS = 10;
TemporaryPopup.FONT_TEXT_DATA = {fontFamily : GraphicsManager.FONT, fontSize: 18, 
											fontWeight: GraphicsManager.FONT_WEIGHT_NORMAL,
											fill : 0x000000, align : 'center'};

//===================================================
// Variables
//===================================================



//===================================================
// Private Methods
//===================================================

TemporaryPopup.prototype._init = function(_string){

	if(TemporaryPopup.CURRENT_POPUP !== null){
		
		TemporaryPopup.CURRENT_POPUP.destroy();
	}

	this._panelSprite = GraphicsManager.prototype.getSpriteFromSpriteSheet('main_assets', 'errorPopup.png');
	this.addChild(this._panelSprite);
	
	this.pivot.x = this._panelSprite.width * 0.5;
	
	this._text = new PIXI.Text(_string, TemporaryPopup.FONT_TEXT_DATA);
	
	this._text.anchor.set(0.5, 0.5);
	this._text.position.x = this._panelSprite.width * 0.5;
	this._text.position.y = this._panelSprite.height * 0.5;
	
	this._text.style.wordWrap = true;
	this._text.style.wordWrapWidth = this._panelSprite.width * 0.85;	

	this.position.x = Main.SCREEN_WIDTH * 0.5;
	this.position.y = -this._panelSprite.height;
	
	this.addChild(this._text);	
	
	
	TweenMax.to(this.position, TemporaryPopup.TWEEN_TIME, { y: TemporaryPopup.SCREEN_Y_POS, ease:Power1.easeInOut} );
	
	TweenMax.to(this.position, TemporaryPopup.TWEEN_TIME, { delay: TemporaryPopup.TWEEN_TIME + TemporaryPopup.ONSCREEN_TIME, 
														y: -this._panelSprite.height, ease:Power1.easeInOut, onComplete: this.destroy.bind(this)} );
	
	TemporaryPopup.CURRENT_POPUP = this;
};

//===================================================
// Public Methods
//===================================================

TemporaryPopup.prototype.update = function(){
	


};

TemporaryPopup.prototype.destroy = function(){

	if(this.parent !== null){
		
		this.parent.removeChild(this);
	}
	
	GraphicsManager.prototype.destroyObject(this._panelSprite);	
	GraphicsManager.prototype.destroyObject(this._text);	
	
	TemporaryPopup.CURRENT_POPUP = null;
};

//===================================================
// Events
//===================================================


//===================================================
// GETTERS & SETTERS
//===================================================



