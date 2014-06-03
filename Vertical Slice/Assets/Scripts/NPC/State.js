#pragma strict

protected var parent:GameObject;
protected var parentScript:SlugScript;

protected var target:GameObject;

protected var speed:float = 100.0f;

protected var layerMask:int;

function Awake () {
	parent = this.gameObject;
	parentScript = this.gameObject.GetComponent("SlugScript") as SlugScript;
	
	target = GameObject.Find("Player");
	
	layerMask = 1 << 8;
	layerMask = ~layerMask;
}

function update() {
}

function bouncePlayer(direction:String) {
	Debug.Log("Hello world");
	if (direction == "right") {
		target.rigidbody.velocity.x = 15.0f;
	}
	else if (direction == "left") {
		target.rigidbody.velocity.x = -15.0f;
	}
}