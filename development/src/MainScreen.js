
//===================================================
// Constructor
//===================================================

function MainScreen(_screenManager){

	Screen.call(this, _screenManager);
			
	this._interactiveLayer = 0;		
			
	this._init();
};

MainScreen.prototype = Object.create( Screen.prototype );
MainScreen.prototype.constructor = MainScreen;

//===================================================
// Constants
//===================================================

MainScreen.SEARCH_TEXT = {fontFamily : GraphicsManager.FONT, fontWeight: GraphicsManager.FONT_WEIGHT_NORMAL, 
											fontSize: 28, 
											fill : GraphicsManager.FONT_COLOUR, align : 'center'};
	
MainScreen.BUTTON_TEXT = {fontFamily : GraphicsManager.FONT, fontWeight: GraphicsManager.FONT_WEIGHT_NORMAL, 
											fontSize: 22, 
											fill : GraphicsManager.FONT_COLOUR, align : 'center'};
											
//===================================================
// Variables
//===================================================

MainScreen.prototype._weatherImage = null;
MainScreen.prototype._currentObject = null;
MainScreen.prototype._currentDescription = null;
MainScreen.prototype._currentTempInK = null;
MainScreen.prototype._usingF = null;
MainScreen.prototype._previousSearchesArray = null;

//===================================================
// Private Methods
//===================================================

