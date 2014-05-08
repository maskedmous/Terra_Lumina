#pragma strict

import System.Collections.Generic;

var debugInfo:String = "";

var lastDirection:String="Right";
private var maxSpeed:float = 8.0;

private var lineRenderer:LineRenderer;
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
private var jumpForce:float = 5.0;
private var maxJumpForce:float = 15.0;


//shroom seed shooting
private var isShooting:boolean = false;								//is it shooting at the moment?
private var currentSeeds:uint = 10;									//current amount of seed
private var currentShroom:GameObject;								//current shroom that is active
public 	var shrooms:List.<GameObject> = new List.<GameObject>();
private var samples:List.<GameObject> = new List.<GameObject>();

private var gameLogic:GameObject;
private var gameLogicScript:GameLogic;

public var flashlight:GameObject;
private var flashBool:boolean;
private var counter:int;

private var speed:float;
private var jumpDrain:float;

function Awake() {
	gameLogic = GameObject.Find("GameLogic") as GameObject;
	gameLogicScript = gameLogic.GetComponent("GameLogic") as GameLogic;
	
	shrooms.Add(Resources.Load("Prefabs/NormalShroom") as GameObject);
	shrooms.Add(Resources.Load("Prefabs/BumpyShroom") as GameObject);
	setShroom(0);//set initial shroom
}

function Start() {
	lineRenderer = this.gameObject.GetComponent(LineRenderer);
	lineRenderer.enabled = false;
	lineRenderer.SetColors(Color.white, Color.white);
	g = -Physics.gravity.y;
	
	speed = gameLogicScript.getSpeed();
	jumpDrain = gameLogicScript.getJumpDrain();
}

function Update()
{
	if(flashBool == false){
		movement();
	}
	
	if(flashBool == true) {
		counter++;
		if(counter >= 50) {
			flashlight.SetActive(false);
			flashBool = false;
			counter = 0;
		}
	}
}

function movement()
{
	var hitDown:RaycastHit;
	//if (Physics.Raycast(this.gameObject.transform.position, new Vector3(this.gameObject.transform.rotation.z, -1 + (this.gameObject.transform.rotation.z), 0), hitDown, 1.0 + (this.gameObject.transform.rotation.z / 1.5))) {
	if (Physics.Raycast(this.gameObject.transform.position, new Vector3(0, -1, 0), hitDown, 2)) {	
		isJumping = false;
		this.gameObject.rigidbody.constraints = RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY| RigidbodyConstraints.FreezePositionZ;
		//this.gameObject.rigidbody.constraints = RigidbodyConstraints.FreezeRotationY;
		//Debug.Log(hitDown.collider.gameObject.name);
	}
	else {
		Debug.Log("Raycast missed.");
		isJumping = true;
		this.gameObject.rigidbody.constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionZ;
	}
	
	var cRot = this.gameObject.transform.rotation.eulerAngles.z;
	if (cRot > 45 && cRot < 180) this.gameObject.transform.rotation.eulerAngles.z = 45;
	if (cRot > 180 && cRot < 315) this.gameObject.transform.rotation.eulerAngles.z = 315;
}


public function move(mousePos:float) {
	if (mousePos > ((Screen.width / 2) + (Screen.width * (1.0 / 50.0)))) moveRight();
	if (mousePos < ((Screen.width / 2) - (Screen.width * (1.0 / 50.0)))) moveLeft();
}

private function moveLeft()
{
	if (this.gameObject.rigidbody.velocity.x > -maxSpeed) this.gameObject.rigidbody.velocity.x -= 0.30;
	if (this.getDirection() == "Right")	{
		this.gameObject.transform.rotation.eulerAngles.y = 180;
		this.gameObject.transform.rotation.eulerAngles.z *= -1;
		this.gameObject.transform.rotation.eulerAngles.x *= -1;
	}
	setDirection("Left");
}

private function moveRight()
{
	if (this.gameObject.rigidbody.velocity.x < maxSpeed) this.gameObject.rigidbody.velocity.x += 0.30;
	if (this.getDirection() == "Left")	{
		this.gameObject.transform.rotation.eulerAngles.y = 0;
		this.gameObject.transform.rotation.eulerAngles.z *= -1;
		this.gameObject.transform.rotation.eulerAngles.x *= -1;
	}
	setDirection("Right");
}

public function brake():void
{
	if (!isJumping) {
		if (this.gameObject.rigidbody.velocity.x > 0.10) this.gameObject.rigidbody.velocity.x -= 0.10;
		if (this.gameObject.rigidbody.velocity.x < -0.10) this.gameObject.rigidbody.velocity.x += 0.10;
	}
}

public function jump() {
	if (!isJumping) {
		this.gameObject.rigidbody.velocity.y = jumpForce;
		jumpForce = 5.0f;
		isJumping = true;
		this.gameObject.rigidbody.freezeRotation = true;
		
		x8 = 0;
		v = 0;
		yield WaitForSeconds(3);
		lineRenderer.enabled = false;
	}
}

