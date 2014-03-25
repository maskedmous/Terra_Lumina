#pragma strict

function OnTriggerEnter()
{
	GameObject.Find("GameLogic").GetComponent(GameLogic).addPlantSample(this.gameObject);
	Destroy(this.gameObject);
}