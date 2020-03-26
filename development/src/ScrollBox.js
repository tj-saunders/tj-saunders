
// This is the game class. 

//===================================================
// Constructor
//===================================================

function ScrollBox(_scrollBoxWidth, _scrollBoxHeight, _interactiveLayer){

	PIXI.Container.call(this);
	
	_interactiveLayer = _interactiveLayer || 0;
	
	this._interactiveLayer =_interactiveLayer;
	this._scrollBoxWidth = _scrollBoxWidth;
	this._scrollBoxHeight = _scrollBoxHeight;

	this._isMouseDown = false;
	
	// Start positions of the draggable inner container 
	this._containerStartX = 0;
	this._containerStartY = 0;
		
	this._draggingVerticleScrollBar = false;

	//this._screenManager = _screenManager;

	this._init();
};

ScrollBox.prototype = Object.create( PIXI.Container.prototype );
ScrollBox.prototype.constructor = ScrollBox;

//===================================================
// Constants
//===================================================

ScrollBox.SCROLL_SPEED = 1.3;
ScrollBox.MOUSE_SCROLL_SPEED = 50;

//===================================================
// Variables
//===================================================

// This stores all the lines currently in existence
//ScrollBox.prototype._screenManager = null;

ScrollBox.prototype._scrollBoxWidth = null;
ScrollBox.prototype._scrollBoxHeight = null;

//ScrollBox.prototype._callbackFunction = null;
//ScrollBox.prototype._callbackArgs = null;
ScrollBox.prototype._interactiveLayer = null;
ScrollBox.prototype._isMouseDown = null;

ScrollBox.prototype._dragStartX = null;
ScrollBox.prototype._dragStartY = null;

ScrollBox.prototype._containerStartX = null;
ScrollBox.prototype._containerStartY = null;

ScrollBox.prototype._horizontalScrollBar = null;
ScrollBox.prototype._verticalScrollBarHandle = null;
ScrollBox.prototype._verticalScrollBarContainer = null;

ScrollBox.prototype._scrollBarWidth = null;
ScrollBox.prototype._scrollBarHeight = null;

ScrollBox.prototype._scrollBarHandleHeight = null;



ScrollBox.prototype._maxHeight = null;
ScrollBox.prototype._contentsContainer = null;

//===================================================
// Private Methods
//===================================================

ScrollBox.prototype._init = function(){

	this.on('mousedown', (this._mouseDownEvent).bind(this));
	this.on('mouseup', (this._mouseUpEvent).bind(this));
	this.on('mouseupoutside', (this._mouseUpEvent).bind(this));
	
	this.on('mousemove', (this._mouseMoveEvent).bind(this));
	this.on('mouseover', (this._mouseOverEvent).bind(this));
	this.on('mouseout', (this._mouseOutEvent).bind(this));

	this.interactive = true;

	//var tempColour = Utils.getRandomColour();

	this._debugRectangle = new PIXI.Graphics();
	this._debugRectangle.beginFill(0xFF33BB);
	
	this._debugRectangle.drawRect(0, 0, this._scrollBoxWidth, this._scrollBoxHeight);
	this._debugRectangle.alpha = 0.5;
	this._debugRectangle.visible = false;
	this.addChild(this._debugRectangle);


	this._backgroundRectangle = new PIXI.Graphics();
	this._backgroundRectangle.beginFill(0xFF33BB);
	
	this._backgroundRectangle.drawRect(0, 0, this._scrollBoxWidth, this._scrollBoxHeight);
	this.addChild(this._backgroundRectangle);
	
	this._contentsContainer = new PIXI.Container();
	this._contentsContainer.position.x = 0;
	this._contentsContainer.position.y = 0;
	this._contentsContainer.mask = this._backgroundRectangle;
	
	this._maxHeight = 0;
	
	var numCols = 8;
	var numRows = 15;
	
	var tempColour;
	
		
		
	// Test data
	/*for(var i=0; i<numCols; i++){
			
		for(j=0; j<numRows; j++){
			
			tempColour = Utils.getRandomColour();
		
			var tempRect = new PIXI.Graphics();
			tempRect.beginFill(tempColour);
			
			tempRect.drawRect(0, 0, this._scrollBoxWidth * 0.25, this._scrollBoxHeight * 0.25);
			tempRect.position.x = i*this._scrollBoxWidth * 0.25;
			tempRect.position.y = j*this._scrollBoxHeight * 0.25;
			this._contentsContainer.addChild(tempRect);			
		}
					
	}			*/
	
	this.addChild(this._contentsContainer);
	
};


//===================================================
// Public Methods
//===================================================

ScrollBox.prototype.setDebug = function(_debug){
	
	this._debugRectangle.visible = _debug;
};

ScrollBox.prototype.addToContainer = function(_itemToAdd){
	
	this._contentsContainer.addChild(_itemToAdd);
	
	var newHeight = _itemToAdd.y + _itemToAdd.height;
	
	this._maxHeight = Math.max(this._contentsContainer.height, newHeight);
};

