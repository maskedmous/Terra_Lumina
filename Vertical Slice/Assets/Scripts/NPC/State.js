#pragma strict

protected var parent:GameObject;
protected var parentScript:SlugScript;

protected var target:GameObject;

function Awake () {
	parent = this.gameObject;
	parentScript = this.gameObject.GetComponent("SlugScript") as SlugScript;
	
	target = GameObject.Find("Player");
}

function update() {
}