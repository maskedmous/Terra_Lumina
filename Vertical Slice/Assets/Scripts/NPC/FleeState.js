#pragma strict

class FleeState extends State {
	
	function update () {
		toWaitState();
	}
	
	function toWaitState() {
		this.parent.rigidbody.velocity.x = 0;
		this.parent.collider.enabled = false;
		//this.parent.renderer.enabled = false;
		this.parent.rigidbody.useGravity = false;
		parentScript.toWaitState();
		Debug.Log("toFleeState");
	}
	
}