#pragma strict

private var gameLogicScript:GameLogic;

function Start():void
{
	gameLogicScript = GameObject.Find("GameLogic").GetComponent(GameLogic) as GameLogic;
}

function OnTriggerEnter(collider:Collider):void
{
	if(collider.gameObject.name == "Player")
	{
		gameLogicScript.addShardScore();
		Destroy(this.gameObject);
	}
}