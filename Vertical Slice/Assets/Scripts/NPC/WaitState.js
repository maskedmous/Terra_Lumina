#pragma strict

private var waitTime:float = 2.0f;

class WaitState extends State {
	
	function update () {
		waitTime -= Time.deltaTime;
		if (waitTime < 0) toMoveState();
	}
	
	function toMoveState() {
		parentScript.toMoveState();
		this.parent.renderer.enabled = true;
		this.parent.collider.enabled = true;
		this.parent.rigidbody.useGravity = true;
		waitTime = 2.0f;
	}
}