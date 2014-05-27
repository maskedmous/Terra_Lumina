#pragma strict

private var currentState:State;
private var fleeState:FleeState;
private var moveState:MoveState;
private var waitState:WaitState;
private var chaseState:ChaseState;
private var returnState:ReturnState;

private var startPosition:Vector3;
public var slugBoundA:GameObject;
public var slugBoundB:GameObject;

public var difficulty:String;

function Awake()
{
	fleeState = this.gameObject.AddComponent("FleeState") as FleeState;
	moveState = this.gameObject.AddComponent("MoveState") as MoveState;
	waitState = this.gameObject.AddComponent("WaitState") as WaitState;
	
	currentState = moveState;
	
	if (difficulty == "Hard") {
		chaseState = this.gameObject.AddComponent("ChaseState") as ChaseState;
		returnState = this.gameObject.AddComponent("ReturnState") as ReturnState;
	}
	
	startPosition = this.gameObject.transform.position;
}

function Update () 
{
	currentState.update();
}

function toFleeState()
{
	currentState = fleeState;
}

function toMoveState()
{
	currentState = moveState;
}

function toWaitState()
{
	currentState = waitState;
}

function toReturnState() 
{
	currentState = returnState;
}

function toChaseState() 
{
	currentState = chaseState;
}

function getDifficulty():String 
{
	return difficulty;
}

public function getSlugBoundA():GameObject
{
	return slugBoundA;
}

public function setSlugBoundA(boundA:GameObject)
{
	slugBoundA = boundA;
}

public function getSlugBoundB():GameObject
{
	return slugBoundB;
}

public function setSlugBoundB(boundB:GameObject)
{
	slugBoundB = boundB;
}

public function getStart():Vector3
{
	return startPosition;
}