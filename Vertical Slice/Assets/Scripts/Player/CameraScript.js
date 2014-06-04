#pragma strict

private var target:GameObject = null;

function Start () {
	target = GameObject.Find("Player") as GameObject;
}

function Update () {
	 this.gameObject.transform.position.x = target.transform.position.x;
	 this.gameObject.transform.position.y = target.transform.position.y + 5.0f;
}