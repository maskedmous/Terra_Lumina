#pragma strict

private var label:GameObject;
private var labelScript:LabelScript;

function Start () {
	label = Instantiate(Resources.Load("Prefabs/Label")) as GameObject;
	labelScript = label.GetComponent("LabelScript") as LabelScript;
}

function Update () {

}

function displayFact() {
	labelScript.displayFact();
}

function stopDisplay() {
	labelScript.stopDisplay();
}