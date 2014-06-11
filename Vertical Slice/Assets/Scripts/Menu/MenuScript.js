#pragma strict

import TouchScript;
import System.IO;
import System.Xml;

enum menuState {mainMenu, startMenu, optionsMenu, creditsMenu}

private var currentMenuState:menuState = menuState.mainMenu;
private var BUTTONWIDTH		:float 		= Screen.width/6;
private var BUTTONHEIGHT	:float 		= Screen.height/8;
private var TEXTUREWIDTH	:float 		= Screen.width/5;
private var TEXTUREHEIGHT	:float 		= Screen.height/6;
private var background		:Texture	= null;
private var loadingScreen	:Texture	= null;
private var level1			:Texture	= null;
private var backToMenuButton:Texture	= null;

private var creditsScreen	:Texture2D	= null;

private var empty			:String = "";
private var skin			:GUIStyle = new GUIStyle();

private var levelFilename:String = "";
private var levels:Array = new Array();
private var xmlLevels:Array = new Array();
private var levelIDs:Array = new Array();
private var levelsXmlFilePath:String = "";
private var startLevelCount:int = 1;

//Menu animations
private var menuButtonX				:float;
public var animMultiplier			:int = 900;
private var startAnimFinished		:boolean = false;
private var settingsAnimFinished	:boolean = false;
private var creditsAnimFinished		:boolean = false;
private var clickedStart			:boolean = false;
private var clickedSettings			:boolean = false;
private var clickedCredits			:boolean = false;
private var clickedQuit				:boolean = false;
private var leaveMenuAnim			:boolean = false;
private var menuAnim				:boolean = true;

//button positions
public 	var startButtonTexture	:Texture = null;
public 	var startButtonPressedTexture	:Texture = null;
private var startButtonRect		:Rect;
private var startButtonX			:float = 20.0f;
public 	var startButtonY			:float = 100.0f;

public 	var settingsButtonTexture:Texture2D = null;
public 	var settingsButtonPressedTexture:Texture2D = null;
private var settingsButtonRect	:Rect;
public 	var settingsButtonX		:float = 20.0f;
public 	var settingsButtonY		:float = 330.0f;

public 	var creditsButtonTexture:Texture2D = null;
public 	var creditsButtonPressedTexture:Texture2D = null;
private var creditsButtonRect	:Rect;
public 	var creditsButtonX		:float = 20.0f;
public 	var creditsButtonY		:float = 495.0f;

// settings vars
public var soundSliderTexture		:Texture2D = null;
public var soundSliderThumbTexture	:Texture2D = null;
private var soundSliderRect			:Rect;
public 	var soundSliderX			:float = 200.0f;
public 	var soundSliderY			:float = 675.0f;
private var soundSliderThumbRect	:Rect;
public 	var soundSliderThumbX		:float = 200.0f;
public 	var soundSliderThumbY		:float = 650.0f;
private var soundSetting			:float = 1.0f;
public var sliderSkin				:GUISkin;

private var backToMenuButtonRect	:Rect;
public var backToMenuButtonX		:float = 20.0f;
public var backToMenuButtonY		:float = 400.0f;


public 	var exitButtonTexture	:Texture2D = null;
public 	var exitButtonPressedTexture	:Texture2D = null;
private var exitButtonRect		:Rect;
public 	var exitButtonX			:float = 20.0f;
public 	var exitButtonY			:float = 675.0f;

//scales for button positions
private var originalWidth 	:float = 1920.0f;
private var originalHeight	:float = 1080.0f;
private var scale			:Vector3 = Vector3.zero;

private var soundEngine:SoundEngineScript = null;
private var touchEnabled:boolean = false;



//sound slider
private var min					:float;
private var max					:float;
private var calculationLength	:float;
private var calculation			:float;

