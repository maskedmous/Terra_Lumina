#pragma strict

private var volume:float = 1.0;
//private var muteBool:boolean;
static var bgMusicExists:boolean = false;

private var bounceSound:AudioClip;
private var jumpSound:AudioClip;
private var shootingSound:AudioClip;
private var slugForwardSound:AudioClip;
private var slugBackwardSound:AudioClip;
private var roverSound:AudioClip;
private var flashSound:AudioClip;

public function Awake():void
{
	DontDestroyOnLoad(this.gameObject);
	
	if(bgMusicExists == false){
		this.audio.volume = volume;
		this.audio.loop = true;
		bgMusicExists = true;
		
		bounceSound = Resources.Load("SoundEffects/Bounce");
		jumpSound = Resources.Load("SoundEffects/Jump");
		shootingSound = Resources.Load("SoundEffects/Shooting");
		slugForwardSound = Resources.Load("SoundEffects/Move forward");
		slugBackwardSound = Resources.Load("SoundEffects/Move backwards");
		roverSound = Resources.Load("SoundEffects/Rover rolling");
		flashSound = Resources.Load("SoundEffects/Turn on Light");
	}
	else{
		Destroy(this.gameObject);
	}
}

 // give a number between 0 and 1 for the volume
public function changeVolume(newVolume:float):void
{
	if(newVolume > 1)
	{
		newVolume = 1;
		Debug.LogError("Trying to set the volume higher than 1, corrected it to 1");
	}
	else if (newVolume < 0)
	{
		newVolume = 0;
		Debug.LogError("Trying to set the volume lower than 0, corrected it to 0");
	}
	
	this.audio.audio.volume = newVolume;
}

public function changeMute(newMute:boolean):void
{
	this.audio.audio.mute = newMute;
}

public function changeLoop(newLoop:boolean):void
{
	this.audio.audio.loop = newLoop;
}

public function playSoundEffect(name:String){
	if(name == "bounce"){
		audio.PlayOneShot(bounceSound);
	}
	if(name == "jump"){
		audio.PlayOneShot(jumpSound);
	}
	if(name == "shoot"){
		audio.PlayOneShot(shootingSound);
	}
	if(name == "slugForward"){
		audio.PlayOneShot(slugForwardSound);
	}
	if(name == "slugBackward"){
		audio.PlayOneShot(slugBackwardSound);
	}
	if(name == "rover"){
		audio.PlayOneShot(roverSound);
	}
	if(name == "flash"){
		audio.PlayOneShot(flashSound);
	}
}

public function playMusic(){
	this.audio.Play();
}

public function stopMusic(){
	this.audio.Stop();
}