ScrollBox.prototype.getContentsHeight = function(){
	
	return this._maxHeight;
};
ScrollBox.prototype.setVerticalScrollBarPosition = function(){
		
	if(this._verticalScrollBarHandle !== null){

		//var maxY = 0;
	
		//var minY = -this.getMinYPos();
		
		var currentYPos = -this._contentsContainer.position.y
		
		var proportion = currentYPos/this.getContentsHeight(); //this._contentsContainer.height;
		
		this._verticalScrollBarHandle.y = this._scrollBarHeight * proportion;
	}		
				
};

ScrollBox.prototype.createVerticalScrollBar = function(){
	//_horizontalScrollBar = null;
	
	this._scrollBarHeight = this._scrollBoxHeight;
	
	this._scrollBarWidth = 8; //14; //12; //20; //16; //12;
	
	if(this.getContentsHeight() > this._scrollBoxHeight){
		
		var proportion = this._scrollBoxHeight / this.getContentsHeight(); //this._contentsContainer.height;
		
		this._scrollBarHandleHeight = this._scrollBarHeight * proportion;
	}
	else{
		
		console.log("ERROR. Trying to add a vertical scroll bar, but the content is not as tall as the scrollbox");
	}
	
	var scrollBarXGap = 9; //5; //8; //5; //3;
			
	this._verticalScrollBarContainer = new PIXI.Container();			
	this._verticalScrollBarContainer.x = this._scrollBoxWidth + scrollBarXGap;
	this._verticalScrollBarContainer.y = (this._scrollBoxHeight - this._scrollBarHeight)*0.5;
	this.addChild(this._verticalScrollBarContainer);
			
	this._verticalScrollBarBackground = new PIXI.Graphics();
	
	this._verticalScrollBarBackground.beginFill(0x888888);	
	this._verticalScrollBarBackground.drawRect(0, 0, this._scrollBarWidth, this._scrollBarHeight);
	this._verticalScrollBarBackground.x = 0;
	this._verticalScrollBarBackground.y = 0;
	this._verticalScrollBarBackground.visible = false;
	
	this._verticalScrollBarContainer.addChild(this._verticalScrollBarBackground);		
			
	this._verticalScrollBarHandle = new PIXI.Graphics();
	//this._verticalScrollBarHandle.lineStyle(1, 0xFF00FF, 1);
	//this._verticalScrollBarHandle.beginFill(0xEEFDFC);	
	this._verticalScrollBarHandle.beginFill(0xeefdfc);	
	//this._verticalScrollBarHandle.beginFill(0x000000);	
	this._verticalScrollBarHandle.drawRoundedRect(0, 0, this._scrollBarWidth, this._scrollBarHandleHeight, 5);
	this._verticalScrollBarHandle.x = 0;
	this._verticalScrollBarHandle.y = 0;
	//this._verticalScrollBarHandle.alpha = 0.7;
	
	this._verticalScrollBarContainer.addChild(this._verticalScrollBarHandle);
	
};

ScrollBox.prototype.update = function(){
	


};

ScrollBox.prototype.destroy = function(){

	Utils.removeAllChildrenFromContainer(this._contentsContainer);
	Utils.removeAllChildrenFromContainer(this);
	
	if(this._verticalScrollBarContainer !== null){
		
		Utils.removeAllChildrenFromContainer(this._verticalScrollBarContainer);		
		
		this._verticalScrollBarContainer = null;
		this._verticalScrollBarBackground = null;
		this._verticalScrollBarHandle = null;
	}
	
	this.off('mousedown', (this._mouseDownEvent).bind(this));
	this.off('mouseup', (this._mouseUpEvent).bind(this));
	this.off('mousemove', (this._mouseMoveEvent).bind(this));
	this.off('mouseover', (this._mouseOverEvent).bind(this));
	this.off('mouseout', (this._mouseOutEvent).bind(this));
};

ScrollBox.prototype.scrollByAmount = function(_xChange, _yChange){
	
	var newContainerPosX = this._containerStartX + _xChange; 
		
	var minX = 0;
	
	if(this._contentsContainer.width > this._scrollBoxWidth){
		
		minX = -(this._contentsContainer.width - this._scrollBoxWidth);
	}
	
	var maxX = 0;
	
	newContainerPosX = Math.max(minX, newContainerPosX);
	newContainerPosX = Math.min(maxX, newContainerPosX);
		
	this._contentsContainer.position.x = newContainerPosX;
	
	
	var newContainerPosY = this._containerStartY + _yChange; 
	
	var minY = 0;
	
	//if(this._contentsContainer.height > this._scrollBoxHeight){
	if(this.getContentsHeight() > this._scrollBoxHeight){
		
		minY = -(this.getContentsHeight() - this._scrollBoxHeight);
	}
	
	var maxY = 0;
	
	newContainerPosY = Math.max(minY, newContainerPosY);
	newContainerPosY = Math.min(maxY, newContainerPosY);
		
	this._contentsContainer.position.y = newContainerPosY;
	
	this.setVerticalScrollBarPosition();
	
};

