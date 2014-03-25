#pragma strict

private var waitTime:float = 50;

class WaitState extends State {
	
	function update () {
		waitTime--;
		if (waitTime < 0) toMoveState();
	}
	
	function toMoveState() {
		parentScript.toMoveState();
	}
	
}