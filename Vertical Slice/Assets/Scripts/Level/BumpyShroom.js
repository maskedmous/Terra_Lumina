﻿#pragma strict

private var counter:float = 10.0f;
private var growCounter:float = 2.5f;

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

function Update () {
	if(!animationController.GetCurrentAnimatorStateInfo(0).IsName("Grow")){
		animationController.SetBool("doneGrowing", true);
		fullGrown = true;
	} 
	/*if(growCounter >= 0){
		growCounter -= Time.deltaTime;
	}
	if(growCounter <= 0){
		animationController.SetBool("doneGrowing", true);
		fullGrown = true;
		print(fullGrown);
	}*/
	if (fullGrown) {	
		counter -= Time.deltaTime;
		if(counter <= 0.0f){
			Destroy(this.gameObject.transform.parent.parent.gameObject);
		}
	}
}

function OnCollisionEnter(obj:Collision):void
{
	//collision and executed once
	if(obj.gameObject.name == "Player")
	{
		if(animationController.GetBool("doneGrowing") == true){
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
}