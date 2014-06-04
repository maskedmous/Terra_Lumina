#pragma strict

private var extraSeeds:uint = 5;
public var counter:float = 0.0f;
private var canHit:boolean = true;

function Awake(){
	this.name = "AmmoBox";
	counter = 20.0f;
}

function Update(){
	if(canHit == false){
		if (counter >= 0.0f){
			counter -= Time.deltaTime;
		}
		if(counter <= 0.0f){
			this.gameObject.renderer.enabled = true;
			this.gameObject.collider.enabled = true;
			canHit = true;
		}
	}
}

function OnTriggerEnter(object:Collider):void {
	if(canHit == true){
		if(object.gameObject.name == "Player")
		{
			object.gameObject.GetComponent(PlayerController).addAmmo(extraSeeds);
			this.gameObject.renderer.enabled = false;
			this.gameObject.collider.enabled = false;
			counter = 20.0f;
			canHit = false;
		}
	}
}