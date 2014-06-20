#pragma strict

import TouchScript;

private var player:GameObject = null;
private var playerController:PlayerController = null;
private var soundEngine:SoundEngineScript = null;
private var gameLogic:GameLogic;

private var inactive					:boolean = false;
private var inactiveTimer				:float = 60.0;

private var shootTimer:float = 0.0f;
private var chargingShot:boolean = false;

private var endLevelTriggerObject:GameObject 	= null;
private var endLevelTriggerScript:LevelTrigger 	= null;

private var jumpButtonEnabled			:boolean = true;
private var flashButtonEnabled			:boolean = true;
private var normalShroomButtonEnabled	:boolean = true;
private var bumpyShroomButtonEnabled	:boolean = true;
private var movementLeftEnabled			:boolean = true;
private var movementRightEnabled		:boolean = true;

private var blinkingCounter				:float 	 = 0.5f;
private var blinkingJumpButton			:boolean = false;
private var blinkingFlashButton			:boolean = false;
private var blinkingNormalShroomButton	:boolean = false;
private var blinkingBumpyShroomButton	:boolean = false;

//an empty guiStyle
private var guiStyle:GUIStyle = new GUIStyle();


//button positions
private var currentJumpButtonTexture	:Texture2D 	= null;
public 	var jumpButtonTexture			:Texture2D 	= null;
public  var jumpButtonInactiveTexture 	:Texture2D 	= null;
public	var jumpButtonActiveTexture		:Texture2D	= null;
private var jumpButtonRect				:Rect;
public  var jumpButtonX					:float = 0.0f;
public 	var jumpButtonY					:float = 780.0f;


private var currentFlashButtonTexture	:Texture2D = null;
public  var flashButtonTexture			:Texture2D = null;
public  var flashButtonInactiveTexture	:Texture2D = null;
public	var flashButtonActiveTexture	:Texture2D = null;
private var flashButtonRect				:Rect;
public  var flashButtonX				:float = 0.0f;
public  var flashButtonY				:float = 900.0f;


private var currentNormalShroomButtonTexture	:Texture2D = null;
public 	var normalShroomButtonTexture			:Texture2D = null;
public  var normalShroomButtonInactiveTexture	:Texture2D = null;
public	var normalShroomButtonActiveTexture		:Texture2D = null;
private var normalShroomButtonRect				:Rect;
public 	var normalShroomButtonX					:float = 1600.0f;
public 	var normalShroomButtonY					:float = 900.0f;


private var currentBumpyShroomButtonTexture :Texture2D = null;
public 	var bumpyShroomButtonTexture		:Texture2D = null;
public 	var bumpyShroomButtonInactiveTexture:Texture2D = null;
public	var bumpyShroomButtonActiveTexture	:Texture2D = null;
private var bumpyShroomButtonRect			:Rect;
public 	var bumpyShroomButtonX				:float = 1600.0f;
public 	var bumpyShroomButtonY				:float = 720.0f;



//scales for button positions
private var originalWidth 	:float = 1920;
private var originalHeight	:float = 1080;
private var scale			:Vector3;

public function Awake():void
{
	playerController = this.gameObject.GetComponent("PlayerController") as PlayerController;
	gameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic) as GameLogic;
	
	if(Application.loadedLevelName == "LevelLoaderScene")
	{
		soundEngine = GameObject.Find("SoundEngine").GetComponent(SoundEngineScript);
	}
	
	currentJumpButtonTexture			= jumpButtonTexture;
	currentFlashButtonTexture			= flashButtonTexture;
	currentNormalShroomButtonTexture 	= normalShroomButtonTexture;
	currentBumpyShroomButtonTexture		= bumpyShroomButtonTexture;
}

public function OnEnable():void
{
	if(TouchManager.Instance != null)
	{
		TouchManager.Instance.TouchesBegan += touchBegan;
		TouchManager.Instance.TouchesEnded += touchEnded;
	}
}

public function OnDisable():void
{
	if(TouchManager.Instance != null)
	{
		TouchManager.Instance.TouchesBegan -= touchBegan;
		TouchManager.Instance.TouchesEnded -= touchEnded;
	}
}

