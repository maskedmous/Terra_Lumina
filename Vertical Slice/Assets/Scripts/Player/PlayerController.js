#pragma strict

import System.Collections.Generic;

var debugInfo:String = "";

var lastDirection:String="Right";
private var maxSpeed:float = 8.0;

private var lineRenderer:LineRenderer = null;
private var y0:float = 0;
private var x1:float = 0;
private var x2:float = 0;
private var x3:float = 0;
private var x4:float = 0;
private var x5:float = 0;
private var x6:float = 0;
private var x7:float = 0;
private var x8:float = 2.3f;
private var increasing:boolean = true;
private var g:float = 0;
private var tanAngle:float = .75;
private var cosAngle:float = .6;
private var v:float  = 0;
private var vx:float = 0;
private var vy:float = 0;

private var isJumping:boolean = false;
private var initializeJumping:boolean = false;
private var jumpForce:float = 7.0;

//shroom seed shooting
private var isShooting:boolean = false;								//is it shooting at the moment?
private var currentSeeds:uint = 10;									//current amount of seed
private var currentShroom:GameObject  = null;						//current shroom that is active for shooting
private var shrooms:List.<GameObject> = new List.<GameObject>();	//list of shrooms to shoot (should be 2)
private var samples:List.<GameObject> = new List.<GameObject>();	//the samples you collect

private var gameLogic:GameObject		= null;
private var gameLogicScript:GameLogic   = null;

public var flashlight:GameObject;
private var flashBool:boolean;
private var counter:float;

private var control:boolean = true;

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
	g = -Physics.gravity.y;
	
	rigidbody.centerOfMass = new Vector3(-0.2f, -0.25f, 0.0f);
}

function Update()
{
	if(control)
	{
		movement();
		
		if(flashBool == true) {
			flash();
			counter += Time.deltaTime;
			if(counter >= 2) {
				flashlight.SetActive(false);
				flashBool = false;
				counter = 0;
			}
		}
	}
}

public function stopMovement()
{
	this.gameObject.rigidbody.velocity.x = 0;
}

public function stopControl()
{
	control = false;
}

function movement()
{
	var hitFound:boolean = false;
	var hitDown:RaycastHit;
	var wheels:List.<GameObject> = new List.<GameObject>();
	var layerMask:int = 1 << 8;
	layerMask = ~layerMask;
	
	wheels.Add(this.gameObject.transform.FindChild("Wheel1").gameObject);
	wheels.Add(this.gameObject.transform.FindChild("Wheel2").gameObject);
	wheels.Add(this.gameObject.transform.FindChild("Wheel3").gameObject);
	wheels.Add(this.gameObject.transform.FindChild("Wheel4").gameObject);
	
	if (isJumping && this.gameObject.rigidbody.velocity.y < 0) {
		for (var i:uint = 0; i < wheels.Count; ++i) {
			if (Physics.Raycast(wheels[i].transform.position, Vector3.down, hitDown, 0.3f, layerMask)) {
				if (hitDown.collider.name != "Light") {	
					hitFound = true;
					break;
				}
			}
		}
	}
	
	if (hitFound) {
		isJumping = false;
		this.gameObject.rigidbody.constraints = RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY| RigidbodyConstraints.FreezePositionZ;
	}
	
	/*if (Physics.Raycast(this.gameObject.transform.position, new Vector3(0, -1, 0), hitDown, 1)) {	
		if (hitDown.collider.name == "Light"){
			isJumping = true;
		}
		else{
			isJumping = false;
			this.gameObject.rigidbody.constraints = RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationY| RigidbodyConstraints.FreezePositionZ;
		}
	}
	else {
		isJumping = true;
		this.gameObject.rigidbody.constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionZ;
	}*/
	
	//making sure rover does not rotate beyond 45 degrees from original rotation
	var cRot = this.gameObject.transform.rotation.eulerAngles.z;
	if (cRot > 45 && cRot < 180) this.gameObject.transform.rotation.eulerAngles.z = 45;
	if (cRot > 180 && cRot < 315) this.gameObject.transform.rotation.eulerAngles.z = 315;
}


public function move(mousePos:float) {
	var soundEngine = GameObject.Find("SoundEngine").GetComponent(SoundEngineScript);
	soundEngine.playSoundEffect("rover");
	if (mousePos > ((Screen.width / 2) + (Screen.width * (1.0 / 50.0)))) moveRight();
	if (mousePos < ((Screen.width / 2) - (Screen.width * (1.0 / 50.0)))) moveLeft();
}

private function moveLeft()
{
	if (this.gameObject.rigidbody.velocity.x > -maxSpeed) this.gameObject.rigidbody.velocity.x -= 15 * Time.deltaTime;
	if (this.getDirection() == "Right")	{
		this.gameObject.transform.rotation.eulerAngles.y = 180;
		this.gameObject.transform.rotation.eulerAngles.z *= -1;
		this.gameObject.transform.rotation.eulerAngles.x *= -1;
	}
	setDirection("Left");
}

private function moveRight()
{
	if (this.gameObject.rigidbody.velocity.x < maxSpeed) this.gameObject.rigidbody.velocity.x += 15 * Time.deltaTime;
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
		var vx = this.gameObject.rigidbody.velocity.x;
		if (vx > 0.10f) this.gameObject.rigidbody.velocity.x -= 5 * Time.deltaTime;
		else if (vx < -0.10f) this.gameObject.rigidbody.velocity.x += 5 * Time.deltaTime;
		else if (vx > -0.05f && vx < 0.05f) this.gameObject.rigidbody.velocity.x = 0.0f;
	}
}

