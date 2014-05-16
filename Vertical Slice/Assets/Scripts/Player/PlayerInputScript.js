#pragma strict

private var player:GameObject = null;
private var playerController:PlayerController = null;

private var chargingJump:boolean = false;
private var chargingShot:boolean = false;

private var endLevelTriggerObject:GameObject = null;
private var endLevelTriggerScript:LevelTrigger = null;

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
		if (chargingJump) playerController.chargeJump();
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
			if (GUI.Button(new Rect(0, Screen.height * (5.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0)), "Jump"))
			{
					if (!chargingJump)
					{
						chargingJump = true;
					}
					else
					{
						playerController.jump();
						chargingJump = false;
					}
			}
			if (GUI.Button(new Rect(Screen.width * (4.0 / 6.0), Screen.height * (5.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0)), "Shoot")) {
				if (!chargingShot) chargingShot = true;
				else {
					playerController.shoot();
					chargingShot = false;
				}
			}
			if (GUI.Button(new Rect(Screen.width * (5.0 / 6.0), Screen.height * (4.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0)), "Normal Shroom")) playerController.setShroom(0);
			if (GUI.Button(new Rect(Screen.width * (5.0 / 6.0), Screen.height * (5.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0)), "Bumpy Shroom")) playerController.setShroom(1);
			
		}
	}
}

function readTouch() {
	if (Input.mousePosition.y > Screen.height * (1.0 / 6.0)) playerController.move(Input.mousePosition.x);
}

function OnMouseDown() {
	if (!chargingJump && !chargingShot) playerController.flash();
	//if (!chargingShot) playerController.flash();
}