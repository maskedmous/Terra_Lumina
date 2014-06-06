#pragma strict

//gamelogic
private var gameLogic:GameLogic = null;

//private var tutorialState:tutorial;
private var label:GameObject 				= null;
private var playerInput:PlayerInputScript 	= null;
private var timePassed:float	= 0.0f;

//text to display while inside the box
public var tutorialText:String 	= "";
public var textInSeconds:int 	= 0;

//movement and button availability
public var movementLeftEnabled				:boolean = true;
public var movementRightEnabled				:boolean = true;
public var jumpButtonEnabled				:boolean = false;
public var flashButtonEnabled				:boolean = false;
public var shootNormalShroomButtonEnabled	:boolean = false;
public var shootBumpyShroomButtonEnabled	:boolean = false;

//alpha GameObject
public var alphaObject:GameObject = null;

//tutorial kind
public var lightTutorial	:boolean 	= false;
public var slugTutorial		:boolean 	= false;
public var crystalTutorial	:boolean 	= false;

//slug tutorial
public var slugObject:GameObject = null;

//block object
public var blockObject:GameObject = null;

//texture for the tutorial to show
private var scale:Vector2;
private var originalWidth	:float = 1920.0f;
private var originalHeight	:float = 1080.0f;
private var showTutorialTextures:boolean = false;

private var tutorialTextureARect:Rect;
public var tutorialTextureA	:Texture2D 	= null;
public var xPositionTexA	:float 		= 0.0f;
public var yPositionTexA	:float 		= 0.0f;
public var timerTexA		:float		= -1.0f;

private var tutorialTextureBRect:Rect;
public var tutorialTextureB	:Texture2D 	= null;
public var xPositionTexB	:float 		= 0;
public var yPositionTexB	:float 		= 0;
public var timerTexB		:float		= -1;

//destroy this tutorial object on exit
public var destroyOnExit:boolean = false;
public var destroyOnCompletion:boolean = false;

public function Awake():void
{
	playerInput = GameObject.Find("Player").GetComponent(PlayerInputScript) as PlayerInputScript;
	gameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic) as GameLogic;
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

public function OnGUI():void
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
			//tutorialTextureA = null;
		}
		if(timePassed > timerTexB)
		{
			//tutorialTextureB = null;
		}
		
		if(lightTutorial)
		{
			if(gameLogic.getBattery() == gameLogic.getBatteryCapacity())
			{
				playAnimation();
				lightTutorial = false;			//completed objective
			}
		}
		else if(crystalTutorial)
		{
			if(gameLogic.getPlantSampleCount() > 0)
			{
				playAnimation();
				crystalTutorial = false;
			}
		}
		else if(slugTutorial)
		{
			if(slugObject.GetComponent(SlugScript).isWaitState())
			{
				playAnimation();
				slugTutorial = false;
			}
		}
	}
}

public function OnTriggerExit (collider:Collider):void
{
	if(collider.name == "Player")
	{
		label.gameObject.guiText.text = "";
		showTutorialTextures = false;
		
		if(destroyOnExit)
		{
			Destroy(this.gameObject);
		}
	}
}

private function playAnimation():IEnumerator
{
	if(blockObject != null)
	{
		var animation:Animation = blockObject.GetComponent(Animation);
		animation.Play();
		
		yield WaitForSeconds(animation.GetClip("Take 001").length);
		Destroy(blockObject);
		
		if(destroyOnCompletion)
		{
			Destroy(this.gameObject);
		}
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

public function setLightTutorial(value:boolean):void
{
	lightTutorial = value;
}

public function setSlugTutorial(value:boolean):void
{
	slugTutorial = value;
}

public function setCrystalTutorial(value:boolean):void
{
	crystalTutorial = value;
}

public function setSlugObject(slugObj:GameObject):void
{
	slugObject = slugObj;
}

public function setBlockObject(blockObj:GameObject):void
{
	blockObject = blockObj;
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
public function setFlashButtonEnabled(value:boolean):void
{
	flashButtonEnabled = value;
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

public function setDestroyOnCompletion(value:boolean):void
{
	destroyOnCompletion = value;
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
	if(alphaObject != null)
	{
		return alphaObject;
	}
	
	return null;
}

public function getLightTutorial():boolean
{
	return lightTutorial;
}

public function getSlugTutorial():boolean
{
	return slugTutorial;
}

public function getCrystalTutorial():boolean
{
	return crystalTutorial;
}

public function getSlugObject():GameObject
{
	return slugObject;
}

public function getBlockObject():GameObject
{
	return blockObject;
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

public function getDestroyOnCompletion():boolean
{
	return destroyOnCompletion;
}