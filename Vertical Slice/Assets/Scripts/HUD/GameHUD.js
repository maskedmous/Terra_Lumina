#pragma strict

//
//Show Battery power
//
public var currentBatteryTexture	:Texture2D = null;
private var currentBatteryRect		:Rect;
private var currentBatteryX			:float	   = -50;
private var currentBatteryY			:float	   = -19;

private var currentBatteryPower		:float 	   = 0;

private var batteryBarTextures		:Array = new Array();
public var batteryBarTex:Texture2D = null;
private var batteryBarRect			:Rect;
public var batteryBarX				:float = 46;
public var batteryBarY				:float = 33;
private var amountOfBatteryBars		:int   = 0;

private var number0:Texture2D = null;
private var number1:Texture2D = null;
private var number2:Texture2D = null;
private var number3:Texture2D = null;
private var number4:Texture2D = null;
private var number5:Texture2D = null;
private var number6:Texture2D = null;
private var number7:Texture2D = null;
private var number8:Texture2D = null;
private var number9:Texture2D = null;

public var highBatteryTexture		:Texture2D = null;
public var lowBatteryTexture		:Texture2D = null;

private var crystalsTotal:int;
private var crystalsCollected:int;

public var crystalActive:Texture2D = null;
private var crystalActiveRect:Rect;
public var crystalActiveX:float = 205;
public var crystalActiveY:float = 80;

public var crystalInactive:Texture2D = null;
private var crystalInactiveRect:Rect;
public var crystalInactiveX:float = 205;
public var crystalInactiveY:float = 80;

private var scale:Vector3;
private var originalWidth:float = 1920;
private var originalHeight:float = 1080;

private var gameLogic:GameLogic = null;

public function Awake()
{
	var textureLoader:TextureLoader = null;
	textureLoader = GameObject.Find("TextureLoader").GetComponent(TextureLoader);
	
	if(textureLoader != null)
	{
		highBatteryTexture 		= textureLoader.getTexture("BatteryNormal");
		lowBatteryTexture 		= textureLoader.getTexture("BatteryDanger");
		currentBatteryTexture = highBatteryTexture;
		
		number0 = textureLoader.getTexture("number0");
		number1 = textureLoader.getTexture("number1");
		number2 = textureLoader.getTexture("number2");
		number3 = textureLoader.getTexture("number3");
		number4 = textureLoader.getTexture("number4");
		number5 = textureLoader.getTexture("number5");
		number6 = textureLoader.getTexture("number6");
		number7 = textureLoader.getTexture("number7");
		number8 = textureLoader.getTexture("number8");
		number9 = textureLoader.getTexture("number9");
		
		crystalActive = textureLoader.getTexture("Crystal Active");
		crystalInactive = textureLoader.getTexture("Crystal Inactive");
		
		for(var i:int = 0; i < 10; ++i)
		{
			batteryBarTextures.push(textureLoader.getTexture("BatteryBar"+i.ToString()));
		}
		
		batteryBarTex = batteryBarTextures[0] as Texture2D;
	}
	
	gameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic);
}

public function OnGUI():void
{
	checkBatteryState();
	scaleHud();
	crystalsTotal = gameLogic.getSamplesToComplete();
	crystalsCollected = gameLogic.getPlantSampleCount();
	
	GUI.DrawTexture(currentBatteryRect, currentBatteryTexture);
	
	for(var j:int = 0; j < amountOfBatteryBars; j++)
	{
		var batteryBarTexture:Texture2D = batteryBarTextures[j] as Texture2D;
		//draw from bot to top
		GUI.DrawTexture(new Rect(batteryBarRect.x, batteryBarRect.y, batteryBarRect.width, batteryBarRect.height), batteryBarTexture);
	}
	
	//draw the crystals
	for(var i:int = 0; i < crystalsTotal; ++i)
	{
		//amount of crystals you've picked up
		if(i < crystalsCollected && crystalsCollected != 0)
		{
			GUI.DrawTexture(new Rect(crystalActiveRect.x + i * crystalActiveRect.width, crystalActiveRect.y, crystalActiveRect.width, crystalActiveRect.height), crystalActive);
		}
		//amount of crystals you've not picked up yet
		else
		{
			GUI.DrawTexture(new Rect(crystalInactiveRect.x + i * crystalInactiveRect.width, crystalInactiveRect.y, crystalInactiveRect.width, crystalInactiveRect.height), crystalInactive);
		}
	}
}

private function scaleHud():void
{
	//get the current scale by using the current screen size and the original screen size
	//original width / height is defined in a variable at top, we use an aspect ratio of 16:9 and original screen size of 1920x1080
	scale.x = Screen.width / originalWidth;		//X scale is the current width divided by the original width
	scale.y = Screen.height / originalHeight;	//Y scale is the current height divided by the original height
	
	
	//battery bar holder
	currentBatteryRect = new Rect(currentBatteryX, currentBatteryY, currentBatteryTexture.width, currentBatteryTexture.height);
	currentBatteryRect 	= scaleRect(currentBatteryRect);
	
	//bars
	batteryBarRect = new Rect(batteryBarX, batteryBarY, batteryBarTex.width, batteryBarTex.height);
	batteryBarRect = scaleRect(batteryBarRect);
	
	crystalInactiveRect = new Rect(crystalInactiveX, crystalInactiveY, crystalInactive.width, crystalInactive.height);
	crystalInactiveRect = scaleRect(crystalInactiveRect);
	
	crystalActiveRect = new Rect(crystalActiveX, crystalActiveY, crystalActive.width, crystalActive.height);
	crystalActiveRect = scaleRect(crystalActiveRect);
		
}

private function scaleRect(rect:Rect):Rect
{
	var newRect:Rect = new Rect(rect.x * scale.x, rect.y * scale.y, rect.width * scale.x, rect.height * scale.y);
	return newRect;
}

private function checkBatteryState():void
{
	var maxBattery:float = gameLogic.getBatteryCapacity();
	currentBatteryPower = gameLogic.getBattery();
	
	amountOfBatteryBars = currentBatteryPower / (maxBattery / 10);
	
	if(currentBatteryPower >= 30)
	{
		if(currentBatteryTexture != highBatteryTexture)
		{
			currentBatteryTexture = highBatteryTexture;
		}
	}
	else if( currentBatteryPower < 25)
	{
		if(currentBatteryTexture != lowBatteryTexture)
		{
			currentBatteryTexture = lowBatteryTexture;
		}
	}
}