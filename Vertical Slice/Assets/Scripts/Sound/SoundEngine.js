#pragma strict

private var volume:float = 1.0;
private var muteBool:boolean;

private var backgroundMusic:AudioSource;

function Start () {
	
}

function awake(){
	DontDestroyOnLoad(this.gameObject);
	backgroundMusic.volume = volume;
	backgroundMusic.loop = true;
}

function Update () {

}

public function changeVolume(name:String, newVolume:float){ // give a number between 0 and 1 for the volume
	if(name == "background"){
		backgroundMusic.audio.volume = newVolume;
		//backgroundMusic.
	}
}

public function changeMute(name:String, newMute:boolean){
	if(name == "background"){
		backgroundMusic.audio.mute = newMute;
	}
}

public function changeLoop(name:String, newLoop:boolean){
	if(name == "background"){
		backgroundMusic.audio.loop = newLoop;
	}
}

public function playMusic(name:String){
	if(name == "background"){
		backgroundMusic.Play();
	}
}

public function stopMusic(name:String){
	if(name == "background"){
		backgroundMusic.Stop();
	}
}