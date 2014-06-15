﻿#pragma strict

private var counter:float = -1.0f;

private var startScale:float = 0.2f;
private var currentScale:float = 0.0f;
private var improveScale:float = 0.025f;
private var fullGrown:boolean = false;
private var animationController:Animator = null;

private var yDifference:float = 1.0f;

private var soundEngine:SoundEngineScript = null;

function Awake () {
//	counter = 30.0f;
//	currentScale = startScale;
	this.gameObject.transform.parent.transform.eulerAngles = Vector3(0, Random.Range(0, 360), 0);
	if(GameObject.Find("SoundEngine") != null) soundEngine = GameObject.Find("SoundEngine").GetComponent(SoundEngineScript);
	animationController = transform.parent.parent.GetComponent(Animator);
	animationController.Play("Grow");
}

//function Update () {
//	if (fullGrown) {	
//		counter -= Time.deltaTime;
//		if(counter <= 0.0f){
//			Destroy(this.gameObject);
//		}
//	}
//	else grow();
//}

function OnCollisionEnter(obj:Collision):void
{
	//collision and executed once
	if(obj.gameObject.name == "Player")
	{
		if(Mathf.Abs(this.gameObject.transform.position.y - obj.gameObject.transform.position.y) > yDifference)
		{
			obj.gameObject.GetComponent(PlayerController).bounceShroomY();
			if(soundEngine != null)
			{
				soundEngine.playSoundEffect("bounce");
			}
			animationController.Play("Bounce");
			var bounceParticle:Transform = this.gameObject.transform.FindChild("shroomJump");
			bounceParticle.particleSystem.Clear();
			bounceParticle.particleSystem.Play();
		}
		else
		{
			obj.gameObject.GetComponent(PlayerController).bounceShroomX();
		}
	}
}

//private function grow():void {
//	currentScale += improveScale;
//	if (currentScale >= 1.0f){
//		 fullGrown = true;
//		 if(currentScale > 1.0f) {
//		 	currentScale = 1.0f;
//		 }
//	}
//	this.gameObject.transform.localScale = Vector3(currentScale, currentScale, currentScale);
//}