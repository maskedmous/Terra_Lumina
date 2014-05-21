#pragma strict

private var finished:boolean = false;
private var lost:boolean = false;
private var gameLogicScript:GameLogic = null;
private var notFinished:boolean = false;
private var skin			:GUIStyle = new GUIStyle();

private var toMenuWinTexture:Texture	= null;
private var winMenuRect		:Rect;
public var winMenuX:float = 300.0;
public var winMenuY:float = 300.0;

private var toMenuLoseTexture:Texture	= null;
private var loseMenuRect		:Rect;
public var loseMenuX:float = 300.0;
public var loseMenuY:float = 300.0;

//scales for button positions
private var originalWidth 	:float = 1920;
private var originalHeight	:float = 1080;
private var scale			:Vector3;


public function Awake():void
{
	gameLogicScript = GameObject.Find("GameLogic").GetComponent(GameLogic);
	var textureLoader:TextureLoader = GameObject.Find("TextureLoader").GetComponent(TextureLoader);
	//get the textures from the texture loader
	toMenuWinTexture = textureLoader.getTexture("WIN - return to menu");
	toMenuLoseTexture = textureLoader.getTexture("LOSE - return to menu");
	
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
		//first scale the buttons before drawing them
		scaleButtons();

		//this is the texture of the button
		GUI.DrawTexture(winMenuRect, toMenuWinTexture);
		//this is the button itself
		if (GUI.Button(winMenuRect, "", skin))
		{
			Application.LoadLevel("Menu");
		}
	}	
	if(notFinished)
	{
		GUI.Label(new Rect(Screen.width / 2 - 150, Screen.height / 2, 300, 50), "Je hebt " + gameLogicScript.getSamplesToComplete().ToString() + "nodig om het level te eindigen");
	}
	if(lost){
		//first scale the buttons before drawing them
		scaleButtons();

		//this is the texture of the button
		GUI.DrawTexture(loseMenuRect, toMenuLoseTexture);
		//this is the button itself
		if (GUI.Button(loseMenuRect, "", skin))
		{
			Application.LoadLevel("Menu");
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
	winMenuRect 			= new Rect(winMenuX			, winMenuY			, toMenuWinTexture.width			, toMenuWinTexture.height);
	loseMenuRect 			= new Rect(loseMenuX			, loseMenuY			, toMenuLoseTexture.width			, toMenuLoseTexture.height);
	
	//second scale the rectangles
	winMenuRect 			= scaleRect(winMenuRect);
	loseMenuRect 			= scaleRect(loseMenuRect);
}

private function scaleRect(rect:Rect):Rect
{
	var newRect:Rect = new Rect(rect.x * scale.x, rect.y * scale.y, rect.width * scale.x, rect.height * scale.y);
	return newRect;
}

function setFinished(isFinished:boolean) {
	finished = isFinished;
}

function getFinished():boolean {
	return finished;
}

function setLost(isLost:boolean){
	lost = isLost;
}

function getLost():boolean{
	return lost;
}
