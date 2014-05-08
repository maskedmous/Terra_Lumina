#pragma strict

private var volume:float = 1.0;
private var muteBool:boolean;
static var bgMusicExists:boolean = false;


function Start () {
	
}

function Awake(){
	DontDestroyOnLoad(this.gameObject);
	
	if(bgMusicExists == false){
		this.audio.volume = volume;
		this.audio.loop = true;
		bgMusicExists = true;
	}
	else{
		Destroy(this.gameObject);
	}
}

function Update () {

}

public function changeVolume(newVolume:float){ // give a number between 0 and 1 for the volume
	this.audio.audio.volume = newVolume;
}

public function changeMute(newMute:boolean){
	this.audio.audio.mute = newMute;
}

public function changeLoop(newLoop:boolean){
	this.audio.audio.loop = newLoop;
}

public function playMusic(){
	this.audio.Play();
}

public function stopMusic(){
	this.audio.Stop();
}