function chargeJump() {
	lineRenderer.enabled = true;
	
	//formula for max height: h = (v * v * sin(angle) * sin(angle)) / 2 * gravity
	v = jumpForce * jumpForce;	//no horizontal movement
	x8 = v / (2 * g); 							//sin(90) = 1, v already squared
	x1 = x8 / 8;								//here used for y coordinates
	x2 = 2 * x8 / 8;
	x3 = 3 * x8 / 8;
	x4 = 4 * x8 / 8;
	x5 = 5 * x8 / 8;
	x6 = 6 * x8 / 8;
	x7 = 7 * x8 / 8;
	Debug.Log(v);
	Debug.Log(g);
	Debug.Log(x8);
	
	var x0 = this.gameObject.transform.position.x;
	y0 = this.gameObject.transform.position.y;
	var z0 = this.gameObject.transform.position.z;
	lineRenderer.SetPosition(0, new Vector3(x0, y0, z0));
	lineRenderer.SetPosition(1, new Vector3(x0, x1 + y0, z0));
	lineRenderer.SetPosition(2, new Vector3(x0, x2 + y0, z0));
	lineRenderer.SetPosition(3, new Vector3(x0, x3 + y0, z0));
	lineRenderer.SetPosition(4, new Vector3(x0, x4 + y0, z0));
	lineRenderer.SetPosition(5, new Vector3(x0, x5 + y0, z0));
	lineRenderer.SetPosition(6, new Vector3(x0, x6 + y0, z0));
	lineRenderer.SetPosition(7, new Vector3(x0, x7 + y0, z0));
	lineRenderer.SetPosition(8, new Vector3(x0, x7 + y0, z0));
	
	jumpForce += 0.05;
	
	if (jumpForce > maxJumpForce) jumpForce = maxJumpForce;
	else GameObject.Find("GameLogic").GetComponent(GameLogic).battery -= 0.1;
	
}

function chargeShot() {
	if (currentSeeds > 0) {
		lineRenderer.enabled = true;	
		
		y0 = this.gameObject.transform.position.y;
		
		vx += 0.12;
		vy += 0.09;
		v = vx * vx + vy * vy;

		//formula for max dist: d = (v*v*sin(2*angle)) / gravity
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
		var newSeed:GameObject = Instantiate(Resources.Load("Prefabs/Seed", GameObject), this.gameObject.transform.position + new Vector3(2, 0, 0), Quaternion.identity);
		newSeed.gameObject.name = "Seed";
		newSeed.gameObject.transform.parent = GameObject.Find("SeedContainer").gameObject.transform;
		newSeed.gameObject.GetComponent(SeedBehaviour).setShroomType(currentShroom);
		newSeed.rigidbody.velocity = new Vector3(vx, vy, 0);
		vx = 0;
		vy = 0;
		x8 = 0;
		yield WaitForSeconds(3);
		lineRenderer.enabled = false;
	}
}

public function setShroom(index:int)
{
	currentShroom = shrooms[index];
}

function getSeeds()
{
	return currentSeeds;
}

function flash()
{
	var hit:RaycastHit;
	var direction:Vector3;
	if (getDirection() == "Right") direction = new Vector3(1, 0, 0);
	else if (getDirection() == "Left") direction = new Vector3(-1, 0, 0);
	if (Physics.Raycast(this.gameObject.transform.position, direction, hit, 10)) {
		if (hit.collider.gameObject.name == "Slug") hit.collider.gameObject.GetComponent(SlugScript).toFleeState();
		if (hit.collider.gameObject.name == "Web") hit.collider.gameObject.SetActive(false);
	}
	flashlight.SetActive(true);
	flashBool = true;
}

public function addSample(sample:GameObject) {
	samples.Add(sample);
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

function bounceShroomY():void
{
	this.gameObject.rigidbody.velocity.x = 0;
	this.gameObject.rigidbody.velocity.y = 15;
}

function bounceShroomX():void
{
	//left side
//	if(this.gameObject.transform.position.x < shroom.transform.position.x)
//	{
//		this.gameObject.rigidbody.velocity.y = 0;
//		this.gameObject.rigidbody.velocity.x = -15;
//	}
//	//right side
//	else if(this.gameObject.transform.position.x > shroom.transform.position.x)
//	{
//		this.gameObject.rigidbody.velocity.y = 0;
//		this.gameObject.rigidbody.velocity.x = 15;
//	}

	var velocity = this.gameObject.rigidbody.velocity.x;
	if(Mathf.Abs(velocity) < 0.4)
	{
		if(velocity < 0) velocity = -3;
		else if(velocity > 0) velocity = 3;
	}
	
	velocity *= -4;
	if(velocity > 10)
	{
		velocity = 10;
	}
	else if(velocity < -10)
	{
		velocity = -10;
	}
	this.gameObject.rigidbody.velocity.x = velocity;
}