public function jump() {
	if (!isJumping) {
		Debug.Log("jump called");
		this.gameObject.rigidbody.velocity.y = jumpForce;
		jumpForce = 7.0f;
		isJumping = true;
		this.gameObject.rigidbody.constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionZ;
		var soundEngine = GameObject.Find("SoundEngine").GetComponent(SoundEngineScript);
		soundEngine.playSoundEffect("jump");
	}
}

function chargeShot() {
	if (currentSeeds > 0) {
		//if (getDirection() == "Right") mod = 3.0f;
		//else mod = -3.0f;
		lineRenderer.enabled = true;	
		
		y0 = this.gameObject.transform.position.y;
		
		//vx += mod * Time.deltaTime;
		//vy += mod * Time.deltaTime;
		if (increasing) {
			vx += 3.0f * Time.deltaTime;
			vy += 2.25f * Time.deltaTime;
		}
		else {
			vx -= 3.0f * Time.deltaTime;
			vy -= 2.25f * Time.deltaTime;
		}
		v = vx * vx + vy * vy;

		//formula for max dist: d = (v*v*sin(2*angle)) / gravity
		//replaced sin(2*angle), which was .96, with a bigger number due to the trajectory not starting on the ground.

		if (vx < 3.0f) {
			increasing = true;
			vx = 3.0f;
			vy = 2.25f;
		}
		if (vx > 8.8f) {
			increasing = false;
		}
		
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
		
		if (getDirection() == "Left") {
			x1 = -x1;
			x2 = -x2;
			x3 = -x3;
			x4 = -x4;
			x5 = -x5;
			x6 = -x6;
			x7 = -x7;
			x8 = -x8;
			
			lineRenderer.SetPosition(0, new Vector3(this.gameObject.transform.position.x - 2, y0, this.gameObject.transform.position.z));
			lineRenderer.SetPosition(1, new Vector3(this.gameObject.transform.position.x - 2 + x1, y1, this.gameObject.transform.position.z));
			lineRenderer.SetPosition(2, new Vector3(this.gameObject.transform.position.x - 2 + x2, y2, this.gameObject.transform.position.z));
			lineRenderer.SetPosition(3, new Vector3(this.gameObject.transform.position.x - 2 + x3, y3, this.gameObject.transform.position.z));
			lineRenderer.SetPosition(4, new Vector3(this.gameObject.transform.position.x - 2 + x4, y4, this.gameObject.transform.position.z));
			lineRenderer.SetPosition(5, new Vector3(this.gameObject.transform.position.x - 2 + x5, y5, this.gameObject.transform.position.z));
			lineRenderer.SetPosition(6, new Vector3(this.gameObject.transform.position.x - 2 + x6, y6, this.gameObject.transform.position.z));
			lineRenderer.SetPosition(7, new Vector3(this.gameObject.transform.position.x - 2 + x7, y7, this.gameObject.transform.position.z));
			lineRenderer.SetPosition(8, new Vector3(this.gameObject.transform.position.x - 2 + x8, y8, this.gameObject.transform.position.z));
		}
		else {	
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
}

public function resetShot():void {
	vx = 0;
	vy = 0;
	x8 = 2.3f;
	lineRenderer.enabled = false;
}

function shoot()
{
	if (currentSeeds > 0) {
		if(!gameLogicScript.getInfiniteAmmo()) 
		{
			currentSeeds--;
		}
		var newSeed:GameObject;
		if (getDirection() == "Right") newSeed = Instantiate(Resources.Load("Prefabs/Seed", GameObject), this.gameObject.transform.position + new Vector3(2, 0, 0), Quaternion.identity);
		else newSeed = Instantiate(Resources.Load("Prefabs/Seed", GameObject), this.gameObject.transform.position - new Vector3(2, 0, 0), Quaternion.identity);
		newSeed.gameObject.name = "Seed";
		newSeed.gameObject.transform.parent = GameObject.Find("SeedContainer").gameObject.transform;
		newSeed.gameObject.GetComponent(SeedBehaviour).setShroomType(currentShroom);
		
		var soundEngine = GameObject.Find("SoundEngine").GetComponent(SoundEngineScript);
		soundEngine.playSoundEffect("shoot");
		
		if (getDirection() == "Left") vx = -vx;
		newSeed.rigidbody.velocity = new Vector3(vx, vy, 0);
		yield WaitForSeconds(1.5f);
		resetShot();
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

function flash():void
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
	var soundEngine = GameObject.Find("SoundEngine").GetComponent(SoundEngineScript);
	soundEngine.playSoundEffect("flash");
}

public function addSample(sample:GameObject) {
	samples.Add(sample);
}

public function addAmmo(extraAmmo:int)
{
	currentSeeds += extraAmmo;
	
	var maximumAmmo = gameLogicScript.getMaximumAmmo();
	if(currentSeeds > maximumAmmo)
	{
		currentSeeds = maximumAmmo;
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

function bounceShroomY():void
{
	this.gameObject.rigidbody.velocity.x = 0;
	this.gameObject.rigidbody.velocity.y = 15;
}

function bounceShroomX():void
{
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