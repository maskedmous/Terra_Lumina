#pragma strict

	private var counter:float;

function Start () {
	counter = 30.0f;
}

function Update () {
	if(counter >= 0.0){
		counter -= Time.deltaTime;
		print(counter);
	}
	if(counter <= 0.0){
		Destroy(this.gameObject);
	}
	
}