public function Awake():void
{
	DontDestroyOnLoad(this.gameObject);
	//getting the texture loader
	var textureLoader:TextureLoader = GameObject.Find("TextureLoader").GetComponent(TextureLoader) as TextureLoader;
	//get the textures from the texture loader
	startButtonTexture = textureLoader.getTexture("startbuttonNormal");
	exitButtonTexture = textureLoader.getTexture("quitbuttonNormal");
	creditsButtonTexture = textureLoader.getTexture("creditsbuttonNormal");
	settingsButtonTexture = textureLoader.getTexture("settingsbuttonNormal");
	
	startButtonPressedTexture = textureLoader.getTexture("startbuttonPressed");
	exitButtonPressedTexture = textureLoader.getTexture("quitbuttonPressed");
	creditsButtonPressedTexture = textureLoader.getTexture("creditsbuttonPressed");
	settingsButtonPressedTexture = textureLoader.getTexture("settingsbuttonPressed");
	background = textureLoader.getTexture("Background");
	loadingScreen = textureLoader.getTexture("Loading");
	level1 = textureLoader.getTexture("Level1");
	backToMenuButton = textureLoader.getTexture("Hoofdmenu");
	soundSliderTexture = textureLoader.getTexture("sliderBackground");
	soundSliderThumbTexture = textureLoader.getTexture("sliderThumb");
	//creditsScreen = textureLoader.getTexture("Credits");
	
	menuButtonX = startButtonX;
	startMenuAnim();
	
	soundEngine = GameObject.Find("SoundEngine").GetComponent(SoundEngineScript) as SoundEngineScript;
	//backButton = textureLoader.getTexture("Back");
	
	min = soundSliderX;
	max = soundSliderTexture.width;
	calculationLength = max - min;
	calculation = (soundSliderThumbX - min) / calculationLength;
	soundEngine.changeVolume(Mathf.Clamp(calculation, 0.0, 1.0));
	
	if(startButtonTexture == null || exitButtonTexture == null || settingsButtonTexture == null || background == null || loadingScreen == null)
	{
		Debug.LogError("one of the textures loaded is null");
	}
	
	levelsXmlFilePath = Application.dataPath + "/LevelsXML/";
	fillXmlLevelArray();
	fillLevelArray();
}

public function OnEnable():void
{
	if(TouchManager.Instance != null)
	{
		TouchManager.Instance.TouchesEnded += touchEnded;
		TouchManager.Instance.TouchesBegan += touchBegan;
		TouchManager.Instance.TouchesMoved += touchMoved;
	}
}

public function OnDisable():void
{
	if(TouchManager.Instance != null)
	{
		TouchManager.Instance.TouchesEnded -= touchEnded;
		TouchManager.Instance.TouchesBegan -= touchBegan;
		TouchManager.Instance.TouchesMoved -= touchMoved;
	}
}

private function calculateSound(){
	calculation = (soundSliderThumbX - min) / calculationLength;
	soundEngine.changeVolume(Mathf.Clamp(calculation, 0.0, 1.0));
}

private function touchMoved(sender:Object, events:TouchEventArgs):void
{
	for each(var touchPoint in events.Touches)
	{
			//print(touchPoint.Position.x);
			if(currentMenuState == menuState.optionsMenu){
				var position:Vector2 = touchPoint.Position;
				position = Vector2(position.x, (position.y - Screen.height)*-1);
				//scaled rect.contains position
				if(soundSliderRect.Contains(position)){
					//sliderEnabled = true;
					soundSliderThumbX = (position.x / scale.x) - (soundSliderThumbTexture.width / 2);
					calculateSound();
				}
			}
			
			//soundSliderThumbRect = new Rect(touchPoint.Position.x, soundSliderThumbRect.yMax, soundSliderThumbTexture.width, soundSliderThumbTexture.height);
	}
}

private function touchBegan(sender:Object, events:TouchEventArgs):void
{
	for each(var touchPoint in events.Touches)
	{
		//print(touchPoint.Position.x);
		if(currentMenuState == menuState.optionsMenu){
			var position:Vector2 = touchPoint.Position;
			position = Vector2(position.x, (position.y - Screen.height)*-1);
			//scaled rect.contains position
			if(soundSliderRect.Contains(position)){
				//sliderEnabled = true;
				soundSliderThumbX = (position.x / scale.x) - ((soundSliderThumbTexture.width / 2));
				calculateSound();
			}
		}
	}
}

private function touchEnded(sender:Object, events:TouchEventArgs):void
{
	for each(var touchPoint in events.Touches)
	{
		var position:Vector2 = touchPoint.Position;
		position = Vector2(position.x, (position.y - Screen.height)*-1);
		isReleasingButton(position);
	}
}

