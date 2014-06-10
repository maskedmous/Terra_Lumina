#pragma strict

private var currentState:State = null;
private var fleeState:FleeState = null;
private var moveState:MoveState = null;
private var waitState:WaitState = null;
private var chaseState:ChaseState = null;
private var returnState:ReturnState = null;

private var startPosition:Vector3 = Vector3.zero;
public var slugBoundA:GameObject;
public var slugBoundB:GameObject;

public var difficulty:String = "";

function Awake()
{
	fleeState = this.gameObject.AddComponent(FleeState) as FleeState;
	moveState = this.gameObject.AddComponent(MoveState) as MoveState;
	waitState = this.gameObject.AddComponent(WaitState) as WaitState;
	
	currentState = moveState;
	
	if (difficulty == "Hard") {
		chaseState = this.gameObject.AddComponent(ChaseState) as ChaseState;
		returnState = this.gameObject.AddComponent(ReturnState) as ReturnState;
	}
}

function Start()
{
	startPosition = this.gameObject.transform.position;
}

function Update () 
{
	currentState.update();
}

function toFleeState():void
{
	if (currentState == moveState || currentState == chaseState || currentState == returnState) currentState = fleeState;
}

function toMoveState():void
{
	currentState = moveState;
}

function toWaitState():void
{
	currentState = waitState;
}

function toReturnState():void 
{
	currentState = returnState;
}

function toChaseState():void
{
	currentState = chaseState;
}

function getDifficulty():String 
{
	return difficulty;
}

public function isWaitState():boolean
{
	if(currentState == waitState)
	{
		return true;
	}
	
	return false;
}

function OnCollisionEnter(collision:Collision):void {
	var name:String = collision.collider.gameObject.name;
	if (name.Contains("Wheel") || name == "Player") {
		if (collision.collider.gameObject.transform.position.x > this.gameObject.transform.position.x) {
			currentState.bouncePlayer("right");
		}
		else {
			currentState.bouncePlayer("left");
		}
	}
}

public function getSlugBoundA():GameObject
{
	return slugBoundA;
}

public function setSlugBoundA(boundA:GameObject):void
{
	slugBoundA = boundA;
}

public function getSlugBoundB():GameObject
{
	return slugBoundB;
}

public function setSlugBoundB(boundB:GameObject):void
{
	slugBoundB = boundB;
}

public function getStart():Vector3
{
	return startPosition;
}