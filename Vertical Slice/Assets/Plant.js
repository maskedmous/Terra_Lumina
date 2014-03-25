#pragma strict

function OnTriggerEnter(collider:Collider)
{
	if(collider.gameObject.name == "Player")
	{
		GameObject.Find("GameLogic").GetComponent(GameLogic).addPlantSample(this.gameObject);
		Destroy(this.gameObject);
	}
}