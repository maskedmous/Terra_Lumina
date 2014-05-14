#pragma strict

protected var parent:GameObject;
protected var parentScript:SlugScript;

function Awake () {
	parent = this.gameObject;
	parentScript = this.gameObject.GetComponent("SlugScript") as SlugScript;
}

function update() {
}