public function Update ():void
{
	if(endLevelTriggerObject == null)
	{
		if(GameObject.Find("EndLevelTrigger") != null)
		{
			endLevelTriggerObject = GameObject.Find("EndLevelTrigger") as GameObject;
			endLevelTriggerScript = endLevelTriggerObject.GetComponent(LevelTrigger) as LevelTrigger;
		}
	}
	else if (!endLevelTriggerScript.getFinished() && !endLevelTriggerScript.getLost())
	{
		checkReleasingButton();
		if (chargingShot) playerController.chargeShot();
		checkAmmo();
		readTouch();
		playerController.brake();
	}
	else if(endLevelTriggerScript.getFinished() || endLevelTriggerScript.getLost())
	{
		playerController.stopMovement();
		playerController.stopControl();
	}
	
	if (shootTimer > 0.0f) shootTimer -= Time.deltaTime;
	
	
	if(!inactive) inactiveTimer = 60.0;
	if(inactive)
	{
		inactiveTimer -= Time.deltaTime;
		print(inactiveTimer);
	}
	if(inactiveTimer <= 0.0)
	{
		Application.LoadLevel("Menu");
	}
}

private function checkAmmo()
{
	if(!gameLogic.getInfiniteAmmo())
	{
		if(gameLogic.getCurrentNormalSeeds() == 0) setNormalShroomButtonEnabled(false);
		else setNormalShroomButtonEnabled(true);
		
		if(gameLogic.getCurrentBumpySeeds() == 0) setBumpyShroomButtonEnabled(false);
		else setBumpyShroomButtonEnabled(true);
	}
}

private function touchBegan(sender:Object, events:TouchEventArgs):void
{
	inactive = false;
	if(endLevelTriggerObject != null)
	{
		if (!endLevelTriggerScript.getFinished() && !endLevelTriggerScript.getLost())
		{
			for each(var touchPoint in events.Touches)
			{
				var position:Vector2 = touchPoint.Position;
				position = new Vector2(position.x, (position.y - Screen.height)*-1);
				
				isPressingButton(position);
			}
		}
	}
}

private function touchEnded(sender:Object, events:TouchEventArgs):void{
	inactive = true;
	print("player no touch screen so inactive = " + inactive);
}

private function checkReleasingButton():void
{
	var jumpingButtonTouched		:boolean = false;
	var flashButtonTouched			:boolean = false;
	var normalShroomButtonTouched	:boolean = false;
	var bumpyShroomButtonTouched	:boolean = false;
	
	for each(var touchPoint in TouchManager.Instance.ActiveTouches)
	{
		var inputXY:Vector2 = touchPoint.Position;
		inputXY = new Vector2(inputXY.x, (inputXY.y - Screen.height)*-1);
		
			if(jumpButtonRect.Contains(inputXY))
			{
				jumpingButtonTouched = true;
			}
			else if (flashButtonRect.Contains(inputXY))
			{
				flashButtonTouched = true;
			}
			else if(normalShroomButtonRect.Contains(inputXY))
			{	
				normalShroomButtonTouched = true;			
			}
			else if(bumpyShroomButtonRect.Contains(inputXY))
			{
				bumpyShroomButtonTouched = true;
			}
	}
	
	//no return so nothing is touched reset the ones that are enabled
		if(jumpButtonEnabled && !blinkingJumpButton && !jumpingButtonTouched)
		{
			currentJumpButtonTexture = jumpButtonTexture;
		}
		
		if (flashButtonEnabled && !blinkingFlashButton && !flashButtonTouched)
		{
			currentFlashButtonTexture = flashButtonTexture;
		}
		
		if(normalShroomButtonEnabled && !blinkingNormalShroomButton && !normalShroomButtonTouched)
		{
			currentNormalShroomButtonTexture = normalShroomButtonTexture;
		}
		
		if(bumpyShroomButtonEnabled && !blinkingBumpyShroomButton && !bumpyShroomButtonTouched)
		{
			currentBumpyShroomButtonTexture = bumpyShroomButtonTexture;
		}
}


