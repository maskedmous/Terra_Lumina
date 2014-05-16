#pragma strict

private var secondTimer:float = 0;
private var increaseBatteryTimer:float = 0.4;

private var gameLogic:GameLogic = null;

//private var growTimer:float = 1.0;
//private var growing:boolean = true;
//
//public var grownPlant:GameObject;

public function Awake():void
{
	gameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic);
}


function OnTriggerStay(hit:Collider)
{
	//if it hits anything execute code
	if(hit.gameObject.name == "Player")
	{
		if(!gameLogic.getCharging())
		{
			gameLogic.setCharging(true);
		}
		charge();
		displayFact();
	}
//	
//	if(hit.gameObject.name == "Plant")
//	{
//		grow(hit.gameObject);
//	}
}

public function OnTriggerExit(hit:Collider) 
{
	if (hit.gameObject.name == "Player")
	{
		gameLogic.setCharging(false);
		stopDisplay();
	}
}

private function charge()
{
	if(secondTimer > increaseBatteryTimer)
	{
		GameObject.Find("GameLogic").GetComponent(GameLogic).addBatteryPower();
		secondTimer = 0;
	}
	else
	{
		secondTimer += Time.deltaTime;
	}
}

private function displayFact():void
{
	GameObject.Find("Player").GetComponent(FunFactScript).displayFact();
}

private function stopDisplay():void
{
	GameObject.Find("Player").GetComponent(FunFactScript).stopDisplay();
}

//function grow(plant:GameObject)
//{
//	if(secondTimer > growTimer && plant.transform.localScale.x < 2)
//	{
//		plant.transform.localScale.x *= 1.2;
//		plant.transform.localScale.y *= 1.2;
//		plant.transform.localScale.z *= 1.2;
//		plant.transform.position.y+= 0.1;
//		secondTimer = 0;
//	}
//	else
//	{
//		secondTimer += Time.deltaTime;
//		
//		if(plant.transform.localScale.x >= 2)
//		{
//			growing = false;
//			var newPlant:GameObject = Instantiate(grownPlant, plant.transform.position - new Vector3(0,1,0), Quaternion.identity);
//			Destroy(plant);
//		}
//	}
//}