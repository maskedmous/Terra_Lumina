#pragma strict

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