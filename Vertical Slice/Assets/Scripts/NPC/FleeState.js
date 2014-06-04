#pragma strict

class FleeState extends State {
	
	function update ():void {
		toWaitState();
	}
	
	function toWaitState():void {
		this.parent.rigidbody.velocity.x = 0.0f;
		this.parent.collider.enabled = false;
		this.parent.renderer.enabled = false;
		this.parent.rigidbody.useGravity = false;
		parentScript.toWaitState();
	}
}