MainScreen.prototype._init = function(){
	
	Screen.prototype._init.call(this);
		
	this._weatherImageAppearing = false;
	
	this._usingF = false;
	
	this._previousSearchesArray = [];
	
	this._graphicsContainer = new PIXI.Container();	
	this.addChild(this._graphicsContainer);
	
	this._cityText = new PIXI.Text("",{fontFamily : 'Arial', fontSize: 18, fill : 0x000000, align : 'center'});	
	this._cityText.anchor.set(0.5, 0.5);
	this._cityText.position.x = Main.SCREEN_WIDTH * 0.5;
	this._cityText.position.y = Main.SCREEN_HEIGHT * 0.5 -40; //- 100;	
	this.addChild(this._cityText);

	// No longer used
	this._descriptionText = new PIXI.Text("",{fontFamily : 'Arial', fontSize: 22, fill : 0x000000, align : 'center'});	
	this._descriptionText.anchor.set(0.5, 0.5);
	this._descriptionText.position.x = Main.SCREEN_WIDTH * 0.5;
	this._descriptionText.position.y = Main.SCREEN_HEIGHT * 0.5 - 70;	
	//this.addChild(this._descriptionText);	
	
	// No longer used
	this._temperatureText = new PIXI.Text("",{fontFamily : 'Arial', fontSize: 22, fill : 0x000000, align : 'center'});	
	this._temperatureText.anchor.set(0.5, 0.5);
	this._temperatureText.position.x = Main.SCREEN_WIDTH * 0.5;
	this._temperatureText.position.y = Main.SCREEN_HEIGHT * 0.5 - 40;	
	//this.addChild(this._temperatureText);	
	
	var textBoxPadding = 12;
	var textBoxWidth = 240;
	var textBoxHeight = 16;
	var fontSize = 14;
	var fontColour = '#FFFFFF';
	
	this._inputBox = new PIXI.TextInput({
		
		input: {
			fontFamily: GraphicsManager.FONT,
			fontSize: fontSize.toString() + 'pt',
			padding: textBoxPadding.toString() + 'px',		
			width: textBoxWidth.toString() + 'px',		
			height: textBoxHeight.toString() + 'px',
			color: fontColour
		}, 
		box: {  
			default: {fill: 0x333333, rounded: 8, stroke: {color: fontColour, width: 3}},
			focused: {fill: 0x555555, rounded: 8, stroke: {color: fontColour, width: 3}},
			disabled: {fill: 0xFF0000, rounded: 8}
		}
	})
	
	this._inputBox.on('keydown', function(_keycode) {
		
		if(_keycode === 13){
			
			this._searchButtonPressed();
		}
								
		console.log('key pressed:', _keycode);
		
	}.bind(this));
	
	this._inputBox.x = Main.SCREEN_WIDTH * 0.5 - textBoxWidth*0.5 - textBoxPadding*0.5;
	this._inputBox.y = Main.SCREEN_HEIGHT * 0.5 - textBoxHeight*0.5 - textBoxPadding*0.5;
	this._inputBox.placeholder = 'Enter city name...'
	this._inputBox.on('input', this._textEntered.bind(this, this._inputBox));
	this.addChild(this._inputBox);
	
	this._searchButton = new ButtonSpriteText('main_assets', "button.png", "Search", this._interactiveLayer, MainScreen.BUTTON_TEXT);
	this._searchButton.setDisabled(true);
	this._searchButton.position.x = Main.SCREEN_WIDTH*0.5 - this._searchButton.width*0.5 - 80;
	this._searchButton.position.y = Main.SCREEN_HEIGHT * 0.5 + 50; 
	this._searchButton.addCallbackFunction( (this._searchButtonPressed).bind(this));
	
	this.addChild(this._searchButton);	
			
	this._unitsToggle = new ButtonSpriteText('main_assets', "button.png", "Units Toggle", this._interactiveLayer, MainScreen.BUTTON_TEXT);
	this._unitsToggle.setDisabled(false);
	this._unitsToggle.position.x = Main.SCREEN_WIDTH*0.5 - this._searchButton.width*0.5 + 80;
	this._unitsToggle.position.y = this._searchButton.position.y;
	this._unitsToggle.addCallbackFunction( (this._unitsToggleButtonPressed).bind(this));
	
	this.addChild(this._unitsToggle);	
	
	this._unitsText = new PIXI.Text("Units: C",{fontFamily : 'Arial', fontSize: 16, fill : 0x000000, align : 'center'});	
	this._unitsText.anchor.set(0.5, 0.5);
	this._unitsText.position.x = this._unitsToggle.position.x + this._unitsToggle.width * 0.5;
	this._unitsText.position.y = this._searchButton.position.y - 10;	
	this.addChild(this._unitsText);
		
	this._previousSearchesButton = new ButtonSpriteText('main_assets', "button.png", "Previous Searches", this._interactiveLayer, MainScreen.BUTTON_TEXT);
	this._previousSearchesButton.setDisabled(true);
	this._previousSearchesButton.position.x = Main.SCREEN_WIDTH*0.5 - this._previousSearchesButton.width*0.5;
	this._previousSearchesButton.position.y = this._searchButton.position.y + this._searchButton.height + 10; 
	this._previousSearchesButton.addCallbackFunction( (this._previousSearchesButtonPressed).bind(this));
	
	this.addChild(this._previousSearchesButton);	
	
};

MainScreen.prototype._sendRequest = function(_text){
	
	//http://api.openweathermap.org/data/2.5/weather?q=chicago&appid=1202b60313efecf047abab912a2d1093
	
	const tempUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + _text + "&appid=1202b60313efecf047abab912a2d1093";

	var xhr = new XMLHttpRequest();
	
	xhr.open("POST", tempUrl, true);
	
	var that = this;
	
	xhr.onreadystatechange = function() {
		
		if (this.readyState != 4) return;

		if (this.status == 200) {
			
			var data = JSON.parse(this.responseText);

			console.log("this.responseText = ", this.responseText);
			
			that._responseReceived(data);
					
		}
		else{
			
			that._responseError(this.response);
			
			console.log("Error on server");
		}
		
	};

	xhr.send();

}

MainScreen.prototype._destroyOldWeatherGraphics = function(){
	
	if(this._weatherImage !== null){
		
		GraphicsManager.prototype.destroyObject(this._weatherImage);		
	}
	
	this._weatherImage = null;
	
};

