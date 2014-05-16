#pragma strict

public var target:GameObject;

function Start () {
	target = GameObject.Find("Player");
}

function Update () {
	 this.gameObject.transform.position.x = target.transform.position.x;
	 this.gameObject.transform.position.y = target.transform.position.y + 5;
}