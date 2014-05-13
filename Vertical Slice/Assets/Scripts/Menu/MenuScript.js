#pragma strict

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
private var empty			:String = "";
private var skin			:GUIStyle = new GUIStyle();


public function Awake():void
{
	//getting the texture loader
	var textureLoader:TextureLoader = GameObject.Find("TextureLoader").GetComponent(TextureLoader);
	//get the textures from the texture loader
	startButton = textureLoader.getTexture("Start");
	exitButton = textureLoader.getTexture("Quit");
	creditsButton = textureLoader.getTexture("Credits");
	settingsButton = textureLoader.getTexture("Settings");
	background = textureLoader.getTexture("Background");
	loadingScreen = textureLoader.getTexture("Loading");
	
	//backButton = textureLoader.getTexture("Back");
	
	if(startButton == null || exitButton == null || settingsButton == null || background == null || loadingScreen == null)
	{
		Debug.LogError("one of the textures loaded is null");
	}
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
		  		Application.LoadLevel("LevelLoaderScene");
		  		//currentMenuState = menuState.startMenu;
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
			//next page button (if applicable)
			//previous page button (if applicable)
			//back button
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