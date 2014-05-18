﻿#pragma strict



private var player:GameObject = null;
private var playerController:PlayerController = null;

//private var chargingJump:boolean = false;
private var chargingShot:boolean = false;

private var endLevelTriggerObject:GameObject 	= null;
private var endLevelTriggerScript:LevelTrigger 	= null;

private var jumpButtonEnabled			:boolean = true;
private var normalShroomButtonEnabled	:boolean = true;
private var bumpyShroomButtonEnabled	:boolean = true;
private var movementLeftEnabled			:boolean = true;
private var movementRightEnabled		:boolean = true;

//an empty guiStyle
private var guiStyle:GUIStyle = new GUIStyle();
//button positions
public 	var jumpButtonTexture	:Texture = null;
private var jumpButtonRect		:Rect;
private var jumpButtonX			:float = 0;
public 	var jumpButtonY			:float = 780;

public 	var normalShroomButtonTexture	:Texture2D = null;
private var normalShroomButtonRect		:Rect;
public 	var normalShroomButtonX			:float = 1600;
public 	var normalShroomButtonY			:float = 900;

public 	var bumpyShroomButtonTexture:Texture2D = null;
private var bumpyShroomButtonRect	:Rect;
public 	var bumpyShroomButtonX		:float = 1600;
public 	var bumpyShroomButtonY		:float = 720;

//scales for button positions
private var originalWidth 	:float = 1920;
private var originalHeight	:float = 1080;
private var scale			:Vector3;

public function Awake():void
{
	playerController = this.gameObject.GetComponent("PlayerController") as PlayerController;
}

function Update ()
{
	if(endLevelTriggerObject == null)
	{
		if(GameObject.Find("EndLevelTrigger") != null)
		{
			endLevelTriggerObject = GameObject.Find("EndLevelTrigger") as GameObject;
			endLevelTriggerScript = endLevelTriggerObject.GetComponent(LevelTrigger) as LevelTrigger;
		}
	}
	else if (!endLevelTriggerScript.getFinished()) {
		//if (chargingJump) playerController.chargeJump();
		if (chargingShot) playerController.chargeShot();
		else if (Input.GetMouseButton(0)) readTouch();
		playerController.brake();
	}
	else if(endLevelTriggerScript.getFinished())
	{
		playerController.stopMovement();
		playerController.stopControl();
	}
}

public function OnGUI() {
	if(endLevelTriggerObject != null)
	{
		if (!endLevelTriggerScript.getFinished())
		{
			//first scale the buttons before drawing them
			scaleButtons();
			
			//if the jump button is enabled it will be drawn
			if(jumpButtonEnabled)
			{
				//this is the texture of the button
				GUI.DrawTexture(jumpButtonRect, jumpButtonTexture);
				//this is the button itself
				if (GUI.Button(jumpButtonRect, "", guiStyle))
				{
					playerController.jump();
				}
			}
			
			if(normalShroomButtonEnabled)
			{
				GUI.DrawTexture(normalShroomButtonRect, normalShroomButtonTexture);
				if (GUI.Button(normalShroomButtonRect, "", guiStyle))
				{
					playerController.setShroom(0);
					if (!chargingShot) chargingShot = true;
					else {
						playerController.shoot();
						chargingShot = false;
					}
				}
			}
			if(bumpyShroomButtonEnabled)
			{
				GUI.DrawTexture(bumpyShroomButtonRect, bumpyShroomButtonTexture);
				if (GUI.Button(bumpyShroomButtonRect, "", guiStyle))
				{
					playerController.setShroom(1);
					if (!chargingShot) chargingShot = true;
					else {
						playerController.shoot();
						chargingShot = false;
					}
				}
			}
		}
	}
}

private function scaleButtons():void
{
	//get the current scale by using the current screen size and the original screen size
	//original width / height is defined in a variable at top, we use an aspect ratio of 16:9 and original screen size of 1920x1080
	scale.x = Screen.width / originalWidth;		//X scale is the current width divided by the original width
	scale.y = Screen.height / originalHeight;	//Y scale is the current height divided by the original height
	
	//first put the rectangles back to its original size before scaling
	jumpButtonRect 			= new Rect(jumpButtonX			, jumpButtonY			, jumpButtonTexture.width			, jumpButtonTexture.height);
	normalShroomButtonRect	= new Rect(normalShroomButtonX	, normalShroomButtonY	, normalShroomButtonTexture.width	, normalShroomButtonTexture.height);
	bumpyShroomButtonRect  	= new Rect(bumpyShroomButtonX	, bumpyShroomButtonY	, bumpyShroomButtonTexture.width	, bumpyShroomButtonTexture.height);
	
	//second scale the rectangles
	jumpButtonRect 			= scaleRect(jumpButtonRect);
	normalShroomButtonRect	= scaleRect(normalShroomButtonRect);
	bumpyShroomButtonRect  	= scaleRect(bumpyShroomButtonRect);
}

private function scaleRect(rect:Rect):Rect
{
	var newRect:Rect = new Rect(rect.x * scale.x, rect.y * scale.y, rect.width * scale.x, rect.height * scale.y);
	return newRect;
}

function readTouch()
{
	if(!isTouchingButton())
	{
		if(movementLeftEnabled && Input.mousePosition.x < (Screen.width / 2))
		{
			playerController.move(Input.mousePosition.x);
		}
		else if(movementRightEnabled && Input.mousePosition.x > (Screen.width / 2))
		{
			playerController.move(Input.mousePosition.x);
		}
	}
}

private function isTouchingButton():boolean
{	
	var inputXY:Vector2 = Vector2(Input.mousePosition.x, (Input.mousePosition.y - Screen.height) * -1);
	
	if(jumpButtonRect.Contains(inputXY))
	{
		return true;
	}
	if(normalShroomButtonRect.Contains(inputXY))
	{
		return true;
	}
	if(bumpyShroomButtonRect.Contains(inputXY))
	{
		return true;
	}
	
	return false;
}



function OnMouseDown()
{
	if (!chargingShot) playerController.flash();
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
	normalShroomButtonEnabled = value;
}

public function setBumpyShroomButtonEnabled(value:boolean):void
{
	bumpyShroomButtonEnabled = value;
}