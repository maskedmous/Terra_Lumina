#pragma strict


private var BUTTONWIDTH = Screen.width/6;
private var BUTTONHEIGHT = Screen.height/8;
private var TEXTUREWIDTH = Screen.width/5;
private var TEXTUREHEIGHT = Screen.height/6;
private var startButton:Texture;
private var exitButton:Texture;
private var settingsButton:Texture;
private var creditsButton:Texture;
private var background:Texture;
private var loadingScreen:Texture;
var empty:String = "";
var skin:GUIStyle;
var started:boolean;

function Start () {
	started = false;

}

function Awake(){
	var textureLoader:TextureLoader = GameObject.Find("TextureLoader").GetComponent(TextureLoader);
	startButton = textureLoader.getTexture("Start");
	exitButton = textureLoader.getTexture("Quit");
	creditsButton = textureLoader.getTexture("Credits");
	settingsButton = textureLoader.getTexture("Settings");
	background = textureLoader.getTexture("Background");
	loadingScreen = textureLoader.getTexture("Loading");
}

function Update () {

}

function OnGUI(){
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), background, ScaleMode.StretchToFill, true, 0);
	if(started){
		GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), loadingScreen, ScaleMode.StretchToFill, true, 0);
		print("loading");
	}
	if(!started){
		GUI.DrawTexture(new Rect(Screen.width*0, Screen.height*6/24, TEXTUREWIDTH, TEXTUREHEIGHT), startButton, ScaleMode.StretchToFill, true, 0);
		if (GUI.Button(new Rect(Screen.width*0, Screen.height*6/24, BUTTONWIDTH, BUTTONHEIGHT), empty, skin)){
	  		Application.LoadLevel("LevelLoaderScene");
	  		print("Start game");
	  		started = true;
	  	}
	  	GUI.DrawTexture(new Rect(Screen.width*0, Screen.height*10/24, TEXTUREWIDTH, TEXTUREHEIGHT), settingsButton, ScaleMode.StretchToFill, true, 0);
	  	if (GUI.Button(new Rect(Screen.width*0, Screen.height*10/24, BUTTONWIDTH, BUTTONHEIGHT), empty, skin)){
	  		print("Settings");
	  	}
	  	GUI.DrawTexture(new Rect(Screen.width*0, Screen.height*14/24, TEXTUREWIDTH, TEXTUREHEIGHT), creditsButton, ScaleMode.StretchToFill, true, 0);
	  	if (GUI.Button(new Rect(Screen.width*0, Screen.height*14/24, BUTTONWIDTH, BUTTONHEIGHT), empty, skin)){
	  		print("Credits");
	  	}
	  	GUI.DrawTexture(new Rect(Screen.width*0, Screen.height*18/24, TEXTUREWIDTH, TEXTUREHEIGHT), exitButton, ScaleMode.StretchToFill, true, 0);
		 if (GUI.Button(new Rect(Screen.width*0, Screen.height*18/24, BUTTONWIDTH, BUTTONHEIGHT), empty, skin)){
			print("Quit Game");
			Application.Quit();
		}
	}
}