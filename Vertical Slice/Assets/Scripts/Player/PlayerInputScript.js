#pragma strict

private var player:GameObject = null;
private var playerController:PlayerController = null;

//private var chargingJump:boolean = false;
private var chargingShot:boolean = false;

private var endLevelTriggerObject:GameObject = null;
private var endLevelTriggerScript:LevelTrigger = null;

private var jumpButtonEnabled:boolean = true;
private var normalShroomButtonEnabled:boolean = true;
private var bumpyShroomButtonEnabled:boolean = true;
private var movementLeftEnabled:boolean = true;
private var movementRightEnabled:boolean = true;

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
			if(jumpButtonEnabled)
			{
				if (GUI.Button(new Rect(0, Screen.height * (5.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0)), "Jump"))
				{
					playerController.jump();
				}
			}
			if(normalShroomButtonEnabled)
			{
				if (GUI.Button(new Rect(Screen.width * (5.0 / 6.0), Screen.height * (4.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0)), "Normal Shroom"))
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
				if (GUI.Button(new Rect(Screen.width * (5.0 / 6.0), Screen.height * (5.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0)), "Bumpy Shroom"))
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
	
	var jumpButtonRect			:Rect 	= new Rect(0, Screen.height * (5.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0));
	var normalShroomButtonRect	:Rect 	= new Rect(Screen.width * (5.0 / 6.0), Screen.height * (4.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0));
	var bumpyShroomButtonRect	:Rect 	= new Rect(Screen.width * (5.0 / 6.0), Screen.height * (5.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0));
	
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