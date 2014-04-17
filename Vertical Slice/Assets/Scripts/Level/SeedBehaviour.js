#pragma strict

private var growTime:float = 3.0;
private var shroomType:GameObject = null;
private var growing:boolean = false;

public function Update():void
{
	grow();
}

function OnCollisionEnter(collision:Collision)
{
	if (collision.gameObject.name == "Plateau")
	{
		this.rigidbody.velocity = new Vector3(0, 0, 0);
		this.rigidbody.isKinematic = true;
		this.rigidbody.useGravity = false;
		growing = true;
	}
}

private function grow():void
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
}

function replaceWithShroom():void
{
	if(shroomType != null)
	{
		var newShroom:GameObject = Instantiate(shroomType, this.transform.position, Quaternion.identity);
		newShroom.gameObject.name = "Shroom";
		newShroom.gameObject.transform.parent = GameObject.Find("Level").transform;
		Destroy(this.gameObject);
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