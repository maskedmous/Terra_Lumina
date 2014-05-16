#pragma strict

/*
	Contol variables
*/

private var speed:float;
public var maximumAmmo:int = 10;
public var infiniteAmmo:boolean = false;

/*
	Battery variables
*/
public var battery:float = 100;					//current battery
public var maximumBatteryCapacity:int = 100;		//max battery
public var decreaseTimer:float = 1.0;				//every x seconds it decreases battery
public var negativeBatteryFlow:int = 1;			//amount of battery that it decreases
public var positiveBatteryFlow:int = 2;			//amount of battery that it increases
private var charging:boolean = false;
/*
	Win Variables
*/
public var samplesToComplete:int = 0;

/*
	Action energy cost
*/
private var jumpDrain:float;
private var shootDrain:float;
private var pickUpDrain:float;
private var placeDrain:float;
private var flashDrain:float;
private var collectDrain:float;

/*
	Timer variables
*/
private var secondTimer:float = 0;			//counting seconds

/*
	Array Variables
*/
private var plantSamples:Array = new Array();




function Update()
{
	if(!charging)
	{
		decreaseBattery();
	}
	else if(secondTimer != 0)
	{
		secondTimer = 0;
	}
}

function decreaseBattery()
{
	if(secondTimer > decreaseTimer)
	{
		battery -= negativeBatteryFlow;
		secondTimer = 0;
		if (battery < 0.01) gameOver();
	}
	else
	{
		secondTimer += Time.deltaTime;
	}
}

function addBatteryPower()
{
	if(battery < maximumBatteryCapacity)
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

function getPlantSampleCount():int{
	return plantSamples.length;
}

function checkWin():boolean{
	if(samplesToComplete <= getPlantSampleCount()){
		return true;
	}
	else return false;
}

function gameOver():void {
	var endLevelTrigger = GameObject.Find("EndLevelTrigger");
	var levelTriggerScript = endLevelTrigger.GetComponent(LevelTrigger);
	levelTriggerScript.setFinished(true);
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
	newObject.transform.parent = GameObject.Find("SeedContainer").gameObject.transform;
}

function OnGUI()
{
	var cBattery:int = battery;
	GUI.Label(Rect(0,0, 500, 20), ("Batterij Lading: " + cBattery.ToString()));
	GUI.Label(Rect(0, 40, 500, 20), ("Plant Monsters: " + plantSamples.length.ToString()));
	if(infiniteAmmo)
	{
		GUI.Label(Rect(0, 80, 500, 20), ("Aantal zaadjes over: Infinite"));
	}
	else
	{
		GUI.Label(Rect(0, 80, 500, 20), ("Aantal zaadjes over: " + GameObject.Find("Player").GetComponent(PlayerController).getSeeds().ToString() + " / " + maximumAmmo.ToString()));
	}
}

public function setMaximumAmmo(value:int):void
{
	maximumAmmo = value;
}

public function getMaximumAmmo()
{
	return maximumAmmo;
}

public function setInfiniteAmmo(value:boolean):void
{
	infiniteAmmo = value;
}

public function getInfiniteAmmo():boolean
{
	return infiniteAmmo;
}

function getBattery():float
{
	return battery;
}

function setBattery(value:float):void
{
	battery = value;
}

function getBatteryCapacity():int
{
	return maximumBatteryCapacity;
}

function setBatteryCapacity(value:int):void
{
	maximumBatteryCapacity = value;
}

function getDecreaseTimer():float
{
	return decreaseTimer;
}

function setDecreaseTimer(value:float)
{
	decreaseTimer = value;
}

function getNegativeBatteryFlow():int
{
	return negativeBatteryFlow;
}

function setNegativeBatteryFlow(value:int)
{
	negativeBatteryFlow = value;
}

function getPositiveBatteryFlow():int
{
	return positiveBatteryFlow;
}

function setPositiveBatteryFlow(value:int)
{
	positiveBatteryFlow = value;
}

public function setSamplesToComplete(value:int):void
{
	samplesToComplete = value;
}


public function getSamplesToComplete():int
{
	return samplesToComplete;
}

public function getSpeed()
{
	return speed;
}

public function setSpeed(value:float)
{
	speed = value;
}

public function getJumpDrain()
{
	return jumpDrain;
}

public function setJumpDrain(value:float)
{
	jumpDrain = value;
}

public function getShootDrain()
{
	return shootDrain;
}

public function setShootDrain(value:float)
{
	shootDrain = value;
}

public function getPickUpDrain()
{
	return pickUpDrain;
}

public function setPickUpDrain(value:float)
{
	pickUpDrain = value;
}

public function getPlaceDrain()
{
	return placeDrain;
}

public function setPlaceDrain(value:float)
{
	placeDrain = value;
}

public function getFlashDrain()
{
	return flashDrain;
}

public function setFlashDrain(value:float)
{
	flashDrain = value;
}

public function getCollectDrain()
{
	return collectDrain;
}

public function setCollectDrain(value:float)
{
	collectDrain = value;
}

public function setCharging(value:boolean):void
{
	charging = value;
}

public function getCharging():boolean
{
	return charging;
}

