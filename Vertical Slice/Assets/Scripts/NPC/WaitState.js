#pragma strict

private var waitTime:float = 150;

class WaitState extends State {
	
	function update () {
		waitTime--;
		if (waitTime < 0) toMoveState();
	}
	
	function toMoveState() {
		parentScript.toMoveState();
		this.parent.renderer.enabled = true;
		this.parent.collider.enabled = true;
		this.parent.rigidbody.useGravity = true;
		waitTime = 150;
	}
}