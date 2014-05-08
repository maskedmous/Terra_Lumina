#pragma strict

private var tutorialObject:GameObject;
private var tutorialScript:TutorialScript;

function Start () {
	tutorialObject = GameObject.Find("TutorialObject") as GameObject;
	tutorialScript = tutorialObject.GetComponent(TutorialScript) as TutorialScript;
}

function Update () {

}

function OnTriggerEnter(collider:Collider) {
	if (collider.gameObject.name == "Player") {
		tutorialScript.nextHint();
	}
}