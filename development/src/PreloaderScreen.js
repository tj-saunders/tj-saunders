
//===================================================
// Constructor
//===================================================

function PreloaderScreen(_screenManager){

	PIXI.Container.call(this);

	this._screenManager = _screenManager;

	this._init();
};

PreloaderScreen.prototype = Object.create( PIXI.Container.prototype );
PreloaderScreen.prototype.constructor = PreloaderScreen;

//===================================================
// Constants
//===================================================

PreloaderScreen.FONT_TITLE_DATA = {fontFamily : GraphicsManager.FONT, fontWeight: GraphicsManager.FONT_WEIGHT_NORMAL, 
											fontSize: 38, 
											fill : GraphicsManager.FONT_COLOUR, align : 'center'};

//===================================================
// Variables
//===================================================

PreloaderScreen.prototype._screenManager = null;
PreloaderScreen.prototype._loadingBar = null;

//===================================================
// Private Methods
//===================================================

PreloaderScreen.prototype._init = function(_colour){

	Screen.prototype._init.call(this);

	var backgroundRectWidth = 260;
	var backgroundRectHeight = 15;
					
	this._loadingBackPanel = GraphicsManager.prototype.getSpriteFromSpriteSheet('preloader_assets', "loadingBarBg.png");
	this._loadingBackPanel.anchor.set(0.5, 0.5);
	this._loadingBackPanel.x = Main.SCREEN_WIDTH * 0.5;
	this._loadingBackPanel.y = Main.SCREEN_HEIGHT * 0.5 + 30;
	this.addChild(this._loadingBackPanel);
	
	this._loadingText = new PIXI.Text("Loading...", PreloaderScreen.FONT_TITLE_DATA);
	this._loadingText.anchor.set(0.5, 1);
	this._loadingText.position.x = Main.SCREEN_WIDTH * 0.5;
	this._loadingText.position.y = this._loadingBackPanel.y - this._loadingBackPanel.height * 0.5 - 10; 

	this.addChild(this._loadingText);
		
	this._loadingBar = new BarUIElement(backgroundRectWidth, backgroundRectHeight, 0x265665, 0xF58221, 8);
	this._loadingBar.x = Main.SCREEN_WIDTH * 0.5 - backgroundRectWidth * 0.5;
	this._loadingBar.y = this._loadingBackPanel.y - backgroundRectHeight * 0.5;
	this._loadingBar.setFillPercentage(0);
	
	this.addChild(this._loadingBar);
};

//===================================================
// Public Methods
//===================================================

PreloaderScreen.prototype.setPreloaderFull = function(){
	
	this._loadingBar.setFillTargetPercentage(1);
	this._loadingBar.setFillPercentage(1);
};

PreloaderScreen.prototype.updateLoadingBar = function(_percentage){
	
	this._loadingBar.setFillTargetPercentage(_percentage);
};

PreloaderScreen.prototype.transitionFinished = function(){
	
	
};

PreloaderScreen.prototype.update = function(){
	
	if(this._loadingBar !== null){
	
		this._loadingBar.update();
	}
};

PreloaderScreen.prototype.destroy = function(){

	GraphicsManager.prototype.destroyObject(this._loadingBackPanel);	
	GraphicsManager.prototype.destroyObject(this._loadingText);	
	GraphicsManager.prototype.destroyObject(this._loadingBar);	
	
	Screen.prototype.destroy.call(this);
};

//===================================================
// Events
//===================================================

PreloaderScreen.prototype.mouseWheelEvent = function(_sign){
	
	
};

//===================================================
// GETTERS & SETTERS
//===================================================


