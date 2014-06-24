#pragma strict

import System.Collections.Generic;

private var cam:Camera;
private var speed:float = 150.0f;
private var timer:float = 1.0f;

private var crystals:GameObject[];
private var crystalPositions:List.<Vector3> = new List.<Vector3>();

private var currentCrystal:int = 0;
private var startPos:Vector3 = Vector3.zero;
private var targetPos:Vector3 = Vector3.zero;

private var gameLogic:GameLogic = null;

function Start ():void {
	cam = Camera.main;
	cam.transform.position.x = GameObject.Find("EndLevelTrigger").transform.position.x;
	
	crystals = GameObject.FindGameObjectsWithTag("Pickup");
	for (var i:int = 0; i < crystals.length; ++i) {
		crystalPositions.Add(crystals[i].transform.position);
	}
	crystalPositions.RemoveAt(0);
	crystalPositions = sort(crystalPositions);
	
	startPos = Camera.main.gameObject.transform.position;
	targetPos = crystalPositions[0];
	
	gameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic);
	gameLogic.stopBattery();
}

function Update ():void {
	moveCamera();
	if (cam.transform.position.x < -19.0f) {
		speed = 0.0f;
		cam.transform.position.x = -19.082;
		startGame();
	}
}

private function moveCamera():void
{
	var camPos:Vector3 = Camera.main.gameObject.transform.position;
	Camera.main.gameObject.transform.position = Vector3.MoveTowards(camPos, targetPos, speed * Time.deltaTime);
	Camera.main.gameObject.transform.position.z = 3.0f;

	if (Mathf.Abs(camPos.x - targetPos.x) < 0.2f) {
		timer -= Time.deltaTime;
		speed = 0.0f;
		if (timer < 0) {
			timer = 1.0f;
			currentCrystal++;
			startPos = targetPos;
			targetPos = crystalPositions[currentCrystal];
			speed = 150.0f;
		}
	}
}

private function sort(list:List.<Vector3>):List.<Vector3>
{
	var newList:List.<Vector3> = new List.<Vector3>();
	var highest:float = int.MinValue;
	var index:int = 0;
	var length:int = list.Count;
	
	for (var l:int = length; l > 0; --l) {
		for (var i:int = 0; i < l; ++i) {
			if (list[i].x > highest) {
				highest = list[i].x;
				index = i;
			}
		}
		newList.Add(list[index]);
		list.RemoveAt(index);
		highest = int.MinValue;
	}
	newList.Add(GameObject.Find("Player").transform.position);
	return newList;
}

private function startGame():void {
	var tutorialTriggerScript:TutorialTriggerScript = this.gameObject.GetComponent("TutorialTriggerScript") as TutorialTriggerScript;
	var playerInputScript:PlayerInputScript = GameObject.Find("Player").GetComponent("PlayerInputScript") as PlayerInputScript;
	var cameraScript:CameraScript = Camera.main.GetComponent("CameraScript") as CameraScript;
	
	tutorialTriggerScript.setMovementLeftEnabled(true);
	tutorialTriggerScript.setCameraMoving(false);
	playerInputScript.setMovementLeftEnabled(true);
	cameraScript.setMove(true);
	
	gameLogic.startBattery();
	
	Destroy(this);
}