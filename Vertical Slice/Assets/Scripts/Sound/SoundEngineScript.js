﻿#pragma strict

private var volume:float = 1.0f;
//private var muteBool:boolean;
static var bgMusicExists:boolean = false;

private var aim:boolean = false;
private var drive:boolean = false;
private var driveTimer:float = 0.0f;
private var driveTimerBool:boolean = false;

private var bounceSound:AudioClip;
private var jumpSound:AudioClip;
private var shootingSound:AudioClip;
private var slugForwardSound:AudioClip;
private var slugBackwardSound:AudioClip;
private var roverDriveSound:AudioClip;
private var flashSound:AudioClip;
private var roverStartSound:AudioClip;
private var roverStopSound:AudioClip;
private var roverAimSound:AudioClip;
private var rockBreakingSound:AudioClip;
private var sunChargingSound:AudioClip;

public function Awake():void
{
	DontDestroyOnLoad(this.gameObject);
	
	if(bgMusicExists == false) {
		this.audio.volume = volume;
		this.audio.loop = true;
		bgMusicExists = true;
		
		bounceSound = Resources.Load("SoundEffects/Shroom Bounce", AudioClip);
		jumpSound = Resources.Load("SoundEffects/Rover Jump", AudioClip);
		shootingSound = Resources.Load("SoundEffects/Rover Shoot", AudioClip);
		slugForwardSound = Resources.Load("SoundEffects/Move forward", AudioClip);
		slugBackwardSound = Resources.Load("SoundEffects/Move backwards", AudioClip);
		roverDriveSound = Resources.Load("SoundEffects/Rover Drive - Loop This", AudioClip);
		roverStartSound = Resources.Load("SoundEffects/Rover Drive Startup", AudioClip);
		roverStopSound = Resources.Load("SoundEffects/Rover Drive Stop", AudioClip);
		roverAimSound = Resources.Load("SoundEffects/Rover Aim", AudioClip);
		flashSound = Resources.Load("SoundEffects/Rover Flashlight", AudioClip);
		//rockBreakingSound = Resources.Load("SoundEffects/...", AudioClip);
		//sunChargingSound = Resources.Load("SoundEffects/...", AudioClip);
	}
	else {
		Destroy(this.gameObject);
	}
}

public function Update():void {
	if(gameObject.Find("Player")){
		this.gameObject.transform.position = gameObject.Find("Player").transform.position;
	}
	if(driveTimerBool == true){
		driveTimer += Time.deltaTime;
		if(driveTimer >= 3.0f){
			driveTimerBool = false;
			driveTimer = 0.0f;
		}
	}
}

// give a number between 0 and 1 for the volume
public function changeVolume(newVolume:float):void
{
	if(newVolume > 1.0f)
	{
		newVolume = 1.0f;
		Debug.LogError("Trying to set the volume higher than 1, corrected it to 1");
	}
	else if (newVolume < 0.0f)
	{
		newVolume = 0.0f;
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

public function playSoundEffect(name:String):void {
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
	if(name == "roverDrive"){
		if(driveTimer == 0.0f)
		{
			audio.PlayOneShot(roverDriveSound);
			driveTimerBool = true;	
		}	
	}
	if(name == "roverStart"){
		audio.PlayOneShot(roverStartSound);
	}
	if(name == "roverStop"){
		audio.PlayOneShot(roverStopSound);
	}
	if(name == "aim"){
		if(aim == true){
			audio.PlayOneShot(roverAimSound);
		}
	}
	if(name == "flash"){
		audio.PlayOneShot(flashSound);
	}
	if(name == "rock"){
		audio.PlayOneShot(rockBreakingSound);
	}
	if(name == "sun"){
		audio.PlayOneShot(sunChargingSound);
	}
}

public function setAim(aimBool:boolean):void {
	aim = aimBool;
}

public function setDrive(driveBool:boolean):void {
	drive = driveBool;
}

public function getDrive():boolean {
	return drive;
}

public function playMusic():void {
	this.audio.Play();
}

public function stopMusic():void {
	this.audio.Stop();
}