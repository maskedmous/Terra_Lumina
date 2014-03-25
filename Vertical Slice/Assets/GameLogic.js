#pragma strict

var battery:float = 100;						//current battery
var maximumBatteryCapacity:int = 100;		//max battery

private var secondTimer:float = 0;			//counting seconds
var decreaseTimer:float = 1.0;				//every x seconds it decreases battery

var negativeBatteryFlow:int = 1;			//amount of battery that it decreases
var positiveBatteryFlow:int = 2;			//amount of battery that it increases

private var plantSamples:Array = new Array();

function Update()
{
	decreaseBattery();
}

function decreaseBattery()
{
	if(secondTimer > decreaseTimer)
	{
		battery -= negativeBatteryFlow;
		secondTimer = 0;
	}
	else
	{
		secondTimer += Time.deltaTime;
	}
}

function addBatteryPower()
{
	if(battery < 100)
	{
		battery += positiveBatteryFlow;
	}
	
	if(battery > maximumBatteryCapacity)
	{
		battery = maximumBatteryCapacity;
	}
}

function addPlantSample(newSample:GameObject)
{
	Debug.Log("adding sample!");
	plantSamples.push(newSample);
}

function setPlant(direction:String, endVec:Vector3)
{
	var newObject:GameObject = GameObject.CreatePrimitive(PrimitiveType.Sphere);
	newObject.AddComponent(Rigidbody);
	newObject.AddComponent(LightBeam);
	newObject.gameObject.rigidbody.freezeRotation = true;
	newObject.gameObject.rigidbody.isKinematic = true;
	newObject.transform.position = GameObject.Find("Player").transform.position;
	newObject.name = "Plant";
	newObject.transform.position = endVec;
	
//	if(direction == "Right")
//	{
//		newObject.transform.position.x = GameObject.Find("Player").transform.position.x + 2;
//	}
//	else
//	{
//		newObject.transform.position.x = GameObject.Find("Player").transform.position.x - 2;
//	}
}

function OnGUI()
{
	GUI.Label(Rect(0,0, 500, 20), ("Batterij Lading: " + battery.ToString()));
	GUI.Label(Rect(0, 40, 500, 20), ("Plant Monsters: " + plantSamples.length.ToString()));
}