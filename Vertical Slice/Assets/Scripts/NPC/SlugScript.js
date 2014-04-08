#pragma strict

private var currentState:State;
private var fleeState:FleeState;
private var moveState:MoveState;
private var waitState:WaitState;

function Awake()
{
	fleeState = this.gameObject.AddComponent("FleeState") as FleeState;
	moveState = this.gameObject.AddComponent("MoveState") as MoveState;
	waitState = this.gameObject.AddComponent("WaitState") as WaitState;
	
	currentState = moveState;
}

function Update () {
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

function setBounds(left:float, right:float)
{
	moveState.setBounds(left, right);
}