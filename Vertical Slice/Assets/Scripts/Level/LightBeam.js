#pragma strict

var secondTimer:float = 0;
var increaseBatteryTimer:float = 0.4;
var growTimer:float = 1.0;
private var growing:boolean = true;

public var grownPlant:GameObject;

function OnTriggerStay(hit:Collider)
{
	//if it hits anything execute code
	if(hit.gameObject.name == "Player")
	{
		charge();
		displayFact();
	}
	
	if(hit.gameObject.name == "Plant")
	{
		grow(hit.gameObject);
	}
}

function OnTriggerExit(hit:Collider) 
{
	if (hit.gameObject.name == "Player")
	{
		stopDisplay();
	}
}

function charge()
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

function displayFact()
{
	GameObject.Find("Player").GetComponent(FunFactScript).displayFact();
}

function stopDisplay()
{
	GameObject.Find("Player").GetComponent(FunFactScript).stopDisplay();
}

function grow(plant:GameObject)
{
	if(secondTimer > growTimer && plant.transform.localScale.x < 2)
	{
		plant.transform.localScale.x *= 1.2;
		plant.transform.localScale.y *= 1.2;
		plant.transform.localScale.z *= 1.2;
		plant.transform.position.y+= 0.1;
		secondTimer = 0;
	}
	else
	{
		secondTimer += Time.deltaTime;
		
		if(plant.transform.localScale.x >= 2)
		{
			growing = false;
			var newPlant:GameObject = Instantiate(grownPlant, plant.transform.position - new Vector3(0,1,0), Quaternion.identity);
			Destroy(plant);
		}
	}
}