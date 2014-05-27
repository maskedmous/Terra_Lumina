﻿#pragma strict

//enum tutorial {movementLeftTutorial, movementRightTutorial, jumpTutorial, shootNormalShroomTutorial, shootBumpyShroomTutorial}

//private var tutorialState:tutorial;
private var label:GameObject 				= null;
private var playerInput:PlayerInputScript 	= null;
private var timePassed:float	= 0;

//text to display while inside the box
public var tutorialText:String 	= "";
public var textInSeconds:int 	= 0;

//movement and button availability
public var movementLeftEnabled				:boolean = true;
public var movementRightEnabled				:boolean = true;
public var jumpButtonEnabled				:boolean = false;
public var shootNormalShroomButtonEnabled	:boolean = false;
public var shootBumpyShroomButtonEnabled	:boolean = false;


//alpha GameObject
public var alphaObject:GameObject = null;

//texture for the tutorial to show
private var scale:Vector2;
private var originalWidth	:float = 1920;
private var originalHeight	:float = 1080;
private var showTutorialTextures:boolean = false;

private var tutorialTextureARect:Rect;
public var tutorialTextureA	:Texture2D 	= null;
public var xPositionTexA	:float 		= 0;
public var yPositionTexA	:float 		= 0;
public var timerTexA		:float		= -1;

private var tutorialTextureBRect:Rect;
public var tutorialTextureB	:Texture2D 	= null;
public var xPositionTexB	:float 		= 0;
public var yPositionTexB	:float 		= 0;
public var timerTexB		:float		= -1;

//destroy this tutorial object on exit
public var destroyOnExit:boolean = false;

public function Awake():void
{
	playerInput = GameObject.Find("Player").GetComponent(PlayerInputScript);
}
//Start because label might not be created yet
public function Start ():void
{
	label = GameObject.Find("Label");
	//if the label is still null log the error
	if(label == null)
	{
		Debug.LogError("Not initialized properly");
	}
}

private function scaleButtons():void
{
	//get the current scale by using the current screen size and the original screen size
	//original width / height is defined in a variable at top, we use an aspect ratio of 16:9 and original screen size of 1920x1080
	scale.x = Screen.width / originalWidth;		//X scale is the current width divided by the original width
	scale.y = Screen.height / originalHeight;	//Y scale is the current height divided by the original height
	
	if(tutorialTextureA != null)
	{
		tutorialTextureARect = new Rect(xPositionTexA, yPositionTexA, tutorialTextureA.width, tutorialTextureA.height);
		tutorialTextureARect = scaleRect(tutorialTextureARect);
	}
	if(tutorialTextureB != null)
	{
		tutorialTextureBRect = new Rect(xPositionTexB, yPositionTexB, tutorialTextureB.width, tutorialTextureB.height);
		tutorialTextureBRect = scaleRect(tutorialTextureBRect);
	}
}

private function scaleRect(rect:Rect):Rect
{
	var newRect:Rect = new Rect(rect.x * scale.x, rect.y * scale.y, rect.width * scale.x, rect.height * scale.y);
	return newRect;
}

public function OnGUI()
{
	if(showTutorialTextures)
	{
		scaleButtons();
		
		if(tutorialTextureA != null)
		{
			GUI.DrawTexture(tutorialTextureARect, tutorialTextureA);
		}
		if(tutorialTextureB != null)
		{
			GUI.DrawTexture(tutorialTextureBRect, tutorialTextureB);
		}
	}
}

//enables or disables controls
private function changeControls():void
{
	if(!movementLeftEnabled) playerInput.setMovementLeftEnabled(false);
	else 					 playerInput.setMovementLeftEnabled(true);
	
	
	if(!movementRightEnabled) playerInput.setMovementRightEnabled(false);
	else 					  playerInput.setMovementRightEnabled(true);
	
	
	if(!jumpButtonEnabled) playerInput.setJumpButtonEnabled(false);
	else 				   playerInput.setJumpButtonEnabled(true);
	
	
	if(!shootNormalShroomButtonEnabled) playerInput.setNormalShroomButtonEnabled(false);
	else 								playerInput.setNormalShroomButtonEnabled(true);
	
	
	if(!shootBumpyShroomButtonEnabled) playerInput.setBumpyShroomButtonEnabled(false);
	else 							   playerInput.setBumpyShroomButtonEnabled(true);
}

