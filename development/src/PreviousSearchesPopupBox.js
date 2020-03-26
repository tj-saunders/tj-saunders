
//===================================================
// Constructor
//===================================================

function PreviousSearchesPopupBox(_interactiveLayer, _searchArray){

	PIXI.Container.call(this);
	
	this._interactiveLayer = _interactiveLayer;
	
	Main.INTERACTION_MANAGER.increaseCurrentLayer();
	
	this._init(_searchArray)
	
};

PreviousSearchesPopupBox.prototype = Object.create( PIXI.Container.prototype );
PreviousSearchesPopupBox.prototype.constructor = PreviousSearchesPopupBox;

//===================================================
// Constants
//===================================================

PreviousSearchesPopupBox.TITLE_FONT_DATA = {fontFamily : GraphicsManager.FONT, 
											fontWeight: GraphicsManager.FONT_WEIGHT_NORMAL, fontSize: 18, 
											fill : 0x222222, align : 'center'};
											
PreviousSearchesPopupBox.BODY_FONT_DATA = {fontFamily : GraphicsManager.FONT, 
											fontWeight: GraphicsManager.FONT_WEIGHT_NORMAL, fontSize: 16, 
											fill : 0x222222, align : 'center'};

//===================================================
// Variables
//===================================================

PreviousSearchesPopupBox.prototype._interactiveLayer = null;

PreviousSearchesPopupBox.prototype._parent = null;
PreviousSearchesPopupBox.prototype._searchArrayTextObjects = null;


//===================================================
// Private Methods
//===================================================

PreviousSearchesPopupBox.prototype._init = function(_searchArray){

	this.interactive = true;
	
	this._searchArrayTextObjects = [];
	
	var topGapY = 48;
	var bottonGapY = 20;
	
	var spacePerLine = 40;
	
	var searchArrayLengthUsed = Math.min(_searchArray.length, 5);
	
	var boxWidth = Math.min(500, Main.SCREEN_WIDTH - 10); //500;
	var boxHeight = topGapY + bottonGapY + searchArrayLengthUsed * spacePerLine;

	var backgroundColour = 0xDDDDDD //0x5E8F8E;

	this._backgroundRectangle = new PIXI.Graphics();
	this._backgroundRectangle.lineStyle(5, 0x666666);
	this._backgroundRectangle.beginFill(backgroundColour);
	this._backgroundRectangle.drawRoundedRect(0, 0, boxWidth, boxHeight);
	this._backgroundRectangle.position.x = 0;
	this._backgroundRectangle.position.y = 0;
	this.addChild(this._backgroundRectangle);

	this._titleText = new PIXI.Text("Previous Searches", PreviousSearchesPopupBox.TITLE_FONT_DATA );
	this._titleText.anchor.set(0.5, 0);
	this._titleText.x = boxWidth * 0.5;
	this._titleText.y = 14;
	this.addChild(this._titleText);
		
	this.x = Main.SCREEN_WIDTH * 0.5 - boxWidth * 0.5;
	this.y = Main.SCREEN_HEIGHT * 0.5 - boxHeight * 0.5;
			
	this._closeButton = new ButtonSpriteText('main_assets', "close_button.png", "", this._interactiveLayer, {});
	this._closeButton.pivot.x = this._closeButton.width * 0.5;
	this._closeButton.pivot.y = this._closeButton.height * 0.5;
	this._closeButton.position.x = boxWidth - this._closeButton.width*0.5 - 10; 
	this._closeButton.position.y = this._closeButton.height*0.5 + 10;
		
	this._closeButton.addCallbackFunction( this._closeButtonPressed.bind(this) );
	this.addChild(this._closeButton);			
			
	if(_searchArray && _searchArray.length > 0){
		
		var tempCount = 0;
		
		/*{"coord":{"lon":-0.13,"lat":51.51},
		"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],
		"base":"stations","main":
		{"temp":286.25,"feels_like":280.37,"temp_min":284.82,"temp_max":288.15,"pressure":1024,"humidity":34},"visibility":10000,"wind":{"speed":5.1,"deg":90},"clouds":{"all":0},"dt":1585145588,"sys":{"type":1,"id":1414,"country":"GB","sunrise":1585115455,"sunset":1585160501},"timezone":0,"id":2643743,"name":"London","cod":200}
		*/
		
		var startIndex = _searchArray.length - 1;
		var endIndex = Math.max(0, _searchArray.length - 5);
		
		for(var i=_searchArray.length - 1; i>=endIndex; i--){

			var searchString = _searchArray[i].name + " | " + _searchArray[i].weather[0].description + 
									" | " + _searchArray[i].main.temp + "K";
							

			var newText = new PIXI.Text(searchString, PreviousSearchesPopupBox.BODY_FONT_DATA );
			newText.anchor.set(0.5, 0);
			newText.x = boxWidth * 0.5;
			newText.y = topGapY + tempCount * spacePerLine;
			newText.style.wordWrapWidth = boxWidth - 10;
			newText.style.wordWrap = true;
			this.addChild(newText);

			this._searchArrayTextObjects.push(newText);
			
			tempCount += 1;
		}
	}
		
};


//===================================================
// Public Methods
//===================================================

PreviousSearchesPopupBox.prototype._closeButtonPressed = function(){
	
	this.destroy();	
};

PreviousSearchesPopupBox.prototype.addToParent = function(_parent){
	
	this._parent = _parent;
	
	_parent.addChild(this);	
};

PreviousSearchesPopupBox.prototype.destroy = function(){

	if(this._parent !== null){
		
		this._parent.removeChild(this);
	}

	Main.INTERACTION_MANAGER.decreaseCurrentLayer();
	
	GraphicsManager.prototype.destroyObject(this._backgroundRectangle);
	GraphicsManager.prototype.destroyObject(this._titleText);
	GraphicsManager.prototype.destroyObject(this._closeButton);
};

//===================================================
// Events
//===================================================



//===================================================
// GETTERS & SETTERS
//===================================================


//Map.prototype.getWidth = function(){ return this._buttonWidth; };
//Button.prototype.getHeight = function(){ return this._buttonHeight; };