private function isReleasingButton(inputXY:Vector2):void
{
	if(touchEnabled)
	{
		switch(currentMenuState)
		{
			case(menuState.mainMenu):
			if (startButtonRect.Contains(inputXY))
			{		  		
		  		
		  		leaveMenuAnim = clickedStart = true;
		  	}
		  	if (settingsButtonRect.Contains(inputXY))
		  	{
		  		
		  		leaveMenuAnim = clickedSettings = true;
		  	}
		  	if (creditsButtonRect.Contains(inputXY))
		  	{
		  		
		  		//leaveMenuAnim = clickedCredits = true;
		  	}
		  	if (exitButtonRect.Contains(inputXY))
			{
				
				leaveMenuAnim = clickedQuit = true;
			}
			break;
			
			case(menuState.startMenu):
			//show all levels (max 6? per screen)
			var levelCount:int = startLevelCount;
			var spaceCountX:int = 1;
			var spaceCountY:int = 1;
			var levelButtonXSize:float = Screen.width 	/ 9;
			var levelButtonYSize:float = Screen.height 	/ 5;
			
			for(var i:int = startLevelCount; i < startLevelCount + 6; ++i)
			{
				if(i <= levels.length)
				{	
					if(new Rect(spaceCountX * (levelButtonXSize * 2), spaceCountY * levelButtonYSize, levelButtonXSize, levelButtonYSize).Contains(inputXY))
					{
						touchEnabled = false;
						setLevelFileNameByInt(i);
						loadLevel();
					}
					
					spaceCountX ++;
					levelCount ++;
					
					if(levelCount == 4)
					{
						spaceCountY = 3;
						spaceCountX = 1;
					}
				}
				
				//next page button (if applicable)
				if(startLevelCount + 5 < levels.length)
				{
					//there are more levels available
					if(new Rect(Screen.width - levelButtonXSize, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize).Contains(inputXY))
					{
						startLevelCount += 6;
					}
				}
				//previous page button (if applicable)
				if(startLevelCount > 6)
				{
					if(new Rect(0, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize).Contains(inputXY))
					{
						startLevelCount -= 6;
					}
				}
				//back button
				
				if(startLevelCount < 6)
				{
					//GUI.DrawTexture(new Rect(0, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize), backToMenuButton, ScaleMode.StretchToFill);
					if(new Rect(0, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize).Contains(inputXY))
					{
						startMenuAnim();
						currentMenuState = menuState.mainMenu;
						touchEnabled = false;
					}
				}
			}
			break;
			
			case(menuState.optionsMenu):
				if (backToMenuButtonRect.Contains(inputXY))
				{
					startMenuAnim();
					currentMenuState = menuState.mainMenu;
					touchEnabled = false;
				}
			break;
		}
	}
}

