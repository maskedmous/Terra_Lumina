#pragma strict

private var currentState:State;
private var fleeState:FleeState;
private var moveState:MoveState;
private var waitState:WaitState;
private var chaseState:ChaseState;
private var returnState:ReturnState;

private var difficulty:String;

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

function setBounds(left:float, right:float)
{
	moveState.setBounds(left, right);
}

function getDifficulty():String 
{
	return difficulty;
}

function setDifficulty(dif:String) 
{
	difficulty = dif;
}