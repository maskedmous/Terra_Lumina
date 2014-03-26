#pragma strict

private var player:GameObject;

function Start () 
{
	player = GameObject.Find("Player");
	this.gameObject.name = "een steen";
}

function Update () 
{

}

function OnMouseDown()
{
	if (Mathf.Abs(this.gameObject.transform.position.x - player.gameObject.transform.position.x) < 3) {
		player.GetComponent(PlayerController).Add(this.gameObject);
		this.gameObject.transform.position = new Vector3(1000, 1000, 1000);
	}
}