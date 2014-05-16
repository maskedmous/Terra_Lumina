#pragma strict

	private var counter:float = -1;

function Awake ()
{
	counter = 30.0f;
}

function Update () {
	if(counter >= 0.0){
		counter -= Time.deltaTime;
	}
	if(counter <= 0.0){
		Destroy(this.gameObject);
	}
	
}