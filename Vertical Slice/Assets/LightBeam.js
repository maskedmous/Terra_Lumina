#pragma strict

var secondTimer:float = 0;
var increaseBatteryTimer:float = 0.4;
var growTimer:float = 1.0;

function OnTriggerStay(hit:Collider)
{
	//if it hits anything execute code
	if(hit.gameObject.name == "Player")
	{
		charge();
	}
	
	if(hit.gameObject.name == "Plant")
	{
		grow(hit.gameObject);
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

function grow(plant:GameObject)
{
	Debug.Log("growing plant");
	if(secondTimer > growTimer && plant.transform.localScale.x < 2)
	{
		plant.transform.localScale.x *= 1.2;
		plant.transform.localScale.y *= 1.2;
		plant.transform.localScale.z *= 1.2;
		secondTimer = 0;
	}
	else
	{
		secondTimer += Time.deltaTime;
	}
}