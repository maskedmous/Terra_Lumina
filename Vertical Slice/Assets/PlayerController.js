#pragma strict

import System.Collections.Generic;

var lastDirection:String="Right";
private var lineRenderer:LineRenderer;
public var seed:GameObject;
private var y0:float;
private var x1:float;
private var x2:float;
private var x3:float;
private var x4:float;
private var x5:float;
private var x6:float;
private var x7:float;
private var x8:float;
private var g:float;
private var tanAngle:float = .75;
private var cosAngle:float = .6;
private var v:float;
private var vx:float = 0;
private var vy:float = 0;

private var isJumping:boolean = true;
private var initializeJumping:boolean = false;
private var jumpForce:float = 0.0;
private var maxJForce:float = 10;

private var isShooting:boolean = false;
private var currentSeeds:uint = 5;

private var stdTrickCD = 100;
private var trickCD = stdTrickCD;
private var prevRot = 0;

public var rot:float = 0.03;
public var limitRotation:boolean;

private var inventory:List.<GameObject> = new List.<GameObject>();

function Start() {
	lineRenderer = this.gameObject.GetComponent(LineRenderer);
	lineRenderer.enabled = false;
	lineRenderer.SetColors(Color.red, Color.blue);
	g = -Physics.gravity.y;
}

function Update()
{
	movement();
	if(inventory.Count == 1) Debug.Log(inventory[0].gameObject.name);
}

function movement()
{

	//update event
	if (isJumping)
	{
		var hitDown:RaycastHit;
		if (Physics.Raycast(this.gameObject.transform.position, new Vector3(this.gameObject.transform.rotation.z, -1 + (this.gameObject.transform.rotation.z), 0), hitDown, 1.0 + (this.gameObject.transform.rotation.z / 1.5)))
		{
			if (hitDown.collider.gameObject.name == "Plateau") isJumping = false;
		}
	}

	handleTricks();
}

function jumpButtonDown()
{
	//initial event
	if (isJumping == false && !initializeJumping)
	{
		jumpForce = 5;
		GameObject.Find("GameLogic").GetComponent(GameLogic).battery -= 3;
		initializeJumping = true;
	}
	//hold event
	if (isJumping == false && initializeJumping == true)
	{
		if (jumpForce < maxJForce) {
			jumpForce += 0.05;
			GameObject.Find("GameLogic").GetComponent(GameLogic).battery -= 0.1;
		}
		else {
			Debug.Log("You have reached maximum jump power");
		}
	}

}

function jumpButtonUp()
{
	//release event
	if (!isJumping)
	{
		this.gameObject.rigidbody.velocity.y = jumpForce;
		isJumping = true;
		initializeJumping = false;
		jumpForce = 0;
	}
}

function moveLeft()
{
	this.gameObject.rigidbody.velocity.x -= 0.18;
	setDirection("Left");
}

function moveRight()
{
	this.gameObject.rigidbody.velocity.x += 0.18;
	setDirection("Right");
}

