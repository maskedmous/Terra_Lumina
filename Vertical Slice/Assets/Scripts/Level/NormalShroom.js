#pragma strict

	private var counter:float = -1.0f;
	
	private var startScale:float = 0.2f;
	private var currentScale:float = 0.0f;
	private var improveScale:float = 0.025f;
	private var fullGrown:boolean = false;

function Awake()
{
	counter = 30.0f;
	currentScale = startScale;
}

function Update():void {
	if (fullGrown) {	
		counter -= Time.deltaTime;
		if(counter <= 0.0f){
			Destroy(this.gameObject);
		}
	}
	else grow();
}

private function grow():void {
	currentScale += improveScale;
	if (currentScale > 1.0f) fullGrown = true;
	this.gameObject.transform.localScale = Vector3(currentScale, currentScale, currentScale);
}