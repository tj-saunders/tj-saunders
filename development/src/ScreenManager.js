
//===================================================
// Constructor
//===================================================

function ScreenManager(_container){

	// It's actually a container for the screens and not the stage 
	this._stage = _container;
	
	this._init();
};

//===================================================
// Constants
//===================================================


ScreenManager.PRELOADER_SCREEN = "preloader_screen";
ScreenManager.MAIN_SCREEN = "main_menu_screen";

ScreenManager.SCREEN_TRANSITION_TIME = 1.0;

ScreenManager.TOP_BAR_Y_POSITION_OFFSCREEN = -100;

ScreenManager.FADE_TO_BLACK_TIME = 0.5;
ScreenManager.FADE_TO_BLACK_DELAY = 0.1;

//===================================================
// Variables
//===================================================

// It's actually a container for the screens and not the stage 
ScreenManager.prototype._stage = null;

ScreenManager.prototype._currentScreenName = null;

ScreenManager.prototype._currentScreen = null;
ScreenManager.prototype._nextScreen = null;

ScreenManager.prototype._screenTransitioning = null;

ScreenManager.prototype._gameManager = null;

ScreenManager.prototype._fadeOutRectangle = null;

//===================================================
// Private Methods
//===================================================

ScreenManager.prototype._init = function(){

	this._screenTransitioning = false;
};

//===================================================
// Public Methods
//===================================================

ScreenManager.prototype.changeScreen = function(_newScreenType){
	
	this._screenTransitioning = true;
			
	Main.INTERACTION_MANAGER.setInteractive(false);
	
	switch (_newScreenType) {
												
		case ScreenManager.MAIN_SCREEN:
		
			var newMainScreen = new MainScreen(this);
				
			this.replaceScreen(newMainScreen);
			
		break;				
										
		default:
			console.log("Error! Trying to change screen with name : ", ScreenManager.MAIN_MENU);
		break;
	}	
};

ScreenManager.prototype.setInitialScreen = function(_screen, _screenName){
	
	this._currentScreen = _screen;
	
	this._currentScreenName = _screenName;
	
	this._stage.addChild(_screen);
	
}

