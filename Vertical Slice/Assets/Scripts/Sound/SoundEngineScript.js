#pragma strict

function Start () {

}

function Update () {
	if(gameObject.Find("Player")){
		this.gameObject.transform.position = gameObject.Find("Player").transform.position;
	}

}