public function OnGUI():void
{
	//background texture
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), background, ScaleMode.StretchToFill, true, 0);
	
	//first scale the buttons before drawing them
	scaleButtons();
	
	switch(currentMenuState)
	{
		case(menuState.mainMenu):
		
			if(menuAnim){
				if(startButtonX <= menuButtonX){
					startButtonX += Time.deltaTime * animMultiplier;
					if(startButtonX >= menuButtonX) startAnimFinished = true;
				}
				if(startAnimFinished){
					if(settingsButtonX <= menuButtonX){
						settingsButtonX += Time.deltaTime * animMultiplier;
						if(settingsButtonX >= menuButtonX) settingsAnimFinished = true;
					}
				}
				if(settingsAnimFinished){
					if(creditsButtonX <= menuButtonX){
						creditsButtonX += Time.deltaTime * animMultiplier;
						if(creditsButtonX >= menuButtonX) creditsAnimFinished = true;
					}
				}
				if(creditsAnimFinished){
					if(exitButtonX <= menuButtonX){
						exitButtonX += Time.deltaTime * animMultiplier;
						if(exitButtonX >= menuButtonX){
							menuAnim = false;
							Debug.Log("Executed");
							touchEnabled = true;
						}
					}
				}
			}
			
			if(leaveMenuAnim){
				if(clickedStart){
					if(settingsButtonX > settingsButtonTexture.width *-1) settingsButtonX -= Time.deltaTime * animMultiplier;
					if(creditsButtonX > creditsButtonTexture.width * -1) creditsButtonX -= Time.deltaTime * animMultiplier;
					if(exitButtonX > exitButtonTexture.width * -1) exitButtonX -= Time.deltaTime * animMultiplier;
					
					if(exitButtonX <= exitButtonTexture.width * -1){
						startButtonX -= Time.deltaTime * animMultiplier;
						if(startButtonX <= startButtonTexture.width * -1){
							clickedStart = false;
							leaveMenuAnim = false;
							currentMenuState = menuState.startMenu;
						}
					}
				}
				if(clickedSettings){
					if(startButtonX > startButtonTexture.width *-1) startButtonX -= Time.deltaTime * animMultiplier;
					if(creditsButtonX > creditsButtonTexture.width * -1) creditsButtonX -= Time.deltaTime * animMultiplier;
					if(exitButtonX > exitButtonTexture.width * -1) exitButtonX -= Time.deltaTime * animMultiplier;
					
					if(exitButtonX <= exitButtonTexture.width * -1){
						settingsButtonX -= Time.deltaTime * animMultiplier;
						if(settingsButtonX <= settingsButtonTexture.width * -1){
							clickedSettings = false;
							leaveMenuAnim = false;
							currentMenuState = menuState.optionsMenu;
						}
					}
				}
				if(clickedCredits){
					if(settingsButtonX > settingsButtonTexture.width *-1) settingsButtonX -= Time.deltaTime * animMultiplier;
					if(startButtonX > startButtonTexture.width * -1) startButtonX -= Time.deltaTime * animMultiplier;
					if(exitButtonX > exitButtonTexture.width * -1) exitButtonX -= Time.deltaTime * animMultiplier;
					
					if(exitButtonX <= exitButtonTexture.width * -1){
						creditsButtonX -= Time.deltaTime * animMultiplier;
						if(creditsButtonX <= creditsButtonTexture.width * -1){
							clickedCredits = false;
							leaveMenuAnim = false;
							//currentMenuState = menuState.creditsMenu;
						}
					}
				}
				if(clickedQuit){
					if(settingsButtonX > settingsButtonTexture.width *-1) settingsButtonX -= Time.deltaTime * animMultiplier;
					if(creditsButtonX > creditsButtonTexture.width * -1) creditsButtonX -= Time.deltaTime * animMultiplier;
					if(startButtonX > startButtonTexture.width * -1) startButtonX -= Time.deltaTime * animMultiplier;
					
					if(startButtonX <= startButtonTexture.width * -1){
						exitButtonX -= Time.deltaTime * animMultiplier;
						if(exitButtonX <= exitButtonTexture.width * -1){
							clickedQuit = false;
							leaveMenuAnim = false;
							Application.Quit();
						}
					}
				}
			}
			//start button
			GUI.DrawTexture(startButtonRect, startButtonTexture);
		  	
		  	//settings button
		  	GUI.DrawTexture(settingsButtonRect, settingsButtonTexture);
		  	
		  	//credits button
		  	GUI.DrawTexture(creditsButtonRect, creditsButtonTexture);

		  	//exit button
		  	GUI.DrawTexture(exitButtonRect, exitButtonTexture);
		break;
		
		case(menuState.startMenu):
			//show all levels (max 6? per screen)
			var levelCount:int = startLevelCount;
			var spaceCountX:int = 1;
			var spaceCountY:int = 1;
			var levelButtonXSize:float = Screen.width 	/ 9;
			var levelButtonYSize:float = Screen.height 	/ 5;
			
			for(var i:int = startLevelCount; i < startLevelCount + 6; ++i)
			{
				if(i <= levels.length)
				{
					GUI.DrawTexture(new Rect(spaceCountX * (levelButtonXSize * 2), spaceCountY * levelButtonYSize, levelButtonXSize, levelButtonYSize), level1, ScaleMode.StretchToFill);
					
					spaceCountX ++;
					levelCount ++;
					
					if(levelCount == 4)
					{
						spaceCountY = 3;
						spaceCountX = 1;
					}
				}
			}
			
//				//next page button (if applicable)
//				if(startLevelCount + 5 < levels.length)
//				{
//					//there are more levels available
//					if(GUI.DrawTexture(new Rect(Screen.width - levelButtonXSize, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize), )
//					{
//						startLevelCount += 6;
//					}
//				}
//				//previous page button (if applicable)
//				if(startLevelCount > 6)
//				{
//					if(new Rect(0, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize), )
//					{
//						startLevelCount -= 6;
//					}
//				}
//				//back button
				
				if(startLevelCount < 6)
				{
					//GUI.DrawTexture(new Rect(0, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize), backToMenuButton, ScaleMode.StretchToFill);
					GUI.DrawTexture(new Rect(0, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize), backToMenuButton);
				}
		break;
		
		case(menuState.optionsMenu):
			
			//GUI.skin = sliderSkin;
			//soundSetting = GUI.HorizontalSlider (soundSliderRect, soundSetting, 0.0, 1.0);
			//soundEngine.changeVolume(soundSetting);
			
			GUI.DrawTexture(soundSliderRect, soundSliderTexture);
			GUI.DrawTexture(soundSliderThumbRect, soundSliderThumbTexture);
			
			
			//back button
			GUI.DrawTexture(backToMenuButtonRect, backToMenuButton);

		break;
		case(menuState.creditsMenu):
			//show credits
			//backbutton
		break;
	}
}

