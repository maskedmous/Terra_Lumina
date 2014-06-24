#pragma strict

private var cam:Camera;
private var speed:float = 70.0f;

function Start ():void {
	cam = Camera.main;
	cam.transform.position.x = GameObject.Find("EndLevelTrigger").transform.position.x;
}

function Update ():void {
	cam.transform.position.x -= speed * Time.deltaTime;
	if (cam.transform.position.x < -19.0f) {
		speed = 0.0f;
		cam.transform.position.x = -19.082;
		startGame();
	}
}

private function startGame():void {
	var tutorialTriggerScript:TutorialTriggerScript = this.gameObject.GetComponent("TutorialTriggerScript") as TutorialTriggerScript;
	var playerInputScript:PlayerInputScript = GameObject.Find("Player").GetComponent("PlayerInputScript") as PlayerInputScript;
	var cameraScript:CameraScript = Camera.main.GetComponent("CameraScript") as CameraScript;
	
	tutorialTriggerScript.setMovementLeftEnabled(true);
	playerInputScript.setMovementLeftEnabled(true);
	cameraScript.setMove(true);
	
	Destroy(this);
}