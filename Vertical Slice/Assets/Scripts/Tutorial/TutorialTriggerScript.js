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

////non animated
//public var pngTexture				:Texture2D	= null;
//public var xPositionTexture			:float		= 99999;
//public var yPositionTexture			:float		= 99999;
//
////animated
//public var animatedPng				:boolean	= false;
//public var pngAnimatedTexture		:GameObject = null;
//public var xPositionAnimatedTexture :float		= 99999;
//public var yPositionAnimatedTexture :float		= 99999;


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

public function getTutorialText():String
{
	return tutorialText;
}

public function setTutorialText(text:String):void
{
	tutorialText = text;
}