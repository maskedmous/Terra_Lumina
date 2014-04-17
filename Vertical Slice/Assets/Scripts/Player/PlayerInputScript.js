#pragma strict

private var player:GameObject;
private var playerController:PlayerController;

private var chargingJump:boolean;
private var chargingShot:boolean;

function Awake() {
	player = this.gameObject;
	playerController = player.GetComponent("PlayerController") as PlayerController;
}

function Start () {

}

function Update () {
	if (chargingJump) playerController.chargeJump();
	else if (chargingShot) playerController.chargeShot();
	else if (Input.GetMouseButton(0)) readTouch();
	else playerController.brake();
}

public function OnGUI() {
	if (GUI.Button(new Rect(0, Screen.height - 75, 150, 75), "Jump")) {
		if (!chargingJump) chargingJump = true;
		else {
			playerController.jump();
			chargingJump = false;
		}
	}
	if (GUI.Button(new Rect(Screen.width - 300, Screen.height - 75, 150, 75), "Shoot")) {
		if (!chargingShot) chargingShot = true;
		else {
			playerController.shoot();
			chargingShot = false;
		}
	}
	if (GUI.Button(new Rect(Screen.width - 150, Screen.height - 150, 150, 75), "Normal Shroom")) playerController.setShroom(0);
	if (GUI.Button(new Rect(Screen.width - 150, Screen.height - 75, 150, 75), "Bumpy Shroom")) playerController.setShroom(1);
}

function readTouch() {
	playerController.move(Input.mousePosition.x);
}

function OnMouseDown() {
	if (!chargingJump && !chargingShot) playerController.flash();
}