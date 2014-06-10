#pragma strict

class FleeState extends State {
	
	function update ():void {
		toWaitState();
	}
	
	function toWaitState():void {
		Debug.Log("hsdfkljd");
		parent.rigidbody.velocity.x = 0.0f;
		parent.collider.enabled = false;
		parent.transform.FindChild("slug_1").renderer.enabled = false;
		parent.rigidbody.useGravity = false;
		parent.rigidbody.isKinematic = true;
		parentScript.toWaitState();
	}
}