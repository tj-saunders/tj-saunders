
// This is the game class. 

//===================================================
// Constructor
//===================================================

function GraphicsManager(){

	GraphicsManager.PRELOAD_LOADER = new PIXI.Loader();
};

//===================================================
// Constants
//===================================================

GraphicsManager.TEXTURES = null
GraphicsManager.ANIMATIONS = null

GraphicsManager.PRELOAD_LOADER = null;

GraphicsManager.ASSET_FOLDER_PATH = "assets/graphics/";

GraphicsManager.FONT = "Verdana";
GraphicsManager.FONT_WEIGHT_NORMAL = "normal";

//===================================================
// Variables
//===================================================

GraphicsManager.prototype._preloaderGraphicsLoadedCallback = null;
GraphicsManager.prototype._loadingUpdateCallback = null;
GraphicsManager.prototype._loadingProgressAmount = null;

GraphicsManager.prototype._graphicsLoadedCallback = null;

//===================================================
// Private Methods
//===================================================


//===================================================
// Public Methods
//===================================================

GraphicsManager.prototype.loadPreloaderAssets = function(_callback){
	
	this._preloaderGraphicsLoadedCallback = _callback;
	
	GraphicsManager.PRELOAD_LOADER.add('preloader_assets', GraphicsManager.ASSET_FOLDER_PATH + 'preloader_assets.json');
	
	GraphicsManager.PRELOAD_LOADER.load(this._preloaderGraphicsAssetsLoaded.bind(this));
};

GraphicsManager.prototype._preloaderGraphicsAssetsLoaded = function(loader, resources) {
		
	GraphicsManager.TEXTURES = {};	
		
	GraphicsManager.TEXTURES['preloader_assets'] = resources['preloader_assets'].textures;
	
	this._preloaderGraphicsLoadedCallback();
};

GraphicsManager.prototype.loadAssets = function(_callback, _loadingUpdateCallback){
	
	this._graphicsLoadedCallback = _callback;
	this._loadingUpdateCallback = _loadingUpdateCallback;
	
	this._loadingProgressAmount = 0;

	var numberItems = 0;
		
	PIXI.Loader.shared.add('main_assets', GraphicsManager.ASSET_FOLDER_PATH + 'main_assets.json');
	numberItems += 1;
	
	PIXI.Loader.shared.add('rain_anim', GraphicsManager.ASSET_FOLDER_PATH + 'rain_anim/rain_anim.json');
	numberItems += 1;
		
	PIXI.Loader.shared.add('waiting', GraphicsManager.ASSET_FOLDER_PATH + 'waiting_anim/waiting.json');
	numberItems += 1;
						
	// Because it loads the json and the image as two separate things
	numberItems = numberItems * 2;
										
	var percentagePerItem = 1 / numberItems;

	PIXI.Loader.shared.onLoad.add( function(a, b, c){
		
		this._loadingProgressAmount += percentagePerItem;
		
		this._loadingUpdateCallback(this._loadingProgressAmount, this._loadingProgressAmount);
	}.bind(this));
		
	PIXI.Loader.shared.load(this._graphicsAssetsLoaded.bind(this));	
	
};

GraphicsManager.prototype._soundAssetsLoaded = function(loader, resources) {
	
	Main.SOUNDS = {};
		
	Main.SOUNDS['sound_theme_music'] = resources['sound_theme_music'].sound;
	
	Main.SOUNDS['sound_theme_music'].volume = 0.4;
	Main.SOUNDS['sound_theme_music'].loop = true;
	
	Main.SOUNDS['sound_Cash_Deduct'] = resources['sound_Cash_Deduct'].sound;			
};

GraphicsManager.prototype._graphicsAssetsLoaded = function(loader, resources) {

	//this._soundAssetsLoaded(loader, resources);
			
	GraphicsManager.TEXTURES['main_assets'] = resources['main_assets'].textures;
									
	GraphicsManager.ANIMATIONS = {};
	
	GraphicsManager.ANIMATIONS['waiting'] =  GraphicsManager.createAnimationFromSheetsWithName(resources, "waiting", ['waiting'], [4]); 
	GraphicsManager.ANIMATIONS['rain_anim'] =  GraphicsManager.createAnimationFromSheetsWithName(resources, "rain_anim", ['rain_anim'], [2]); 
		
	this._graphicsLoadedCallback();	
};

GraphicsManager.prototype.getSpriteFromSpriteSheetAtSize = function(_textureName, _spriteName, _width, _height){
	
	var sheet = GraphicsManager.TEXTURES[_textureName]
	
	var newSprite = new PIXI.Sprite(sheet[_spriteName]);
	
	newSprite.width = _width;
	newSprite.height = _height;
	
	return newSprite;
};

GraphicsManager.prototype.getSpriteFromSpriteSheet = function(_textureName, _spriteName){
	
	var sheet = GraphicsManager.TEXTURES[_textureName];
	
	return new PIXI.Sprite(sheet[_spriteName]);	
};

GraphicsManager.prototype.getSpriteFromTilesheet = function(_textureName, _index, _tileWidth, _tileHeight){
	
	var sheetWidth = GraphicsManager.TEXTURES[_textureName].width;
	var sheetHeight = GraphicsManager.TEXTURES[_textureName].height;
	
	var numCols = Math.floor(sheetWidth / _tileWidth);
	var numRows = Math.floor(sheetHeight / _tileHeight);

	var indexCounter = 0;

	var newRectangle = null;

	for(var i=0; i<numRows; i++){
		
		for(var j=0; j<numCols; j++){
			
			if(indexCounter === _index){
				
				newRectangle = new PIXI.Rectangle(j * _tileWidth, i * _tileHeight, _tileWidth, _tileHeight);
			}
									
			indexCounter += 1;
		}
	}

	var newTexture = new PIXI.Texture(GraphicsManager.TEXTURES[_textureName].baseTexture, GraphicsManager.TEXTURES[_textureName].frame);
	
	newTexture.frame = newRectangle;	

	var newSprite = new PIXI.Sprite(newTexture);
	
	return newSprite;
}

GraphicsManager.createAnimationFromSheetsWithName = function(_resources, _animationName, _sheetsArray, _numberFramesArray){
	
	var animFrames = [];
		
	var indexCounter = 1;	
		
	for(var i=0; i<_sheetsArray.length; i++){
		
		var tempSheetName = _sheetsArray[i];
		
		var numberFramesInSheet = _numberFramesArray[i]
		
		for(var j=0; j<numberFramesInSheet; j++){
			
			var numberPrefix = "000";
			
			if(indexCounter > 99){
				
				numberPrefix = "0";
			}
			else if(indexCounter > 9){
				
				numberPrefix = "00";
			}
			
			var tempFrameName = _animationName + numberPrefix + indexCounter.toString() + ".png";
			
			var tempTexture = _resources[tempSheetName].textures[tempFrameName];
			
			animFrames.push(tempTexture);
			
			indexCounter += 1;			
		}				
	}
	
	return animFrames;
};

GraphicsManager.prototype.destroyObject = function(_object){
	
	if(_object && _object.parent){
		
		_object.parent.removeChild(_object);
		_object.destroy();
		_object = null;		
	}			
};


//===================================================
// Events
//===================================================


//===================================================
// GETTERS & SETTERS
//===================================================



