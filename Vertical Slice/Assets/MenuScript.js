#pragma strict


private var BUTTONWIDTH = Screen.width/6;
private var BUTTONHEIGHT = Screen.height/8;
var startButton:Texture;
var exitButton:Texture;
var settingsButton:Texture;
var creditsButton:Texture;
var background:Texture;
var loadingScreen:Texture;
var skin:GUIStyle;
var started:boolean;

function Start () {
	started = false;

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
		if (GUI.Button(new Rect(Screen.width*0, Screen.height*6/24, BUTTONWIDTH, BUTTONHEIGHT), startButton)){
	  		Application.LoadLevel("LevelScene");
	  		print("Start game");
	  		started = true;
	  	}
	  	if (GUI.Button(new Rect(Screen.width*0, Screen.height*10/24, BUTTONWIDTH, BUTTONHEIGHT), settingsButton)){
	  		print("Settings");
	  	}
	  	if (GUI.Button(new Rect(Screen.width*0, Screen.height*14/24, BUTTONWIDTH, BUTTONHEIGHT), creditsButton)){
	  		print("Credits");
	  	}
		 if (GUI.Button(new Rect(Screen.width*0, Screen.height*18/24, BUTTONWIDTH, BUTTONHEIGHT), exitButton)){
			print("Quit Game");
			Application.Quit();
		}
	}
}