MainScreen.prototype._showWeatherGraphics = function(_weather){
	
	this._destroyOldWeatherGraphics();
			
	Main.WAITING_IMAGE_CONTAINER.visible = false;
		
	var graphicsYPos = Main.SCREEN_HEIGHT*0.5 - 160;
		
	if(_weather === "rain"){
						
		this._weatherImage = new PIXI.AnimatedSprite(GraphicsManager.ANIMATIONS['rain_anim']);
		this._weatherImage.animationSpeed = 0.03; 
		this._weatherImage.play(); 
		this._weatherImage.anchor.set(0.5, 0.5);
		this._weatherImage.x = Main.SCREEN_WIDTH*0.5;
		this._weatherImage.y = graphicsYPos; 
		this._graphicsContainer.addChild(this._weatherImage);
		
		this._resetInputFields();
		
	}
	else if(_weather === "cloud"){
						
		this._weatherImage = GraphicsManager.prototype.getSpriteFromSpriteSheet('main_assets', "cloud.png");
		this._weatherImage.anchor.set(0.5, 0.5);
		this._weatherImage.x = Main.SCREEN_WIDTH + this._weatherImage.width * 0.5;
		this._weatherImage.y = graphicsYPos; 
		this._graphicsContainer.addChild(this._weatherImage);
		
		this._resetInputFields();
		
	}
	
	else if(_weather === "clear sky"){

		this._weatherImage = GraphicsManager.prototype.getSpriteFromSpriteSheet('main_assets', "sun.png");
			
		this._weatherImage.anchor.set(0.5, 0.5);
				
		this._weatherImage.x = Main.SCREEN_WIDTH*0.5;
		this._weatherImage.y = graphicsYPos; 
		
		this._weatherImage.scale.x = 0;
		this._weatherImage.scale.y = 0;
		this._weatherImage.alpha = 0;	
		
		this._graphicsContainer.addChild(this._weatherImage);

		var tweenTime = 0.6;
	
		TweenMax.to(this._weatherImage.scale, tweenTime, { x: 1, y: 1, ease:Power1.easeInOut} );
		TweenMax.to(this._weatherImage, tweenTime, { alpha: 1, ease:Power1.easeInOut, onComplete: function(){
								
					this._resetInputFields();
				
		}.bind(this)} );
	}
	
	else{
						
		this._resetInputFields();
	}
								
};

MainScreen.prototype._resetInfoFields = function(){
	
	this._cityText.text = "";
	this._descriptionText.text = "";
	this._temperatureText.text = "";	
	
	this._currentTempInK = null;
	
	this._currentObject = null;
	
	this._destroyOldWeatherGraphics();
	
	this._currentDescription = null;
};

MainScreen.prototype._resetInputFields = function(){
	
	Main.WAITING_IMAGE_CONTAINER.visible = false;
	
	Main.INTERACTION_MANAGER.setInteractive(true);
		
	this._inputBox.text = "";
	
	this._searchButton.setDisabled(true);
	
};

MainScreen.prototype._updateStringFromValues = function(){
	
	var completeString = this._currentObject.name + " | " + this._currentObject.weather[0].description + " | " + this._getTempStringFromKelvin(this._currentTempInK);
		
	this._cityText.text = completeString;
};

MainScreen.prototype._getTempStringFromKelvin = function(_kelvin){
		
	if(this._usingF){
			
		return ((_kelvin*9/5) - 459.67).toFixed(1).toString() + "F";
	}
	else{
		
		return (_kelvin - 273.15).toFixed(1).toString() + "C";
				
	}
};

MainScreen.prototype._checkText = function(_textBox){
	
	return (_textBox && _textBox.text && _textBox.text.length > 0);
	
};

//===================================================
// Public Methods
//===================================================

MainScreen.prototype.update = function(){
	
	if(this._currentDescription === "clear sky" && this._weatherImage !== null){
		
		this._weatherImage.angle = this._weatherImage.angle + 0.2;
	}
	else if(this._currentDescription === "cloud" && this._weatherImage !== null){
		
		this._weatherImage.x = this._weatherImage.x - 2;
		
		if(this._weatherImage.x < -this._weatherImage.width * 0.5){
			
			this._weatherImage.x = Main.SCREEN_WIDTH + this._weatherImage.width * 0.5;			
		}
	}
};

