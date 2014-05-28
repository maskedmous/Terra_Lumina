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
public var maxSamples:int = 3;
public var score:int = 0;

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
private var levelTimer:float = 0;
private var runTimer:boolean = true;
private var timerInt:int = 0;

/*
	Score Variables
*/
public var techieTime:int = 45;
public var platinumTime:int = 50;
public var goldTime:int = 65;
public var silverTime:int = 90;
public var bronzeTime:int = 120;

/*
	Array Variables
*/
private var plantSamples:Array = new Array();

private var scale:Vector3;
private var originalWidth:float = 1920;
private var originalHeight:float = 1080;

function Start(){
	startTimer();
}


function Update()
{
	if(runTimer == true){
		levelTimer += Time.deltaTime;
		timerInt = levelTimer;
	}
	if(!charging)
	{
		decreaseBattery();
	}
	else if(secondTimer != 0)
	{
		secondTimer = 0;
	}
}

public function OnGUI():void
{
	scale.x = Screen.width / originalWidth;
	scale.y = Screen.height / originalHeight;
	
	GUI.Label(Rect(0, (375 * scale.y), 500, 20), ("Crystallen: " + plantSamples.length.ToString()));
	if(infiniteAmmo)
	{
		GUI.Label(Rect(0, (425 * scale.y), 500, 20), ("Aantal zaadjes over: Infinite"));
	}
	else
	{
		GUI.Label(Rect(0, 280 * scale.y, 500, 20), ("Aantal zaadjes over: " + GameObject.Find("Player").GetComponent(PlayerController).getSeeds().ToString() + " / " + maximumAmmo.ToString()));
	}
}

function decreaseBattery()
{
	if(secondTimer > decreaseTimer)
	{
		battery -= negativeBatteryFlow;
		secondTimer = 0;
		if (battery < 0.01) gameOverLose();
	}
	else
	{
		secondTimer += Time.deltaTime;
	}
}

public function decreaseBatteryBy(value:float):void {
	battery -= value;
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
	setScore(100);
}

function getPlantSampleCount():int{
	return plantSamples.length;
}

function checkWin():boolean{
	if(samplesToComplete <= getPlantSampleCount()){
		if(getPlantSampleCount() == maxSamples){
			setScore(200);
			print("Congratulations! You got all plant samples, you get 200 bonus points");
			return true;
		}
		else return true;
	}
	
	if(samplesToComplete >= getMaxSamples()){
		print("You need more samples then that exist in the level..");
		if(getPlantSampleCount() == getMaxSamples()){
			return true;
		}
	}
	
	return false;
}

function gameOverWin():void {
	var endLevelTrigger = GameObject.Find("EndLevelTrigger");
	var levelTriggerScript = endLevelTrigger.GetComponent(LevelTrigger);
	levelTriggerScript.setFinished(true);
}

function gameOverLose():void {
	var endLevelTrigger = GameObject.Find("EndLevelTrigger");
	var levelTriggerScript = endLevelTrigger.GetComponent(LevelTrigger);
	levelTriggerScript.setLost(true);
}

function startTimer(){
	runTimer = true;
}

function stopTimer(){
	runTimer = false;
	var endLevelTrigger = GameObject.Find("EndLevelTrigger");
	var levelTriggerScript = endLevelTrigger.GetComponent(LevelTrigger);
	if(levelTriggerScript.getFinished()){
		if(timerInt <= techieTime){
			setScore(500);
			print("Congratulations! You are as fast as a techie, plus 500 points");
		}
		if(timerInt <= platinumTime && timerInt >= techieTime+1){
			setScore(300);
			print("Congratulations! You were really fast, you get 300 bonus points");
		}
		if(timerInt <= goldTime && timerInt >= platinumTime+1){
			setScore(200);
			print("Congratulations! You were  fast, you get 200 bonus points");
		}
		if(timerInt <= silverTime && timerInt >= goldTime+1){
			setScore(150);
			print("Congratulations! You got the silver medal, you get 150 bonus points");
		}
		if(timerInt <= bronzeTime && timerInt >= silverTime+1){
			setScore(100);
			print("Congratulations! You got the bronze medel, you get 100 bonus points");
		}
		if(timerInt >= bronzeTime){
			setScore(0);
			print("Congratulations! You were in time, you get no bonus points however");
		}
		
	}
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

public function setBattery(value:float):void
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

public function setMaxSamples(value:int):void
{
	maxSamples = value;
}

public function getMaxSamples():int
{
	return maxSamples;
}

public function setScore(value:int){
	score += value;
}

public function getScore():int{
	return score;
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

