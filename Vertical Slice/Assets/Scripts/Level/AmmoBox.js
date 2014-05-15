#pragma strict

private var extraSeeds:uint = 5;
public var counter:float;
private var canHit:boolean;

function Awake(){
	this.name = "AmmoBox";
	canHit = true;
	counter = 20.0;
}

function Update(){
	if(canHit == false){
		print(counter);
		if ( counter >= 0.0){
			counter -= Time.deltaTime;
		}
		if(counter <= 0.0){
			this.gameObject.renderer.enabled = true;
			canHit = true;
		}
	}
}

function OnTriggerEnter( object: Collider){
	if(canHit == true){
		if(object.name == "Player"){
			//Destroy(this.gameObject);
			if((GameObject.Find("Player").GetComponent(PlayerController).getSeeds() + extraSeeds) <= GameObject.Find("Player").GetComponent(PlayerController).getMaxSeeds()){
				GameObject.Find("Player").GetComponent(PlayerController).addAmmo(extraSeeds);
				this.gameObject.renderer.enabled = false;
				counter = 20.0f;
				canHit = false;
			}
			
		}
	}
}