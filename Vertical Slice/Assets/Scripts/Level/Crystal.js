#pragma strict

function OnTriggerEnter(collider:Collider)
{
	if(collider.gameObject.name == "Player")
	{
		GameObject.Find("GameLogic").GetComponent(GameLogic).addCrystalSample(this.gameObject);
		Destroy(this.gameObject);
	}
}