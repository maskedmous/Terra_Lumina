#pragma strict

private var growTime:float = 3.0;
private var shroomType:GameObject = null;
private var growing:boolean = false;
private var startScale:float = 0.2;
private var currentScale:float;
private var improveScale:float = 0.025;
private var newShroom:GameObject;

public function Update():void
{
	grow();
	print(currentScale);
	
}

function OnCollisionEnter(collision:Collision)
{
	if (collision.gameObject.name.Contains("GroundPiece"))
	{
		this.rigidbody.velocity = new Vector3(0, 0, 0);
		this.rigidbody.isKinematic = true;
		this.rigidbody.useGravity = false;
		growing = true;
		currentScale = startScale;
	}
}

private function grow():void
{
	if(growing)
	{
		if(currentScale == startScale)
		{
			replaceWithShroom();
			currentScale += improveScale;
		}
		else
		{
			currentScale += improveScale;
		}
		if(currentScale >= 1.0){
			growing = false;
			print("growing complete");
			Destroy(this.gameObject);
		}
		//newShroom.gameObject.transform.scale = currentScale;
		newShroom.gameObject.transform.localScale = Vector3(currentScale, currentScale, currentScale);
	}
}

/*private function grow():void
{
	if(growing)
	{
		if(growTime <= 0)
		{
			replaceWithShroom();
			growTime = 3;
		}
		else
		{
			growTime -= Time.deltaTime;
		}
	}
}*/

function replaceWithShroom():void
{
	if(shroomType != null)
	{
		newShroom = Instantiate(shroomType, this.transform.position, Quaternion.identity);
		newShroom.gameObject.name = "Shroom";
		newShroom.gameObject.transform.parent = GameObject.Find("Level").transform;
		newShroom.gameObject.transform.localScale = Vector3(startScale, startScale, startScale);
		this.gameObject.renderer.enabled = false;
		//Destroy(this.gameObject);
	}
	else
	{
		Debug.LogError("shroomType is null");
	}
}

function setShroomType(aShroomType:GameObject)
{
	shroomType = aShroomType;
}