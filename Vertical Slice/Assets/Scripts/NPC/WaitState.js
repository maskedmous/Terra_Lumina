#pragma strict

private var waitTime:float = 2.0f;

private var player:GameObject = null;

class WaitState extends State {
	
	function update():void {
		waitTime -= Time.deltaTime;
		if (waitTime < 0) appear();
	}
	
	function toMoveState():void {
		parentScript.toMoveState();
	}
	
	function appear():void {
		var startPosition:Vector3 = this.parentScript.getStart();
		var playerPosition:Vector3 = target.transform.position;
		
		if (Vector3.Distance(startPosition, playerPosition) < 3.0f) {
			findNewSpawnPoint();
		}
		else {
			this.parent.transform.position = startPosition;
		}
		
		parent.transform.FindChild("slug_1").renderer.enabled = true;
		parent.collider.enabled = true;
		parent.rigidbody.isKinematic = false;
		parent.rigidbody.useGravity = true;
		waitTime = 2.0f;
		
		toMoveState();
	}
	
	function findNewSpawnPoint():void {
		var currentSpawnPoint:Vector3 = Vector3.zero;
		currentSpawnPoint = parentScript.getStart();
		var newSpawnPoint:Vector3 = Vector3.zero;
		newSpawnPoint = currentSpawnPoint + new Vector3(-3.0f, 0.0f, 0.0f);
		this.parent.transform.position = newSpawnPoint;
	}
}