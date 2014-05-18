#pragma strict

private var finished:boolean = false;
private var gameLogicScript:GameLogic = null;
private var notFinished:boolean = false;

public function Awake():void
{
	gameLogicScript = GameObject.Find("GameLogic").GetComponent(GameLogic);
}

function OnTriggerEnter(hit:Collider){
	if(hit.gameObject.name == "Player")
	{
		if(gameLogicScript.checkWin() == true)
		{
			finished = true;
			gameLogicScript.stopTimer();
		}
		else
		{
			notFinished = true;
		}
	}
}

public function OnTriggerExit(object:Collider)
{
	if(object.gameObject.name == "Player")
	{
		notFinished = false;
	}
}

function OnGUI(){
	if(finished){
		if (GUI.Button(new Rect(Screen.width*5/24, Screen.height*7/24, Screen.width/3, Screen.height/4), "Click here to go back to the Menu")){
		  		Application.LoadLevel("Menu");
		}
	}	
	if(notFinished)
	{
		GUI.Label(new Rect(Screen.width / 2 - 150, Screen.height / 2, 300, 50), "Je hebt " + gameLogicScript.getSamplesToComplete().ToString() + "nodig om het level te eindigen");
	}
}

function setFinished(isFinished:boolean) {
	finished = isFinished;
}

function getFinished():boolean {
	return finished;
}
