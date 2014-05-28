#pragma strict

import System.IO;
import System.Xml;

enum menuState {mainMenu, startMenu, optionsMenu, creditsMenu}

private var currentMenuState:menuState = menuState.mainMenu;
private var BUTTONWIDTH		:float 		= Screen.width/6;
private var BUTTONHEIGHT	:float 		= Screen.height/8;
private var TEXTUREWIDTH	:float 		= Screen.width/5;
private var TEXTUREHEIGHT	:float 		= Screen.height/6;
private var startButton		:Texture	= null;
private var exitButton		:Texture	= null;
private var settingsButton	:Texture	= null;
private var creditsButton	:Texture	= null;
private var background		:Texture	= null;
private var loadingScreen	:Texture	= null;
private var level1			:Texture	= null;
private var backToMenuButton:Texture	= null;
private var empty			:String = "";
private var skin			:GUIStyle = new GUIStyle();

private var levelFilename:String = "";
private var levels:Array = new Array();
private var xmlLevels:Array = new Array();
private var levelIDs:Array = new Array();
private var levelsXmlFilePath:String = "";
private var startLevelCount:int = 1;

public function Awake():void
{
	DontDestroyOnLoad(this.gameObject);
	//getting the texture loader
	var textureLoader:TextureLoader = GameObject.Find("TextureLoader").GetComponent(TextureLoader);
	//get the textures from the texture loader
	startButton = textureLoader.getTexture("Start");
	exitButton = textureLoader.getTexture("Quit");
	creditsButton = textureLoader.getTexture("Credits");
	settingsButton = textureLoader.getTexture("Settings");
	background = textureLoader.getTexture("Background");
	loadingScreen = textureLoader.getTexture("Loading");
	level1 = textureLoader.getTexture("Level1");
	backToMenuButton = textureLoader.getTexture("Hoofdmenu");
	
	
	//backButton = textureLoader.getTexture("Back");
	
	if(startButton == null || exitButton == null || settingsButton == null || background == null || loadingScreen == null)
	{
		Debug.LogError("one of the textures loaded is null");
	}
	
	levelsXmlFilePath = Application.dataPath + "/LevelsXML/";
	fillXmlLevelArray();
	fillLevelArray();
}

public function OnGUI():void
{
	//background texture
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), background, ScaleMode.StretchToFill, true, 0);
	
	
	switch(currentMenuState)
	{
		case(menuState.mainMenu):
			//start button
			GUI.DrawTexture(new Rect(Screen.width*0, Screen.height*6/24, TEXTUREWIDTH, TEXTUREHEIGHT), startButton, ScaleMode.StretchToFill, true, 0);
			if (GUI.Button(new Rect(Screen.width*0, Screen.height*6/24, BUTTONWIDTH, BUTTONHEIGHT), empty, skin))
			{		  		
		  		currentMenuState = menuState.startMenu;
		  	}
		  	
		  	//settings button
		  	GUI.DrawTexture(new Rect(Screen.width*0, Screen.height*10/24, TEXTUREWIDTH, TEXTUREHEIGHT), settingsButton, ScaleMode.StretchToFill, true, 0);
		  	if (GUI.Button(new Rect(Screen.width*0, Screen.height*10/24, BUTTONWIDTH, BUTTONHEIGHT), empty, skin))
		  	{
		  		print("Settings");
		  		//currentMenuState = menuState.optionsMenu;
		  	}
		  	
		  	//credits button
		  	GUI.DrawTexture(new Rect(Screen.width*0, Screen.height*14/24, TEXTUREWIDTH, TEXTUREHEIGHT), creditsButton, ScaleMode.StretchToFill, true, 0);
		  	if (GUI.Button(new Rect(Screen.width*0, Screen.height*14/24, BUTTONWIDTH, BUTTONHEIGHT), empty, skin))
		  	{
		  		print("Credits");
		  		//currentMenuState = menuState.creditsMenu;
		  	}
		  	
		  	//exit button
		  	GUI.DrawTexture(new Rect(Screen.width*0, Screen.height*18/24, TEXTUREWIDTH, TEXTUREHEIGHT), exitButton, ScaleMode.StretchToFill, true, 0);
			 if (GUI.Button(new Rect(Screen.width*0, Screen.height*18/24, BUTTONWIDTH, BUTTONHEIGHT), empty, skin))
			 {
				print("Quit Game");
				Application.Quit();
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
					GUI.DrawTexture(new Rect(spaceCountX * (levelButtonXSize * 2), spaceCountY * levelButtonYSize, levelButtonXSize, levelButtonYSize), level1, ScaleMode.StretchToFill);
					if(GUI.Button(new Rect(spaceCountX * (levelButtonXSize * 2), spaceCountY * levelButtonYSize, levelButtonXSize, levelButtonYSize), empty, skin))
					{
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
			}

			//next page button (if applicable)
			if(startLevelCount + 5 < levels.length)
			{
				//there are more levels available
				if(GUI.Button(new Rect(Screen.width - levelButtonXSize, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize),"Volgende"))
				{
					startLevelCount += 6;
				}
			}
			//previous page button (if applicable)
			if(startLevelCount > 6)
			{
				if(GUI.Button(new Rect(0, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize), "Terug"))
				{
					startLevelCount -= 6;
				}
			}
			//back button
			
			if(startLevelCount < 6)
			{
				//GUI.DrawTexture(new Rect(0, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize), backToMenuButton, ScaleMode.StretchToFill);
				if(GUI.Button(new Rect(0, levelButtonYSize * 2, levelButtonXSize, levelButtonYSize), backToMenuButton, skin))
				{
					currentMenuState = menuState.mainMenu;
				}
			}
		break;
		
		case(menuState.optionsMenu):
			//show settings (slider volume?)
			//back button
		break;
		case(menuState.creditsMenu):
			//show credits
			//backbutton
		break;
	}
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

private function sortByLevelID()
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

private function setLevelFileNameByInt(level:int):void
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