private function isPressingButton(inputXY:Vector2):void
{
	inactive = false;
	print("player touches button so inactive = " + inactive);
	if(jumpButtonEnabled)
	{
		if(jumpButtonRect.Contains(inputXY))
		{
			currentJumpButtonTexture = jumpButtonActiveTexture;
			if(blinkingJumpButton) blinkingJumpButton = false;
			playerController.jump();
			chargingShot = false;
			playerController.resetShot();
			return;
		}
	}
	
	if (flashButtonEnabled)
	{
		if (flashButtonRect.Contains(inputXY))
		{
			currentFlashButtonTexture = flashButtonActiveTexture;
			if(blinkingFlashButton) blinkingFlashButton = false;
			playerController.flash();
			playerController.resetShot();
			return;
		}
	}
	
	if(normalShroomButtonEnabled)
	{
		if(normalShroomButtonRect.Contains(inputXY))
		{	
			currentNormalShroomButtonTexture = normalShroomButtonActiveTexture;
			if (shootTimer <= 0.0f) {	
				if (!chargingShot) chargingShot = true;
				else
				{
					if(blinkingNormalShroomButton) blinkingNormalShroomButton = false;
					playerController.shoot(0);
					chargingShot = false;
					shootTimer = 2.0f;
				}
			}
			return;			
		}
	}
	
	if(bumpyShroomButtonEnabled)
	{
		if(bumpyShroomButtonRect.Contains(inputXY))
		{
			currentBumpyShroomButtonTexture = bumpyShroomButtonActiveTexture;
			if (shootTimer <= 0.0f)
			{	
				if (!chargingShot) chargingShot = true;
				else
				{
					if(blinkingBumpyShroomButton) blinkingBumpyShroomButton = false;
					playerController.shoot(1);
					chargingShot = false;
					shootTimer = 2.0f;
				}
			}
			return;
		}
	}
}

private function isTouchingButton(inputXY:Vector2):boolean
{	
	if(jumpButtonRect.Contains(inputXY))
	{
		return true;
	}
	if(flashButtonRect.Contains(inputXY))
	{
		return true;
	}
	if(normalShroomButtonRect.Contains(inputXY))
	{			
		return true;
	}
	if(bumpyShroomButtonRect.Contains(inputXY))
	{
		return true;
	}
	
	return false;
}

public function OnGUI()
{
	if(endLevelTriggerObject != null)
	{
		if (!endLevelTriggerScript.getFinished() && !endLevelTriggerScript.getLost())
		{
			//first scale the buttons before drawing them
			scaleButtons();
			checkBlinkingButtons();
			
			//if the jump button is enabled it will be drawn
			if(jumpButtonEnabled)
			{
				//this is the texture of the button
				GUI.DrawTexture(jumpButtonRect, currentJumpButtonTexture);
			}
			else
			{
				//this is the texture of the inactive button
				GUI.DrawTexture(jumpButtonRect, jumpButtonInactiveTexture);
			}
			if (flashButtonEnabled)
			{
				GUI.DrawTexture(flashButtonRect, currentFlashButtonTexture);
			}
			else {
				GUI.DrawTexture(flashButtonRect, flashButtonInactiveTexture);
			}
			
			if(normalShroomButtonEnabled)
			{
				GUI.DrawTexture(normalShroomButtonRect, currentNormalShroomButtonTexture);
			}
			else
			{
				GUI.DrawTexture(normalShroomButtonRect, normalShroomButtonInactiveTexture);
			}
			
			if(bumpyShroomButtonEnabled)
			{
				GUI.DrawTexture(bumpyShroomButtonRect, currentBumpyShroomButtonTexture);

			}
			else
			{
				GUI.DrawTexture(bumpyShroomButtonRect, bumpyShroomButtonInactiveTexture);
			}
		}
	}
}

private function checkBlinkingButtons():void
{
	if(blinkingJumpButton || blinkingFlashButton || blinkingNormalShroomButton || blinkingBumpyShroomButton)
	{
		blinkingCounter -= Time.deltaTime;
		if(blinkingCounter <= 0.0f)
		{
			blinkingCounter = 0.75f;
			
			if(blinkingJumpButton)
			{
				if(currentJumpButtonTexture == jumpButtonTexture) currentJumpButtonTexture = jumpButtonInactiveTexture;
				else currentJumpButtonTexture = jumpButtonTexture;
			}
			else if(blinkingFlashButton)
			{
				if(currentFlashButtonTexture == flashButtonTexture) currentFlashButtonTexture = flashButtonInactiveTexture;
				else currentFlashButtonTexture = flashButtonTexture;
			}
			else if(blinkingNormalShroomButton)
			{
				if(currentNormalShroomButtonTexture == normalShroomButtonTexture) currentNormalShroomButtonTexture = normalShroomButtonInactiveTexture;
				else currentNormalShroomButtonTexture = normalShroomButtonTexture;
			}
			else if(blinkingBumpyShroomButton)
			{
				if(currentBumpyShroomButtonTexture == bumpyShroomButtonTexture) currentBumpyShroomButtonTexture = bumpyShroomButtonInactiveTexture;
				else currentBumpyShroomButtonTexture = bumpyShroomButtonTexture;
			}
		}
	}
}

