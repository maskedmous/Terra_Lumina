#pragma strict



function Awake(){
	this.name = "AmmoBox";
}

function OnTriggerEnter( object: Collider){
	if(object.name == "Player"){
		Destroy(this.gameObject);
		GameObject.Find("Player").GetComponent(PlayerController).addAmmo(5);
	}
}