#pragma strict

private var player:GameObject;
private var playerController:PlayerController;

function Start () 
{
	player = GameObject.Find("Player") as GameObject;
	playerController = player.GetComponent("PlayerController") as PlayerController;
	this.gameObject.name = "een kristal";
}

function Update () 
{

}

function OnMouseDown()
{
	if (Mathf.Abs(this.gameObject.transform.position.x - player.gameObject.transform.position.x) < 3) {
		playerController.addSample(this.gameObject);
		this.gameObject.transform.position = new Vector3(1000, 1000, 1000);
	}
}