
//===================================================
// Constructor
//===================================================

function Main() {
	
	this._init();	
};

//===================================================
// Variables
//===================================================

Main.prototype._screenContainer = null;
Main.prototype._screenManager = null;

//===================================================
// Constants
//===================================================

Main.WAITING_IMAGE_CONTAINER = null;
//Main.ScreenContainer = null;

Main.GRAPHICS_MANAGER = null;
Main.SOUND_MANAGER = null;

Main.BASE_API_URL = ""; 
									
//===================================================
// Private Methods
//===================================================

Main.prototype._init = function() {
	
	Main.GRAPHICS_MANAGER = new GraphicsManager();
	
	Main.SOUND_MANAGER = new SoundManager();
	
	this._setUpScreen();	
};

Main.prototype._setUpScreen = function() {
	
	this._setUpPixiRenderer();

	this._screenContainer = new PIXI.Container();
	this._app.stage.addChild(this._screenContainer);
	
	Main.WAITING_IMAGE_CONTAINER = new PIXI.Container();
	Main.WAITING_IMAGE_CONTAINER.visible = false;
	this._app.stage.addChild(Main.WAITING_IMAGE_CONTAINER);
	
	Main.POP_UP_CONTAINER = new PIXI.Container();	
	this._app.stage.addChild(Main.POP_UP_CONTAINER);
	
	
	Main.INTERACTION_MANAGER = new InteractionManager();
			
	Main.GRAPHICS_MANAGER.loadPreloaderAssets(this._preloaderGraphicsAssetsLoaded.bind(this));						
};

Main.prototype._preloaderGraphicsAssetsLoaded = function(){
													
	this._screenManager = new ScreenManager(this._screenContainer);

	var newPreloader = new PreloaderScreen(this._screenManager);
	
	this._screenManager.setInitialScreen(newPreloader, ScreenManager.PRELOADER_SCREEN);

	Main.GRAPHICS_MANAGER.loadAssets(this._graphicsAssetsLoaded.bind(this), this._graphicsAssetsLoadingUpdate.bind(this));							
};

Main.prototype._graphicsAssetsLoadingUpdate = function(_percentageProgress){
	
	if(this._screenManager._currentScreen !== null){
		
		this._screenManager._currentScreen.updateLoadingBar(_percentageProgress);
	}
};

Main.prototype._graphicsAssetsLoaded = function(){
		
	Main.WAITING_ANIM_SPRITE = new PIXI.AnimatedSprite(GraphicsManager.ANIMATIONS['waiting']);
	Main.WAITING_ANIM_SPRITE.animationSpeed = 0.06; 
	Main.WAITING_ANIM_SPRITE.play(); 
	Main.WAITING_ANIM_SPRITE.anchor.set(0.5, 0.5);
	Main.WAITING_ANIM_SPRITE.x = Main.SCREEN_WIDTH * 0.5;
	Main.WAITING_ANIM_SPRITE.y = Main.SCREEN_HEIGHT * 0.5;
	Main.WAITING_ANIM_SPRITE.scale.x = 0.8;
	Main.WAITING_ANIM_SPRITE.scale.y = 0.8;
	
	Main.WAITING_IMAGE_CONTAINER.addChild(Main.WAITING_ANIM_SPRITE);
		
	this._screenManager._currentScreen.setPreloaderFull();
		
	TweenMax.delayedCall( 0.3, (this._goToMainMenu).bind(this) );
				
};

Main.prototype._goToMainMenu = function(){
		
	this._screenManager.changeScreen(ScreenManager.MAIN_SCREEN);		
}

Main.prototype._changeBackgroundColour = function(_colour){
	
		this._testRectangle.clear();
		this._testRectangle.beginFill(_colour);
	
		this._testRectangle.drawRect(0, 0, Main.SCREEN_WIDTH, 5000); 
};

Main.prototype._setUpPixiRenderer = function(){
																						
	var canvasContainer = document.getElementById('canvas-container');
									
	var body = document.body;
    var html = document.documentElement;

	var containerWidth = document.documentElement.clientWidth; //document.documentElement.offsetWidth; //document.getElementById('canvas-container').offsetWidth;
	var containerHeight = html.clientHeight; //tempHeight; // - 20; // Remove scrollbars... //document.body.clientHeight; //document.documentElement.offsetHeight; //document.getElementById('canvas-container').offsetHeight;
		
	Main.SCREEN_WIDTH = containerWidth; 
	Main.SCREEN_HEIGHT = containerHeight; 
	
	this._app = new PIXI.Application({
		
		width: Main.SCREEN_WIDTH, 
		height: Main.SCREEN_HEIGHT, 
		
		backgroundColor: 0xFFFFFF, 
		antialias: true,
		resolution: 1
		//resolution: window.devicePixelRatio || 1
	
	}); 
		
	//this._app.view.style.position = "absolute";
    this._app.view.style.border   = "0px";
    this._app.view.style.padding = "0px 0px 0px 0px";
	
	if(canvasContainer){
		
		//document.getElementById("canvas-container").appendChild(this._app.view);
		canvasContainer.appendChild(this._app.view);
	}
	else{
		
		document.body.appendChild(this._app.view);
	}
	
	this._app.ticker.add(this._update.bind(this));
		
}

//===================================================
// Events
//===================================================

Main.prototype._mouseWheelEvent = function(e){
	
	var scrollSign = 1;
	
	if(e.deltaY > 0){
		
		scrollSign = -1;
	}
	
	if(this._screenManager !== null){
		
		this._screenManager.mouseWheelEvent(e.deltaY, scrollSign);
	}			
};

// This is called every frame
Main.prototype._update = function() {
	
	if(this._screenManager !== null){
		
		this._screenManager.update();
	}		
};
