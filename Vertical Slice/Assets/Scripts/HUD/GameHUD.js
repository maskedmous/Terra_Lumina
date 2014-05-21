#pragma strict

//
//Show Battery power
//

private var currentBatteryPower		:float 	   = 0;
private var currentBatteryTexture	:Texture2D = null;
private var currentBatteryRect		:Rect;
private var currentBatteryX			:float	   = 0;
private var currentBatteryY			:float	   = 0;

//1XX
private var batteryNumberTexture1	:Texture2D = null;
private var batteryNumber1Rect		:Rect;
private var batteryNumber1X			:float	   = 95;
private var batteryNumber1Y			:float	   = 146;

//X2X
private var batteryNumberTexture2	:Texture2D = null;
private var batteryNumber2Rect		:Rect;
private var batteryNumber2X			:float	   = 145;
private var batteryNumber2Y			:float	   = 146;
//XX3
private var batteryNumberTexture3	:Texture2D = null;
private var batteryNumber3Rect		:Rect;
private var batteryNumber3X			:float	   = 195;
private var batteryNumber3Y			:float	   = 146;

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

private var highBatteryTexture		:Texture2D = null;
private var mediumBatteryTexture	:Texture2D = null;
private var lowBatteryTexture		:Texture2D = null;

private var scale:Vector3;
private var originalWidth:float = 1920;
private var originalHeight:float = 1080;

private var gameLogic:GameLogic = null;

public function Awake()
{
	var textureLoader:TextureLoader = GameObject.Find("TextureLoader").GetComponent(TextureLoader);
	
	if(textureLoader != null)
	{
		highBatteryTexture 		= textureLoader.getTexture("highBatteryPower");
		mediumBatteryTexture 	= textureLoader.getTexture("mediumBatteryPower");
		lowBatteryTexture 		= textureLoader.getTexture("lowBatteryPower");
		
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
	}
	else
	{
		Debug.LogError("Can't find TextureLoader to load HUD textures");
	}
	
	gameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic);
}

public function OnGUI()
{
	checkBatteryState();
	swapNumbersToTextures();
	scaleHud();
	
	GUI.DrawTexture(currentBatteryRect, currentBatteryTexture);
	
	//draw correct numbers
	if(batteryNumberTexture1 != null)
	{
		GUI.DrawTexture(batteryNumber1Rect, batteryNumberTexture1);
	}
	
	if(batteryNumberTexture2 != null)
	{
		GUI.DrawTexture(batteryNumber2Rect, batteryNumberTexture2);
	}
	
	if(batteryNumberTexture3 != null)
	{
		GUI.DrawTexture(batteryNumber3Rect, batteryNumberTexture3);
	}
}

private function swapNumbersToTextures():void
{
	var batteryPowerString:String = currentBatteryPower.ToString();
	
	var firstNumber:String = "";
	var secondNumber:String = "";
	var thirdNumber:String = "";
	
	if(batteryPowerString.Length > 3)
	{
		batteryPowerString = batteryPowerString.Substring(0, 3);
		Debug.LogError("Length more than 3");
	}
	if(batteryPowerString.Length == 3)
	{
		firstNumber 	= batteryPowerString.Substring(0, 1);
		secondNumber 	= batteryPowerString.Substring(1, 1);
		thirdNumber 	= batteryPowerString.Substring(2, 1);
		
		batteryNumberTexture1 = numberToTexture(firstNumber);
		batteryNumberTexture2 = numberToTexture(secondNumber);
		batteryNumberTexture3 = numberToTexture(thirdNumber);
	}
	else if(batteryPowerString.Length == 2)
	{
		secondNumber 	= batteryPowerString.Substring(0, 1);
		thirdNumber 	= batteryPowerString.Substring(1, 1);
		
		batteryNumberTexture1 = null;
		batteryNumberTexture2 = numberToTexture(secondNumber);
		batteryNumberTexture3 = numberToTexture(thirdNumber);
	}
	else if(batteryPowerString.Length == 1)
	{
		thirdNumber = batteryPowerString;
		
		batteryNumberTexture1 = null;
		batteryNumberTexture2 = null;
		batteryNumberTexture3 = numberToTexture(thirdNumber);
	}
}

private function numberToTexture(number:String):Texture2D
{
	if(number.Contains("0")) return number0;
	if(number.Contains("1")) return number1;
	if(number.Contains("2")) return number2;
	if(number.Contains("3")) return number3;
	if(number.Contains("4")) return number4;
	if(number.Contains("5")) return number5;
	if(number.Contains("6")) return number6;
	if(number.Contains("7")) return number7;
	if(number.Contains("8")) return number8;
	if(number.Contains("9")) return number9;
	
	Debug.LogError("Returning null");
	return null;
}

private function scaleHud():void
{
	//get the current scale by using the current screen size and the original screen size
	//original width / height is defined in a variable at top, we use an aspect ratio of 16:9 and original screen size of 1920x1080
	scale.x = Screen.width / originalWidth;		//X scale is the current width divided by the original width
	scale.y = Screen.height / originalHeight;	//Y scale is the current height divided by the original height
	
	//first put the rectangles back to its original size before scaling
	currentBatteryRect = new Rect(currentBatteryX, currentBatteryY, currentBatteryTexture.width, currentBatteryTexture.height);

	if(batteryNumberTexture1 != null)
	{
		batteryNumber1Rect = new Rect(batteryNumber1X, batteryNumber1Y, batteryNumberTexture1.width, batteryNumberTexture1.height);
		batteryNumber1Rect = scaleRect(batteryNumber1Rect);
	}
	if(batteryNumberTexture2 != null)
	{
		batteryNumber2Rect = new Rect(batteryNumber2X, batteryNumber2Y, batteryNumberTexture2.width, batteryNumberTexture2.height);
		batteryNumber2Rect = scaleRect(batteryNumber2Rect);
	}
	if(batteryNumberTexture3 != null)
	{
		batteryNumber3Rect = new Rect(batteryNumber3X, batteryNumber3Y, batteryNumberTexture3.width, batteryNumberTexture3.height);
		batteryNumber3Rect = scaleRect(batteryNumber3Rect);
	}
	//second scale the rectangles
	currentBatteryRect 	= scaleRect(currentBatteryRect);
	
	
	
}

private function scaleRect(rect:Rect):Rect
{
	var newRect:Rect = new Rect(rect.x * scale.x, rect.y * scale.y, rect.width * scale.x, rect.height * scale.y);
	return newRect;
}

private function checkBatteryState():void
{
	currentBatteryPower = gameLogic.getBattery();
	
	if(currentBatteryPower > 50)
	{
		if(currentBatteryTexture != highBatteryTexture)
		{
			currentBatteryTexture = highBatteryTexture;
		}
	}
	else if(currentBatteryPower > 25 && currentBatteryPower < 50)
	{
		if(currentBatteryTexture != mediumBatteryTexture)
		{
			currentBatteryTexture = mediumBatteryTexture;
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