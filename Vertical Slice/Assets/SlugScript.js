#pragma strict

private var currentState:State;
private var fleeState:FleeState;
private var moveState:MoveState;
private var waitState:WaitState;

function Start () {
	fleeState = new FleeState();
	moveState = new MoveState();
	waitState = new WaitState();
}

function toFleeState()
{
	currentState = fleeState;
}

function Update () {
	currentState.update();
}

function toMoveState()
{
	currentState = moveState;
}

function toWaitState()
{
	currentState = waitState;
}