private function scaleButtons():void
{
	//get the current scale by using the current screen size and the original screen size
	//original width / height is defined in a variable at top, we use an aspect ratio of 16:9 and original screen size of 1920x1080
	scale.x = Screen.width / originalWidth;		//X scale is the current width divided by the original width
	scale.y = Screen.height / originalHeight;	//Y scale is the current height divided by the original height
	
	//first put the rectangles back to its original size before scaling
	if(currentMenuState == menuState.mainMenu)
	{
		startButtonRect 		= new Rect(startButtonX			, startButtonY			, startButtonTexture.width			, startButtonTexture.height);
		settingsButtonRect  	= new Rect(settingsButtonX	, settingsButtonY	, settingsButtonTexture.width	, settingsButtonTexture.height);
		creditsButtonRect  		= new Rect(creditsButtonX	, creditsButtonY	, creditsButtonTexture.width	, creditsButtonTexture.height);
		exitButtonRect			= new Rect(exitButtonX	, exitButtonY	, exitButtonTexture.width	, exitButtonTexture.height);
		
		//second scale the rectangles
		startButtonRect 	= scaleRect(startButtonRect);
		settingsButtonRect	= scaleRect(settingsButtonRect);
		creditsButtonRect  	= scaleRect(creditsButtonRect);
		exitButtonRect  	= scaleRect(exitButtonRect);
	}
	
	if(currentMenuState == menuState.optionsMenu)
	{
		soundSliderRect 		= new Rect(soundSliderX			, soundSliderY		, soundSliderTexture.width	, soundSliderTexture.height);
		soundSliderThumbRect 	= new Rect(soundSliderThumbX	, soundSliderThumbY	, soundSliderThumbTexture.width	, soundSliderThumbTexture.height);
		backToMenuButtonRect 	= new Rect(backToMenuButtonX	, backToMenuButtonY	, backToMenuButton.width	, backToMenuButton.height);
	
		soundSliderRect  	 = scaleRect(soundSliderRect);
		soundSliderThumbRect = scaleRect(soundSliderThumbRect);
		backToMenuButtonRect = scaleRect(backToMenuButtonRect);
	}
}

private function scaleRect(rect:Rect):Rect
{
	var newRect:Rect = new Rect(rect.x * scale.x, rect.y * scale.y, rect.width * scale.x, rect.height * scale.y);
	return newRect;
}

private function startMenuAnim(){
	startButtonX = startButtonTexture.width * -1;
	settingsButtonX = settingsButtonTexture.width * -1;
	creditsButtonX = creditsButtonTexture.width * -1;
	exitButtonX = exitButtonTexture.width * -1;
	menuAnim = true;
	startAnimFinished = settingsAnimFinished = creditsAnimFinished = false;
}

private function fillXmlLevelArray():void
{
	//look for all levels and fill the array	
	var fileInfo = Directory.GetFiles(levelsXmlFilePath, "*.xml", SearchOption.AllDirectories);
	for(file in fileInfo)
	{
		xmlLevels.push(Path.GetFileName(file));
	}	
	if(xmlLevels.length == 0)
	{
		Debug.LogError("Xml level files not loaded for some reason, check the LevelsXML folder");
	}
	else
	{
		Debug.Log("Xml level files counted: " + xmlLevels.length);
	}
}

