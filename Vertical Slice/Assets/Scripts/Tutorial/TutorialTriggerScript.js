#pragma strict

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

//public var pngTexture:Texture2D	= null;
//positioninig of the texture


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
	changeControls();
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

public function getDestroyOnExit():boolean
{
	return destroyOnExit;
}
