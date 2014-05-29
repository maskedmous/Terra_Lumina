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
	//grow();
}

function OnCollisionEnter(collision:Collision)
{
	if (collision.gameObject.name.Contains("GroundPiece"))
	{
		if(shroomType != null && newShroom == null)
		{
			Debug.Log(newShroom);
			newShroom = Instantiate(shroomType, this.transform.position, Quaternion.identity);
			newShroom.gameObject.name = "Shroom";
			newShroom.gameObject.transform.parent = GameObject.Find("Level").transform;
			newShroom.gameObject.transform.localScale = Vector3(startScale, startScale, startScale);
			Destroy(this.gameObject);
		}
		else
		{
			Debug.LogError("shroomType is null or other shroom has already been created by this seed");
		}
	}
}

function replaceWithShroom():void
{
	if(shroomType != null)
	{
		newShroom = Instantiate(shroomType, this.transform.position, Quaternion.identity);
		newShroom.gameObject.name = "Shroom";
		newShroom.gameObject.transform.parent = GameObject.Find("Level").transform;
		newShroom.gameObject.transform.localScale = Vector3(startScale, startScale, startScale);
		newShroom.gameObject.transform.rotation.y = Mathf.Abs(Random.Range(0, 360));
		print(Random.Range(0, 360));
		this.gameObject.renderer.enabled = false;
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