#pragma strict

//
//Show Battery power
//
public var currentBatteryTexture	:Texture2D = null;
private var currentBatteryRect		:Rect;
private var currentBatteryX			:float	   = -50.0f;
private var currentBatteryY			:float	   = -19.0f;

private var blinkingCounter:float = 0.5f;
private var showBattery:boolean = true;

public var batteryBarTextures		:Array = new Array();
private var batteryBarTex:Texture2D = null;
private var batteryBarRect			:Rect;
public var batteryBarX				:float = 46.0f;
public var batteryBarY				:float = 33.0f;
private var amountOfBatteryBars		:int   = 0;

public var highBatteryTexture		:Texture2D = null;
public var lowBatteryTexture		:Texture2D = null;

//seeds hud
public var seedsTexture:Texture2D = null;
private var seedsRect:Rect;
public var seedsX:float = 20.0f;
public var seedsY:float = 280.0f;

/*

public var normalSeedsTexture:Texture2D = null;
private var normalSeedsRect:Rect;
public var normalSeedsX:float = 20.0f;
public var normalSeedsY:float = 280.0f;
private var normalSeedsInfinityRect;
public var normalSeedsInfinityX:float = 0.0f;
public var normalSeedsInfinityY:float = 0.0f;

public var bumpySeedsTexture:Texture2D = null;
private var bumpySeedsRect:Rect;
public var bumpySeedsX:float = 20.0f;
public var bumpySeedsY:float = 280.0f;
private var bumpySeedsInfinityRect;
public var bumpySeedsInfinityX:float = 0.0f;
public var bumpySeedsInfinityY:float = 0.0f;

private var fontSkin:GUIStyle = new GUIStyle();

*/
public var infinity:Texture2D = null;
private var infinityRect:Rect;
private var infiniteAmmo:boolean = false;
public var infinityAmmoX:float = 120.0f;
public var infinityAmmoY:float = 300.0f;

//crystals hud
private var crystalsTotal:int;
private var crystalsCollected:int;

public var crystalActive:Texture2D = null;
private var crystalActiveRect:Rect;
public var crystalActiveX:float = 205.0f;
public var crystalActiveY:float = 80.0f;

public var crystalInactive:Texture2D = null;
private var crystalInactiveRect:Rect;
public var crystalInactiveX:float = 205.0f;
public var crystalInactiveY:float = 80.0f;

private var scale:Vector3;
private var originalWidth:float = 1920.0f;
private var originalHeight:float = 1080.0f;

private var gameLogic:GameLogic = null;

public function Awake()
{
	var textureLoader:TextureLoader = null;
	if(GameObject.Find("TextureLoader") != null) textureLoader = GameObject.Find("TextureLoader").GetComponent(TextureLoader);
	
	if(textureLoader != null)
	{
		highBatteryTexture 		= textureLoader.getTexture("BatteryNormal");
		lowBatteryTexture 		= textureLoader.getTexture("BatteryDanger");
		currentBatteryTexture = highBatteryTexture;
		
		infinity = textureLoader.getTexture("infinity");
		seedsTexture = textureLoader.getTexture("SeedElement");
		//normalSeedsTexture = textureLoader.getTexture("NormalSeedElement");
		//bumpySeedsTexture = textureLoader.getTexture("BumpySeedElement");
		
		crystalActive = textureLoader.getTexture("Crystal Active");
		crystalInactive = textureLoader.getTexture("Crystal Inactive");
		
		for(var i:int = 0; i < 10; ++i)
		{
			batteryBarTextures.push(textureLoader.getTexture("BatteryBar"+i.ToString()));
		}
		
		batteryBarTex = batteryBarTextures[0] as Texture2D;
	}
	
	gameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic);
	checkInfiniteAmmo();
}

private function checkInfiniteAmmo():IEnumerator
{
	yield WaitForEndOfFrame;
	infiniteAmmo = gameLogic.getInfiniteAmmo();
}

