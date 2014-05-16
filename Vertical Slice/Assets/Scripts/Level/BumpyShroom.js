#pragma strict

private var counter:float = -1;

function Awake () {
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

function OnCollisionEnter(obj:Collision)
{
	//collision and executed once
	if(obj.gameObject.name == "Player")
	{
		if(Mathf.Abs(this.gameObject.transform.position.y - obj.gameObject.transform.position.y) > 2)
		{
			obj.gameObject.GetComponent(PlayerController).bounceShroomY();
		}
		
		if(Mathf.Abs(this.gameObject.transform.position.y - obj.gameObject.transform.position.y) < 1)
		{
			obj.gameObject.GetComponent(PlayerController).bounceShroomX();
		}
	}
}