ScreenManager.prototype.replaceScreen = function(_screen, _transition, _moveTopBarUI){
	
	_transition = _transition || "left";
	
	_moveTopBarUI = _moveTopBarUI || "";
			
	this._nextScreen = _screen;
	
	if(_transition === "left"){
		
		this._nextScreen.position.x = Main.SCREEN_WIDTH;
						
		//this._stage.addChild(this._nextScreen);
		this._stage.addChild(this._nextScreen);
		
		TweenMax.to(this._currentScreen.position, ScreenManager.SCREEN_TRANSITION_TIME, { x: -Main.SCREEN_WIDTH, ease:Power1.easeInOut, onComplete:this.screenTransitionFinished.bind(this)} );
		
		TweenMax.to(this._nextScreen.position, ScreenManager.SCREEN_TRANSITION_TIME, { x: 0, ease:Power1.easeInOut} );
			
	}
	else if(_transition === "down"){
		
		this._nextScreen.position.y = -Main.SCREEN_HEIGHT;
		
		this._stage.addChild(this._nextScreen);
		
		TweenMax.to(this._currentScreen.position, ScreenManager.SCREEN_TRANSITION_TIME, { y: Main.SCREEN_HEIGHT, ease:Power1.easeInOut, onComplete:this.screenTransitionFinished.bind(this)} );
		
		TweenMax.to(this._nextScreen.position, ScreenManager.SCREEN_TRANSITION_TIME, { y: 0, ease:Power1.easeInOut} );		
	}
	else if(_transition === "up_and_fade"){
		
		this._nextScreen.position.y = Main.SCREEN_HEIGHT;
		
		this._stage.addChild(this._nextScreen);
		
		TweenMax.to(this._currentScreen, ScreenManager.SCREEN_TRANSITION_TIME, { alpha: 0, ease:Power1.easeInOut, onComplete:this.screenTransitionFinished.bind(this)} );
		
		TweenMax.to(this._nextScreen.position, ScreenManager.SCREEN_TRANSITION_TIME, { y: 0, ease:Power1.easeInOut} );		
	}
	else if(_transition === "fade_out_to_black"){
		
		this._nextScreen.alpha = 0;
		
		this._stage.addChild(this._nextScreen);
						
		TweenMax.to(Main.fadeToBlackContainer, ScreenManager.FADE_TO_BLACK_TIME, { alpha: 1, ease:Power1.easeInOut} );	

		TweenMax.delayedCall( ScreenManager.FADE_TO_BLACK_TIME, function(){
			this._currentScreen.alpha = 0;
			this._nextScreen.alpha = 1;
		}.bind(this))
		
		TweenMax.to(Main.fadeToBlackContainer, ScreenManager.FADE_TO_BLACK_TIME, { delay: ScreenManager.FADE_TO_BLACK_TIME + ScreenManager.FADE_TO_BLACK_DELAY, alpha: 0, ease:Power1.easeInOut, onComplete:this.screenTransitionFinished.bind(this)} );
	}
	else if(_transition === "cancel"){
		
		this._nextScreen.position.y = Main.SCREEN_HEIGHT;
		
		TweenMax.to(this._currentScreen.position, ScreenManager.SCREEN_TRANSITION_TIME, { y: -Main.SCREEN_HEIGHT, ease:Power1.easeInOut, onComplete:this.screenTransitionFinished.bind(this)} );
		
		this._stage.addChild(this._nextScreen);
		
		TweenMax.to(this._nextScreen.position, ScreenManager.SCREEN_TRANSITION_TIME, { y: 0, ease:Power1.easeInOut} );
	}
	else if(_transition === "restart"){
		
		this._currentScreen.alpha = 0;
		this._stage.addChild(this._nextScreen);
		this.screenTransitionFinished();
	}
						
	//Main.SOUND_MANAGER.playSound('sound_Transition');
}

ScreenManager.prototype.screenTransitionFinished = function(){
				
	console.log("screenTransitionFinished");	
	
	this._stage.removeChild(this._currentScreen);
	
	this._currentScreen.destroy();
	
	this._currentScreen = this._nextScreen;
	
	this._currentScreen.transitionFinished();
	
	this._nextScreen = null;
	
	this._screenTransitioning = false;
	
	Main.INTERACTION_MANAGER.setInteractive(true);
}

ScreenManager.prototype.update = function(){

	if(this._screenTransitioning === true) { return; } ;
	
	if(this._currentScreen !== null){
		
		this._currentScreen.update();
	}
	
};

ScreenManager.prototype.destroy = function(){

	
};

ScreenManager.prototype.mouseWheelEvent = function(_sign){
	
	if(this._screenTransitioning === true) { return; } ;
	
	if(this._currentScreen != null){
		
		this._currentScreen.mouseWheelEvent(_sign);
	}	
};

ScreenManager.prototype.mouseDownEvent = function(_mousePos){
	
	if(this._screenTransitioning === true) { return; } ;
	
	if(this._currentScreen != null){
		
		this._currentScreen.mouseDownEvent(_mousePos);
	}
};

ScreenManager.prototype.mouseUpEvent = function(_mousePos){
	
	if(this._screenTransitioning === true) { return; } ;
	
	if(this._currentScreen != null){
		
		this._currentScreen.mouseUpEvent(_mousePos);
	}
};

ScreenManager.prototype.mouseMoveEvent = function(_mousePos){
	
	if(this._screenTransitioning === true) { return; } ;
	
	if(this._currentScreen != null){
		
		this._currentScreen.mouseMoveEvent(_mousePos);
	}
};

ScreenManager.prototype.keyDownEvent = function(_keyCode){
	
	if(this._screenTransitioning === true) { return; } ;
	
	if(this._currentScreen != null){
		
		this._currentScreen.keyDownEvent(_keyCode);
	}
};

//===================================================
// Events
//===================================================

//===================================================
// GETTERS & SETTERS
//===================================================