public function OnGUI():void
{
	checkBatteryState();
	scaleHud();
	crystalsTotal = gameLogic.getCrystalsToComplete();
	crystalsCollected = gameLogic.getCrystalsSampleCount();
	
	if(showBattery && currentBatteryTexture != null)
	{
		GUI.DrawTexture(currentBatteryRect, currentBatteryTexture);
	
		if(batteryBarTextures.Count > 0)
		{
			for(var j:int = 0; j < amountOfBatteryBars; j++)
			{
				var batteryBarTexture:Texture2D = batteryBarTextures[j] as Texture2D;
				//draw from bot to top
				GUI.DrawTexture(new Rect(batteryBarRect.x, batteryBarRect.y, batteryBarRect.width, batteryBarRect.height), batteryBarTexture);
			}
		}
	}
	if(crystalActive != null && crystalInactive != null)
	{
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
	
	//draw the seed hud
	if(seedsTexture != null)
	{
		GUI.DrawTexture(seedsRect, seedsTexture);
	}
	//GUI.DrawTexture(normalSeedsRect, normalSeedsTexture);
	//GUI.DrawTexture(bumpySeedsRect, bumpySeedsRect);
	
	if(infiniteAmmo && infinity != null)
	{
		//draw infinite sign
		GUI.DrawTexture(infinityRect, infinity);
		//GUI.DrawTexture(normalSeedsInfinityRect, infinity);
		//GUI.DrawTexture(bumpySeedsInfinityRect, infinity);
	}
	else
	{
		var currentNormalAmmo:int = gameLogic.getCurrentNormalSeeds();
		var maximumNormalAmmo:int = gameLogic.getMaximumNormalSeeds();
		
		var currentBumpyAmmo:int = gameLogic.getCurrentBumpySeeds();
		var maximumBumpyAmmo:int = gameLogic.getMaximumBumpySeeds();
		//draw currentAmmo / maximum ammo
		//
	}
}

private function scaleHud():void
{
	//get the current scale by using the current screen size and the original screen size
	//original width / height is defined in a variable at top, we use an aspect ratio of 16:9 and original screen size of 1920x1080
	scale.x = Screen.width / originalWidth;		//X scale is the current width divided by the original width
	scale.y = Screen.height / originalHeight;	//Y scale is the current height divided by the original height
	
	
	//battery bar holder
	if(currentBatteryTexture != null)
	{
		currentBatteryRect = new Rect(currentBatteryX, currentBatteryY, currentBatteryTexture.width, currentBatteryTexture.height);
		currentBatteryRect 	= scaleRect(currentBatteryRect);
	}
	//bars
	if(batteryBarTex != null)
	{
		batteryBarRect = new Rect(batteryBarX, batteryBarY, batteryBarTex.width, batteryBarTex.height);
		batteryBarRect = scaleRect(batteryBarRect);
	}
	
	if(crystalInactive != null && crystalActive != null)
	{
		crystalInactiveRect = new Rect(crystalInactiveX, crystalInactiveY, crystalInactive.width, crystalInactive.height);
		crystalInactiveRect = scaleRect(crystalInactiveRect);
		
		crystalActiveRect = new Rect(crystalActiveX, crystalActiveY, crystalActive.width, crystalActive.height);
		crystalActiveRect = scaleRect(crystalActiveRect);
	}
	if(seedsTexture != null)
	{
		seedsRect = new Rect(seedsX, seedsY, seedsTexture.width, seedsTexture.height);
		seedsRect = scaleRect(seedsRect);
	}
	if(infiniteAmmo && infinity != null)
	{
		infinityRect = new Rect(infinityAmmoX, infinityAmmoY, infinity.width, infinity.height);
		infinityRect = scaleRect(infinityRect);
	}
}

private function scaleRect(rect:Rect):Rect
{
	var newRect:Rect = new Rect(rect.x * scale.x, rect.y * scale.y, rect.width * scale.x, rect.height * scale.y);
	return newRect;
}

private function checkBatteryState():void
{
	var maxBattery:float = gameLogic.getBatteryCapacity();
	var currentBatteryPower		:float 	   = gameLogic.getBattery();
	
	amountOfBatteryBars = currentBatteryPower / (maxBattery / 10);
	
	if(amountOfBatteryBars >= 5)
	{
		if(currentBatteryTexture != highBatteryTexture)
		{
			currentBatteryTexture = highBatteryTexture;
		}
		
		if(!showBattery) showBattery = true;
	}
	else if(amountOfBatteryBars <= 4)
	{
		
		if(currentBatteryTexture != lowBatteryTexture)
		{
			currentBatteryTexture = lowBatteryTexture;
		}
		if(amountOfBatteryBars >= 4 && !showBattery) showBattery = true;
		
		if(amountOfBatteryBars <= 3)
		{
			blinkingCounter -= Time.deltaTime;
			
			if(blinkingCounter < 0)
			{
				blinkingCounter = 0.75f;
				if(showBattery) showBattery = false;
				else showBattery = true;
			}
		}
	}
}