private function scaleButtons():void
{
	//get the current scale by using the current screen size and the original screen size
	//original width / height is defined in a variable at top, we use an aspect ratio of 16:9 and original screen size of 1920x1080
	scale.x = Screen.width / originalWidth;		//X scale is the current width divided by the original width
	scale.y = Screen.height / originalHeight;	//Y scale is the current height divided by the original height
	
	//first put the rectangles back to its original size before scaling
	jumpButtonRect 			= new Rect(jumpButtonX			, jumpButtonY			, jumpButtonTexture.width			, jumpButtonTexture.height);
	flashButtonRect			= new Rect(flashButtonX			, flashButtonY			, flashButtonTexture.width			, flashButtonTexture.height);
	normalShroomButtonRect	= new Rect(normalShroomButtonX	, normalShroomButtonY	, normalShroomButtonTexture.width	, normalShroomButtonTexture.height);
	bumpyShroomButtonRect  	= new Rect(bumpyShroomButtonX	, bumpyShroomButtonY	, bumpyShroomButtonTexture.width	, bumpyShroomButtonTexture.height);
	
	//second scale the rectangles
	jumpButtonRect 			= scaleRect(jumpButtonRect);
	flashButtonRect			= scaleRect(flashButtonRect);
	normalShroomButtonRect	= scaleRect(normalShroomButtonRect);
	bumpyShroomButtonRect  	= scaleRect(bumpyShroomButtonRect);
}

private function scaleRect(rect:Rect):Rect
{
	var newRect:Rect = new Rect(rect.x * scale.x, rect.y * scale.y, rect.width * scale.x, rect.height * scale.y);
	return newRect;
}

function readTouch()
{
	
	for each(var touch in TouchManager.Instance.ActiveTouches)
	{
	
		inactive = false;
		print("player touches screen so inactive = " + inactive);
	
		var position:Vector2 = touch.Position;
		//sendRay(position);
		
		position = Vector2(position.x, (position.y - Screen.height)*-1);
		
		if(!isTouchingButton(position))
		{
			if (position.x > Screen.width / 2)
			{
				if(movementRightEnabled) playerController.move(position.x);
			}
			if (position.x < Screen.width / 2)
			{
				if(movementLeftEnabled) playerController.move(position.x);
			}

			if (chargingShot)
			{
				chargingShot = false;
				playerController.resetShot();
			}
		}
	}
}

/*private function sendRay(position:Vector2) {
	var ray:Ray = Camera.main.ScreenPointToRay(position);
	var hit:RaycastHit;
	var layerMask:int = 1 << 8;
	layerMask = ~layerMask;
	if (Physics.Raycast(Camera.main.ScreenPointToRay(position), hit, 100.0f, layerMask)) {
		if (hit.collider.gameObject.name == "Player") {
			playerController.flash();
		}
	}
}*/

public function setMovementLeftEnabled(value:boolean):void
{
	movementLeftEnabled = value;
}

public function setMovementRightEnabled(value:boolean):void
{
	movementRightEnabled = value;
}

public function setJumpButtonEnabled(value:boolean):void
{
	jumpButtonEnabled = value;
}

public function setFlashButtonEnabled(value:boolean):void
{
	flashButtonEnabled = value;
}

public function setNormalShroomButtonEnabled(value:boolean):void
{
	normalShroomButtonEnabled = value;
}

public function setBumpyShroomButtonEnabled(value:boolean):void
{
	bumpyShroomButtonEnabled = value;
}

public function setBlinkingJumpButton(value:boolean):void
{
	//if(!value) currentJumpButtonTexture = jumpButtonTexture;
	blinkingJumpButton = value;
}

public function setBlinkingFlashButton(value:boolean):void
{
	//if(!value) currentFlashButtonTexture = flashButtonTexture;
	blinkingFlashButton = value;
}

public function setBlinkingNormalShroomButton(value:boolean):void
{
	//if(!value) currentNormalShroomButtonTexture = normalShroomButtonTexture;
	blinkingNormalShroomButton = value;
}

public function setBlinkingBumpyShroomButton(value:boolean):void
{
	//if(!value) currentBumpyShroomButtonTexture = bumpyShroomButtonTexture;
	blinkingBumpyShroomButton = value;
}