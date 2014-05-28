﻿#pragma strict

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
	if (collision.gameObject.name.Contains("GroundPiece") || collision.gameObject.name.Contains("Shroom"))
	{
		/*(this.rigidbody.velocity = new Vector3(0, 0, 0);
		this.rigidbody.isKinematic = false;
		this.rigidbody.useGravity = true;
		growing = true;
		currentScale = startScale;*/
		if(shroomType != null)
		{
			newShroom = Instantiate(shroomType, this.transform.position, Quaternion.identity);
			newShroom.gameObject.name = "Shroom";
			newShroom.gameObject.transform.parent = GameObject.Find("Level").transform;
			newShroom.gameObject.transform.localScale = Vector3(startScale, startScale, startScale);
			this.gameObject.renderer.enabled = false;
			Destroy(this.gameObject);
		}
		else
		{
			Debug.LogError("shroomType is null");
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