private function fillLevelArray():void
{
	if(xmlLevels.length == 0)
	{
		Debug.LogError("No xml levels found in the array can't fill level array");
		return;
	}
	
	var levelErrors:int = 0;
	
	for each(var _level in xmlLevels)
	{
		//level xml name
		var aLevel = _level as String;
		//get level ID from xml
		var levelID:int = getLevelID(aLevel);
		//if levelID is valid
		if(levelID != -1)
		{
			//check if new level ID
			var newLevelID:boolean = checkForNewLevelID(levelID);
			//level difficulty setting
			var levelDifficulty:String = getDifficultySetting(aLevel);
			//create new level
			if(newLevelID == true)
			{
				//new level ID add to levelIDs
				levelIDs.push(levelID);
				//creating a new level
				var newLevel:Level = new Level();
				//setting the ID
				newLevel.setLevelID(levelID);
				//setting the filename for the level difficulty
				newLevel.setLevelDifficultyXmlFile(aLevel, levelDifficulty);
				levels.push(newLevel);
			}
			else
			{
				//is already seen before
				//look through the array and add the difficulty setting
				var oldLevel:Level = getLevelByID(levelID);
				oldLevel.setLevelDifficultyXmlFile(aLevel, levelDifficulty);
			}
		}
		else
		{
			levelErrors ++;
		}
	}
	
	sortByLevelID();
	
	if(levelErrors > 0)
	{
		Debug.LogError("Level errors occured: " + levelErrors);
	}
}

private function sortByLevelID():void
{
	levelIDs.sort();
	
	var sortedArray:Array = new Array();
	
	for(var i:int = 0; i < levelIDs.length; ++i)
	{
		sortedArray.push(getLevelByID(levelIDs[i]));
	}
}

private function getLevelID(levelFilename:String):int
{
	var xmlDocument:XmlDocument = new XmlDocument();
	//read the xml
	xmlDocument.Load(levelsXmlFilePath + levelFilename);
	
	var masterNode:XmlNode = xmlDocument.DocumentElement;
	var masterNodeChildren:XmlNodeList = masterNode.ChildNodes;
	
	//get the level ID
	for each(var _nodes in masterNodeChildren)
	{
		var nodes:XmlNode = _nodes as XmlNode;
		
		if(nodes.Name == "LevelID")
		{
			return int.Parse(nodes.InnerText);
		}
	}
	
	Debug.LogError("LevelID NOT FOUND! re-create xml from level editor: " + levelFilename);
	return -1;
}

private function getLevelByID(levelID):Level
{
	for each(var aLevel in levels)
	{
		var levelScript:Level = aLevel as Level;
		
		if(levelScript.getLevelID() == levelID)
		{
			return levelScript;
		}
	}
	
	Debug.LogError("Level by ID not found? This shouldn't be possible! LevelID: " + levelID);
	return null;
}

private function checkForNewLevelID(aLevelID:int):boolean
{
	var levelID:int = -1;
	
	for each(level in levels)
	{
		var levelScript:Level = level as Level;
		levelID = levelScript.getLevelID();
		if(levelID == aLevelID)
		{
			//level ID is already in the list return false
			return false;
		}
	}
	//this level ID is not in the list yet so this is a new level return true
	return true;
}

private function getDifficultySetting(levelFilename:String):String
{
	var xmlDocument:XmlDocument = new XmlDocument();
	//read the xml
	xmlDocument.Load(levelsXmlFilePath + levelFilename);
	
	var masterNode:XmlNode = xmlDocument.DocumentElement;
	var masterNodeChildren:XmlNodeList = masterNode.ChildNodes;
	
	//get the level ID
	for each(var _nodes in masterNodeChildren)
	{
		var nodes:XmlNode = _nodes as XmlNode;
		
		if(nodes.Name == "Difficulty")
		{
			return nodes.InnerText;
		}
	}
	
	Debug.LogError("Difficulty NOT FOUND! re-create xml from level editor: " + levelFilename);
	return "";
}

private function setLevelFileNameByInt(level:int):IEnumerator
{
	//array position of the Level
	var arrayint:int = level - 1;
	//get difficulty somehow??
	var difficulty:String = "Easy";
	//difficulty = database.getDifficulty()?
	//get the Level
	var aLevel:Level = levels[arrayint] as Level;
	//get the file that has to be loaded
	levelFilename =	aLevel.getLevelXmlByDifficulty(difficulty);
}

private function loadLevel():IEnumerator
{
	//next scene with the loader
	Application.LoadLevel("LevelLoaderScene");
	//first wait for the next scene to loader		  		
	yield WaitForEndOfFrame;
	//get the levelloader script
  	var levelLoader:XmlToScene = GameObject.Find("LevelLoader").GetComponent(XmlToScene);
  	//set the level string
	levelLoader.setLevel(levelFilename);
	//load the level
	levelLoader.loadLevel();
	//destroy this gameobject as we don't need the main menu in the game
	Destroy(this.gameObject);
}