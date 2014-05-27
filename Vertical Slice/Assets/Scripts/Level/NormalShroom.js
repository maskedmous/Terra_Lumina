#pragma strict

	private var counter:float = -1;
	
	private var startScale:float = 0.2;
	private var currentScale:float;
	private var improveScale:float = 0.025;
	private var fullGrown:boolean = false;

function Awake ()
{
	counter = 30.0f;
	currentScale = startScale;
}

function Update () {
	if (fullGrown) {	
		counter -= Time.deltaTime;
		if(counter <= 0.0){
			Destroy(this.gameObject);
		}
	}
	else grow();
}

private function grow() {
	currentScale += improveScale;
	if (currentScale > 1.0f) fullGrown = true;
	this.gameObject.transform.localScale = Vector3(currentScale, currentScale, currentScale);
}