public function OnTriggerEnter(collider:Collider):void
{
	//change the controls upon entering the trigger box
	if(collider.gameObject.name == "Player")
	{
		changeControls();
		if(tutorialTextureA != null || tutorialTextureB != null)
		{
			showTutorialTextures = true;
		}
	}
}

public function OnTriggerStay (collider:Collider):void
{
	if(collider.gameObject.name == "Player")
	{
		timePassed += Time.deltaTime;
		if(timePassed > textInSeconds)
		{
			label.gameObject.guiText.text = "";
		}
		else
		{
			label.gameObject.guiText.text = tutorialText;
		}
		
		if(timePassed > timerTexA)
		{
			tutorialTextureA = null;
		}
		if(timePassed > timerTexB)
		{
			tutorialTextureB = null;
		}
	}
}

public function OnTriggerExit (collider:Collider):void
{
	label.gameObject.guiText.text = "";
	
	if(destroyOnExit)
	{
		Destroy(this.gameObject);
	}
	
}

//
//setters
//

public function setTutorialText(text:String):void
{
	tutorialText = text;
}

public function setTextInSeconds(value:int):void
{
	textInSeconds = value;
}

public function setAlphaObject(alphaObj:GameObject):void
{
	alphaObject = alphaObj;
}

public function setMovementLeftEnabled(value:boolean):void
{
	movementLeftEnabled = value;
}
public function setMovementRightEnabled(value:boolean):void
{
	movementRightEnabled = value;
}

public function setJumpButtonEnabled(value:boolean):void
{
	jumpButtonEnabled = value;
}
public function setNormalShroomButtonEnabled(value:boolean):void
{
	shootNormalShroomButtonEnabled = value;
}
public function setBumpyShroomButtonEnabled(value:boolean):void
{
	shootBumpyShroomButtonEnabled = value;
}

public function setTutorialTextureA(tex:Texture2D):void
{
	tutorialTextureA = tex;
}
public function setXPositionTexA(value:float):void
{
	xPositionTexA = value;
}
public function setYPositionTexA(value:float):void
{
	yPositionTexA = value;
}
public function setTimerTexA(value:float):void
{
	timerTexA = value;
}

public function setTutorialTextureB(tex:Texture2D):void
{
	tutorialTextureB = tex;
}

public function setXPositionTexB(value:float):void
{
	xPositionTexB = value;
}
public function setYPositionTexB(value:float):void
{
	yPositionTexB = value;
}

public function setTimerTexB(value:float):void
{
	timerTexB = value;
}

public function setDestroyOnExit(value:boolean):void
{
	destroyOnExit = value;
}

//
//getters
//
public function getTutorialText():String
{
	return tutorialText;
}

public function getTextInSeconds():int
{
	return textInSeconds;
}

public function getAlphaObject():GameObject
{
	return alphaObject;
}

public function getMovementLeftEnabled():boolean
{
	return movementLeftEnabled;
}
public function getMovementRightEnabled():boolean
{
	return movementRightEnabled;
}
public function getJumpButtonEnabled():boolean
{
	return jumpButtonEnabled;
}
public function getNormalShroomButtonEnabled():boolean
{
	return shootNormalShroomButtonEnabled;
}
public function getBumpyShroomButtonEnabled():boolean
{
	return shootBumpyShroomButtonEnabled;
}

public function getTutorialTextureA():String
{
	if(tutorialTextureA != null)
	{
		return tutorialTextureA.name;
	}
	
	return "";
}

public function getXPositionTexA():float
{
	return xPositionTexA;
}

public function getYPositionTexA():float
{
	return yPositionTexA;
}

public function getTimerTexA():float
{
	return timerTexA;
}

public function getTutorialTextureB():String
{
	if(tutorialTextureB != null)
	{
		return tutorialTextureB.name;
	}
	return "";
}

public function getXPositionTexB():float
{
	return xPositionTexB;
}

public function getYPositionTexB():float
{
	return yPositionTexB;
}

public function getTimerTexB():float
{
	return timerTexB;
}



public function getDestroyOnExit():boolean
{
	return destroyOnExit;
}
