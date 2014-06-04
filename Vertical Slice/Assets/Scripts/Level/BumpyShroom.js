#pragma strict

private var counter:float = -1.0f;

private var startScale:float = 0.2f;
private var currentScale:float = 0.0f;
private var improveScale:float = 0.025f;
private var fullGrown:boolean = false;

function Awake () {
	counter = 30.0f;
	currentScale = startScale;
}

function Update () {
	if (fullGrown) {	
		counter -= Time.deltaTime;
		if(counter <= 0.0f){
			Destroy(this.gameObject);
		}
	}
	else grow();
}

function OnCollisionEnter(obj:Collision):void
{
	//collision and executed once
	if(obj.gameObject.name == "Player")
	{
		if(Mathf.Abs(this.gameObject.transform.position.y - obj.gameObject.transform.position.y) > 2.0f)
		{
			obj.gameObject.GetComponent(PlayerController).bounceShroomY();
			var soundEngine = GameObject.Find("SoundEngine").GetComponent(SoundEngineScript);
			soundEngine.playSoundEffect("bounce");
		}
		
		if(Mathf.Abs(this.gameObject.transform.position.y - obj.gameObject.transform.position.y) < 1.0f)
		{
			obj.gameObject.GetComponent(PlayerController).bounceShroomX();
		}
	}
}

private function grow():void {
	currentScale += improveScale;
	if (currentScale > 1.0f) fullGrown = true;
	this.gameObject.transform.localScale = Vector3(currentScale, currentScale, currentScale);
}