ScrollBox.prototype.getMinYPos = function(){
	
	var minY = 0;
	
	//if(this._contentsContainer.height > this._scrollBoxHeight){
	if(this.getContentsHeight() > this._scrollBoxHeight){
		
		//minY = -(this._contentsContainer.height - this._scrollBoxHeight);
		minY = -(this.getContentsHeight() - this._scrollBoxHeight);
	}
	
	return minY;
	
};

ScrollBox.prototype.mouseWheelScrolled = function(_sign){
	
	var diffY = -ScrollBox.MOUSE_SCROLL_SPEED * _sign;
	
	var newContainerPosY = this._contentsContainer.position.y + diffY; 
	
	var minY = 0;
	
	//if(this._contentsContainer.height > this._scrollBoxHeight){
	if(this.getContentsHeight() > this._scrollBoxHeight){
		
		//minY = -(this._contentsContainer.height - this._scrollBoxHeight);
		minY = -(this.getContentsHeight() - this._scrollBoxHeight);
	}
	
	var maxY = 0;
	
	newContainerPosY = Math.max(minY, newContainerPosY);
	newContainerPosY = Math.min(maxY, newContainerPosY);
		
	this._contentsContainer.position.y = newContainerPosY;
	
	this.setVerticalScrollBarPosition();
	
};

//===================================================
// Events
//===================================================

ScrollBox.prototype._mouseDownEvent = function(e){
	
	console.log("mouse down event on Button");
	
	if(Main.interactionManager.isInteractive(this._interactiveLayer) === false) { return };
	//if(this._interactiveLayer !== Main.interactionManager.getCurrentLayer()) { return };
	
	e.stopPropagation();
	
	//console.log("mouse down event: ");
	//console.log(e);

	this._isMouseDown = true;
	

	
	
	this._containerStartX = this._contentsContainer.position.x;
	this._containerStartY = this._contentsContainer.position.y;
	
	this._dragStartX = e.data.global.x;
	this._dragStartY = e.data.global.y;	
	
		// Need test to see if we're on the scroll bar here or not
	if(this._verticalScrollBarContainer !== null && this._dragStartX >= this._verticalScrollBarContainer.x){
		
		// Need to check it's actually on the bar here
		
		var handleYStart = this._verticalScrollBarContainer.y + this._verticalScrollBarHandle.y;
		var handleYEnd = handleYStart + this._scrollBarHandleHeight;
						
		this._draggingVerticleScrollBar = true;									
	}
	else{
		
		this._draggingVerticleScrollBar = false;
		
		/*this._containerStartX = this._contentsContainer.position.x;
		this._containerStartY = this._contentsContainer.position.y;
		
		this._dragStartX = e.data.global.x;
		this._dragStartY = e.data.global.y;*/
		
	}
			
	

	/*if(this._callbackFunction){
		
		this._callbackFunction(this._callbackArgs);
	}*/
	
	//console.log(e);
};

ScrollBox.prototype._mouseUpEvent = function(e){
			
	if(Main.interactionManager.isInteractive(this._interactiveLayer) === false) { return };		
	//if(this._interactiveLayer !== Main.interactionManager.getCurrentLayer()) { return };
	
	e.stopPropagation();
			
	this._isMouseDown = false;
	
	this._draggingVerticleScrollBar = false;
	
	//console.log("mouse up event on Button");
};

ScrollBox.prototype._mouseMoveEvent = function(e){
	
	if(Main.interactionManager.isInteractive(this._interactiveLayer) === false) { return };
	//if(this._interactiveLayer !== Main.interactionManager.getCurrentLayer()) { return };
	
	if(this._isMouseDown === true){
		
		if(isNaN(e.data.global.x) === true || isNaN(e.data.global.y) === true){ return; }
		
		var xDiff = (e.data.global.x - this._dragStartX);
		var yDiff = (e.data.global.y - this._dragStartY);
		
		if(this._draggingVerticleScrollBar === false){		
		
			//this.scrollByAmount(xDiff * ScrollBox.SCROLL_SPEED, yDiff * ScrollBox.SCROLL_SPEED);
		}
		else{
			
			var ratio = this._scrollBarHeight / this._scrollBarHandleHeight
	
			this.scrollByAmount(0, -yDiff * ratio);						
		}														
	}
					
	e.stopPropagation();
	
	//console.log("mouse move event on Button");
};


ScrollBox.prototype._mouseOverEvent = function(e){
			
	if(Main.interactionManager.isInteractive(this._interactiveLayer) === false) { return };
	/*if(this._interactiveLayer !== Main.interactionManager.getCurrentLayer()) { return };
	
	e.stopPropagation();
			
	this._isMouseDown = false;*/
	
	//console.log("mouse over event on Button");
};

ScrollBox.prototype._mouseOutEvent = function(e){
			
	if(Main.interactionManager.isInteractive(this._interactiveLayer) === false) { return };		
	//if(this._interactiveLayer !== Main.interactionManager.getCurrentLayer()) { return };
	
	e.stopPropagation();
			
	//this._isMouseDown = false;
	
	//console.log("mouse out event on Button");
};

//===================================================
// GETTERS & SETTERS
//===================================================


//Map.prototype.getWidth = function(){ return this._buttonWidth; };
//Button.prototype.getHeight = function(){ return this._buttonHeight; };


