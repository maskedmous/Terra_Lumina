﻿#pragma strict


private var BUTTONWIDTH = Screen.width/6;
private var BUTTONHEIGHT = Screen.height/8;
private var TEXTUREWIDTH = Screen.width/5;
private var TEXTUREHEIGHT = Screen.height/6;
var startButton:Texture;
var exitButton:Texture;
var settingsButton:Texture;
var creditsButton:Texture;
var background:Texture;
var loadingScreen:Texture;
var empty:Texture;
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
		GUI.DrawTexture(new Rect(Screen.width*0, Screen.height*6/24, TEXTUREWIDTH, TEXTUREHEIGHT), startButton, ScaleMode.StretchToFill, true, 0);
		if (GUI.Button(new Rect(Screen.width*0, Screen.height*6/24, BUTTONWIDTH, BUTTONHEIGHT), empty, skin)){
	  		Application.LoadLevel("LevelScene");
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