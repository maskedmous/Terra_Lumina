 #pragma strict

/*
	Contol variables
*/

private var speed:float = 0.0f;
public var maximumAmmo:int = 10;
public var infiniteAmmo:boolean = false;
private var playerController:PlayerController = null;
/*
	Battery variables
*/
public var battery:float = 100.0f;					//current battery
public var maximumBatteryCapacity:int = 100.0f;		//max battery
public var decreaseTimer:float = 1.0f;				//every x seconds it decreases battery
public var negativeBatteryFlow:int = 1;			//amount of battery that it decreases
public var positiveBatteryFlow:int = 2;			//amount of battery that it increases
private var charging:boolean = false;
private var stopBatteryBool = false;
/*
	Win Variables
*/
public var samplesToComplete:int = 0;
public var maxSamples:int = 3;
public var score:int = 0;
private var lose:boolean = false;

/*
	Action energy cost
*/
private var jumpDrain:float = 0.0f;
private var shootDrain:float = 0.0f;
private var pickUpDrain:float = 0.0f;
private var placeDrain:float = 0.0f;
private var flashDrain:float = 0.0f;
private var collectDrain:float = 0.0f;

/*
	Timer variables
*/
private var secondTimer:float = 0.0f;			//counting seconds
private var levelTimer:float = 0.0f;
private var runTimer:boolean = true;
private var timerInt:int = 0;

/*
	Score Variables
*/
public var techieTime:int = 45;
public var platinumTime:int = 50;
public var goldTime:int = 80;
public var silverTime:int = 130;
public var bronzeTime:int = 180;
public var shardScore:int = 100;

/*
	Array Variables
*/
private var plantSamples:Array = new Array();

/*
	Other
*/
private var levelTriggerScript:LevelTrigger = null;


public function Start():void
{
	startTimer();
	playerController = GameObject.Find("Player").GetComponent(PlayerController) as PlayerController;
}


public function Update():void
{
	if(levelTriggerScript == null && GameObject.Find("EndLevelTrigger") != null)
	{
		levelTriggerScript = GameObject.Find("EndLevelTrigger").GetComponent(LevelTrigger) as LevelTrigger;
	}

	if(runTimer == true)
	{
		levelTimer += Time.deltaTime;
		timerInt = levelTimer;
	}
	if(!charging)
	{
		decreaseBattery();
	}
	else if(secondTimer != 0.0f)
	{
		secondTimer = 0.0f;
	}
	
	if(lose == false)
	{
		checkLose();
	}
}

function decreaseBattery():void
{	
	if(stopBatteryBool == false){
		if(secondTimer > decreaseTimer)
		{
			battery -= negativeBatteryFlow;
			if(battery < 0.0f) battery = 0.0f;
			secondTimer = 0.0f;
		}
		else
		{
			secondTimer += Time.deltaTime;
		}
	}
}

public function decreaseBatteryBy(value:float):void 
{
	battery -= value;
	
	if(battery < 0.0f) battery = 0.0f;	//no negative battery values
}

function addBatteryPower():void
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

function stopBattery():void
{
	stopBatteryBool = true;
}

function checkLose():void
{
	if(battery <= 0.1f)
	{
		gameOverLose();
		lose = true;
	}
}

function addPlantSample(newSample:GameObject):void
{
	plantSamples.push(newSample);
	setScore(100);
}

function getPlantSampleCount():int
{
	return plantSamples.length;
}

function checkWin():boolean 
{
	if(samplesToComplete <= getPlantSampleCount()){
		if(getPlantSampleCount() == maxSamples){
			setScore(200);
			return true;
		}
		else return true;
	}
	
	if(samplesToComplete >= getMaxSamples()){
		if(getPlantSampleCount() == getMaxSamples()){
			return true;
		}
	}
	
	return false;
}

function gameOverWin():void
{
	levelTriggerScript.setFinished(true);
}

function gameOverLose():void
{
	levelTriggerScript.setLost(true);
}

function startTimer():void {
	runTimer = true;
}

function stopTimer():void {
	runTimer = false;
	if(levelTriggerScript.getFinished()){
		if(timerInt <= techieTime){
			setScore(500);
		}
		if(timerInt <= platinumTime && timerInt >= techieTime+1){
			setScore(300);
		}
		if(timerInt <= goldTime && timerInt >= platinumTime+1){
			setScore(200);
		}
		if(timerInt <= silverTime && timerInt >= goldTime+1){
			setScore(150);
		}
		if(timerInt <= bronzeTime && timerInt >= silverTime+1){
			setScore(100);
		}
		if(timerInt >= bronzeTime){
			setScore(0);
		}
		
	}
}

public function addShardScore():void 
{
	setScore(shardScore);
}

public function getCurrentAmmo():int
{
	return playerController.getSeeds();
}

public function setMaximumAmmo(value:int):void
{
	maximumAmmo = value;
}

public function getMaximumAmmo():int
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

function setDecreaseTimer(value:float):void
{
	decreaseTimer = value;
}

function getNegativeBatteryFlow():int
{
	return negativeBatteryFlow;
}

function setNegativeBatteryFlow(value:int):void
{
	negativeBatteryFlow = value;
}

function getPositiveBatteryFlow():int
{
	return positiveBatteryFlow;
}

function setPositiveBatteryFlow(value:int):void
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

public function setScore(value:int):void {
	score += value;
}

public function getScore():int {
	return score;
}

public function getSpeed():float
{
	return speed;
}

public function setSpeed(value:float):void
{
	speed = value;
}

public function getJumpDrain():float
{
	return jumpDrain;
}

public function setJumpDrain(value:float):void
{
	jumpDrain = value;
}

public function getShootDrain():float
{
	return shootDrain;
}

public function setShootDrain(value:float):void
{
	shootDrain = value;
}

public function getPickUpDrain():float
{
	return pickUpDrain;
}

public function setPickUpDrain(value:float):void
{
	pickUpDrain = value;
}

public function getPlaceDrain():float
{
	return placeDrain;
}

public function setPlaceDrain(value:float):void
{
	placeDrain = value;
}

public function getFlashDrain():float
{
	return flashDrain;
}

public function setFlashDrain(value:float):void
{
	flashDrain = value;
}

public function getCollectDrain():float
{
	return collectDrain;
}

public function setCollectDrain(value:float):void
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