#pragma strict

private var finished:boolean = false;

function Start () {

}

function Update () {

}

function OnTriggerEnter(hit:Collider){
	if(hit.gameObject.name == "Player"){
		print("hit player");
		if(GameObject.Find("GameLogic").GetComponent(GameLogic).checkWin() == true){
			finished = true;
		}
	}
}

function OnGUI(){
	if(finished){
		if (GUI.Button(new Rect(Screen.width*5/24, Screen.height*7/24, Screen.width/3, Screen.height/4), "Click here to go back to the Menu")){
		  		Application.LoadLevel("Menu");
		}
	}
}

function setFinished(isFinished:boolean) {
	finished = isFinished;
}