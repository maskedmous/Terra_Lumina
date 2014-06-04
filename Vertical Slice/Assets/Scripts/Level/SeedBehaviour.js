#pragma strict

private var growTime:float = 3.0f;
private var shroomType:GameObject = null;
private var growing:boolean = false;
private var startScale:float = 0.2f;
private var currentScale:float = 0.0f;
private var improveScale:float = 0.025f;
private var newShroom:GameObject = null;

function OnCollisionEnter(collision:Collision)
{
	if (collision.gameObject.name.Contains("GroundPiece"))
	{
		if(shroomType != null && newShroom == null)
		{
			newShroom = Instantiate(shroomType, this.transform.position, Quaternion.identity);
			newShroom.gameObject.name = "Shroom";
			newShroom.gameObject.transform.parent = GameObject.Find("Level").transform;
			newShroom.gameObject.transform.localScale = Vector3(startScale, startScale, startScale);
			newShroom.gameObject.transform.eulerAngles = Vector3(0, Random.Range(0, 360), 0);
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
		newShroom.gameObject.transform.eulerAngles = Vector3(0, Random.Range(0, 360), 0);
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