MainScreen.prototype.destroy = function(){
	
	GraphicsManager.prototype.destroyObject(this.titleText);	
	GraphicsManager.prototype.destroyObject(this._graphicsContainer);	
	GraphicsManager.prototype.destroyObject(this._cityText);	
	GraphicsManager.prototype.destroyObject(this._descriptionText);	
	GraphicsManager.prototype.destroyObject(this._temperatureText);	
	GraphicsManager.prototype.destroyObject(this._searchButton);	
	GraphicsManager.prototype.destroyObject(this._unitsToggle);	
	GraphicsManager.prototype.destroyObject(this._unitsText);	
	GraphicsManager.prototype.destroyObject(this._previousSearchesButton);	
	
	Screen.prototype.destroy.call(this);
};

MainScreen.prototype.transitionFinished = function(){
	
	
};

//===================================================
// Events
//===================================================

MainScreen.prototype._textEntered = function(_textBox){
		
	if(this._checkText(_textBox) === true){
		
		this._searchButton.setDisabled(false);
	}
	else{
		
		this._searchButton.setDisabled(true);
	}
};

MainScreen.prototype._unitsToggleButtonPressed = function(){
	
	this._usingF = !this._usingF;
	
	if(this._usingF){
		
		this._unitsText.text = "Units: K";
	}
	else{
		
		this._unitsText.text = "Units: C";
	}
	
	if(this._currentTempInK !== null){
		
		this._updateStringFromValues();
		
		this._temperatureText.text = this._getTempStringFromKelvin(this._currentTempInK);
	}	
};

MainScreen.prototype._searchButtonPressed = function(){
	
	if(this._checkText(this._inputBox) === true){
		
		this._inputBox.blur();
		
		Main.WAITING_IMAGE_CONTAINER.visible = true;
	
		Main.INTERACTION_MANAGER.setInteractive(false);
		
		this._sendRequest(this._inputBox.text);	
	}			
};

MainScreen.prototype._previousSearchesButtonPressed = function(){
	
	var newSearchesPopup = new PreviousSearchesPopupBox(this._interactiveLayer + 1, this._previousSearchesArray);		
	
	newSearchesPopup.addToParent(Main.POP_UP_CONTAINER);	
};

MainScreen.prototype._responseReceived = function(_object){
	
	// Object Example
	/*{"coord":{"lon":-0.13,"lat":51.51},
	"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],
	"base":"stations","main":
	{"temp":286.25,"feels_like":280.37,"temp_min":284.82,"temp_max":288.15,"pressure":1024,"humidity":34},"visibility":10000,"wind":{"speed":5.1,"deg":90},"clouds":{"all":0},"dt":1585145588,"sys":{"type":1,"id":1414,"country":"GB","sunrise":1585115455,"sunset":1585160501},"timezone":0,"id":2643743,"name":"London","cod":200}
	*/
		
	this._previousSearchesArray.push(_object);
	
	this._previousSearchesButton.setDisabled(false);
	
	var tempDescription = _object.weather[0].description;
	
	this._currentTempInK = _object.main.temp;
		
	var graphicsDescription = tempDescription;
	
	if(tempDescription.includes("rain")){
		
		graphicsDescription = "rain";
	}
	else if(tempDescription.includes("cloud")){
		
		graphicsDescription = "cloud";
	}

	this._currentObject = _object;
	this._currentDescription = graphicsDescription;
	
	this._updateStringFromValues();

	this._showWeatherGraphics(graphicsDescription);				
};

MainScreen.prototype._responseError = function(){
	
	var newTemporaryPopup = new TemporaryPopup("City not found: " + this._inputBox.text);		
		
	Main.POP_UP_CONTAINER.addChild(newTemporaryPopup);
	
	this._resetInputFields();
	this._resetInfoFields();		
};


//===================================================
// GETTERS & SETTERS
//===================================================
