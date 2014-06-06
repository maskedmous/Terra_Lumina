#pragma strict

function OnTriggerEnter(collider:Collider)
{
	if(collider.gameObject.name == "Player")
	{
		GameObject.Find("GameLogic").GetComponent(GameLogic).addShardScore();
		Destroy(this.gameObject);
	}
}