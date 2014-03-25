#pragma strict

protected var parent:GameObject;
protected var parentScript;

function Start () {
	parent = this.gameObject;
	parentScript = this.gameObject.GetComponent("SlugScript");
}

function update () {
	Debug.Log("Hello world.");
}