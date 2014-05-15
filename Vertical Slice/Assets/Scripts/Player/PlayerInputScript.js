#pragma strict

private var player:GameObject;
private var playerController:PlayerController;

//private var chargingJump:boolean;
private var chargingShot:boolean;

function Awake() {
	player = this.gameObject;
	playerController = player.GetComponent("PlayerController") as PlayerController;
}

function Start () {

}

function Update () {
	//if (chargingJump) playerController.chargeJump();
	if (chargingShot) playerController.chargeShot();
	else if (Input.GetMouseButton(0)) readTouch();
	playerController.brake();
}

public function OnGUI() {
	if (GUI.Button(new Rect(0, Screen.height * (5.0 / 6.0), Screen.width * (1.0 / 6.0), Screen.height * (1.0 / 6.0)), "Jump")) {
		/*if (!chargingJump) chargingJump = true;
		else {
			playerController.jump();
			chargingJump = false;
		}*/
		playerController.jump();
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

function readTouch() {
	if (Input.mousePosition.y > Screen.height * (1.0 / 6.0)) playerController.move(Input.mousePosition.x);
}

function OnMouseDown() {
	//if (!chargingJump && !chargingShot) playerController.flash();
	if (!chargingShot) playerController.flash();
}