function shootSeed()
{
	if (currentSeeds > 0) {
		lineRenderer.enabled = true;	
		
		y0 = this.gameObject.transform.position.y;
		
		vx += 0.12;
		vy += 0.09;
		v = vx * vx + vy * vy;

		//formula for max dist: d = v*v*sin(2*angle) / gravity
		//replaced sin(2*angle), which was .96, with a bigger number due to the trajectory not starting on the ground.
		x8 = v * 1.15 / 9.81;
		x1 = x8 / 8;
		x2 = 2 * x8 / 8;
		x3 = 3 * x8 / 8;
		x4 = 4 * x8 / 8;
		x5 = 5 * x8 / 8;
		x6 = 6 * x8 / 8;
		x7 = 7 * x8 / 8;

		//trajectory function: Y = Y0 + tan(angle) * X - (gravity*x*x)/(2*v*v*cos(angle)*cos(angle))
		var y1:float = (y0 + x1 * 0.75) - (9.81 * x1 * x1) / (1.28 * v);
		var y2:float = (y0 + x2 * 0.75) - (9.81 * x2 * x2) / (1.28 * v);
		var y3:float = (y0 + x3 * 0.75) - (9.81 * x3 * x3) / (1.28 * v);
		var y4:float = (y0 + x4 * 0.75) - (9.81 * x4 * x4) / (1.28 * v);
		var y5:float = (y0 + x5 * 0.75) - (9.81 * x5 * x5) / (1.28 * v);
		var y6:float = (y0 + x6 * 0.75) - (9.81 * x6 * x6) / (1.28 * v);
		var y7:float = (y0 + x7 * 0.75) - (9.81 * x7 * x7) / (1.28 * v);
		var y8:float = (y0 + x8 * 0.75) - (9.81 * x8 * x8) / (1.28 * v);
		//0 = y0 + x8 * tanAngle - (g * x8 * x8) / (2 * (v * v * cosAngle * cosAngle))
		
		lineRenderer.SetPosition(0, new Vector3(this.gameObject.transform.position.x + 2, y0, this.gameObject.transform.position.z));
		lineRenderer.SetPosition(1, new Vector3(this.gameObject.transform.position.x + 2 + x1, y1, this.gameObject.transform.position.z));
		lineRenderer.SetPosition(2, new Vector3(this.gameObject.transform.position.x + 2 + x2, y2, this.gameObject.transform.position.z));
		lineRenderer.SetPosition(3, new Vector3(this.gameObject.transform.position.x + 2 + x3, y3, this.gameObject.transform.position.z));
		lineRenderer.SetPosition(4, new Vector3(this.gameObject.transform.position.x + 2 + x4, y4, this.gameObject.transform.position.z));
		lineRenderer.SetPosition(5, new Vector3(this.gameObject.transform.position.x + 2 + x5, y5, this.gameObject.transform.position.z));
		lineRenderer.SetPosition(6, new Vector3(this.gameObject.transform.position.x + 2 + x6, y6, this.gameObject.transform.position.z));
		lineRenderer.SetPosition(7, new Vector3(this.gameObject.transform.position.x + 2 + x7, y7, this.gameObject.transform.position.z));
		lineRenderer.SetPosition(8, new Vector3(this.gameObject.transform.position.x + 2 + x8, y8, this.gameObject.transform.position.z));
	}
}

function shoot()
{
	if (currentSeeds > 0) {
		currentSeeds--;
		var newSeed:GameObject = Instantiate(seed, this.gameObject.transform.position + new Vector3(2, 0, 0), Quaternion.identity);
		newSeed.gameObject.name = "Plant";
		newSeed.gameObject.transform.parent = GameObject.Find("SeedContainer").gameObject.transform;
		newSeed.rigidbody.velocity = new Vector3(vx, vy, 0);
		vx = 0;
		vy = 0;
		x8 = 0;
		yield WaitForSeconds(3);
		lineRenderer.enabled = false;
	}
}

function LateUpdate()
{
	if (limitRotation) {
		if (this.gameObject.transform.rotation.z > 0.5) this.gameObject.transform.rotation.z = 0.4;
	}
}

function Add(obj:GameObject)
{
	if (inventory.Count == 0) {
		inventory.Add(obj);
		Debug.Log("Added " + obj.name);
	}
	else Debug.Log("Inventory already full.." );
}

function Place()
{
	if (inventory.Count > 0) {
		if (getDirection() == "Right") inventory[0].gameObject.transform.position = this.gameObject.transform.position + new Vector3(3, 0, 0);
		else if (getDirection() == "Left") inventory[0].gameObject.transform.position = this.gameObject.transform.position + new Vector3(-3, 0, 0);
		inventory.RemoveAt(0);
	}
	else Debug.Log("You can't place an item right now");
}

function getInventory(index:uint)
{
	if (inventory.Count > 0) return inventory[index].name;
	else return "De laadruimte is leeg";
}

function handleTricks()
{
	trickCD--;
	if (prevRot == 0) {
		if (this.gameObject.transform.rotation.z > 0.5) {
			prevRot = 90;
			trickCD = stdTrickCD;
			Debug.Log(prevRot);
		}
	}
	if (prevRot == 90) {
		if (this.gameObject.transform.rotation.z > 0.9) {
			prevRot = 180;
			trickCD = stdTrickCD;
			Debug.Log(prevRot);
		}
	}
	if (prevRot == 180) {
		if (this.gameObject.transform.rotation.z < 0.5) {
			prevRot = 270;
			trickCD = stdTrickCD;
			Debug.Log(prevRot);
		}
	}
	if (prevRot == 270) {
		if (this.gameObject.transform.rotation.z < 0.1) {
			prevRot = 0;
			trickCD = stdTrickCD;
			Debug.Log(prevRot);
			Debug.Log("backflip.");
		}
	}
	if (trickCD < 0 && prevRot != 0) {
		trickCD = stdTrickCD;
		prevRot = 0;
		Debug.Log(prevRot);
	}
}

function setDirection(direction:String)
{
	if(lastDirection != direction)
	{
		lastDirection = direction;
	}
}

function getDirection():String
{
	return lastDirection;
}