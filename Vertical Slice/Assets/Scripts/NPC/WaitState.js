#pragma strict

private var waitTime:float = 2.0f;

private var player:GameObject;

class WaitState extends State {
	
	function update () {
		waitTime -= Time.deltaTime;
		if (waitTime < 0) appear();
	}
	
	function toMoveState() {
		parentScript.toMoveState();
	}
	
	function appear() {
		var startPosition:Vector3 = this.parentScript.getStart();
		var playerPosition:Vector3 = target.transform.position;
		
		if (Vector3.Distance(startPosition, playerPosition) < 3.0f) {
			findNewSpawnPoint();
		}
		else {
			this.parent.transform.position = startPosition;
		}
		
		this.parent.renderer.enabled = true;
		this.parent.collider.enabled = true;
		this.parent.rigidbody.useGravity = true;
		waitTime = 2.0f;
		
		toMoveState();
	}
	
	function findNewSpawnPoint() {
		var currentSpawnPoint:Vector3;
		currentSpawnPoint = parentScript.getStart();
		var newSpawnPoint:Vector3;
		//if (target.transform.position.x > currentSpawnPoint.x) {
			newSpawnPoint = currentSpawnPoint + new Vector3(-3.0f, 0.0f, 0.0f);
		//}
		//else {
		//	newSpawnPoint = currentSpawnPoint + new Vector3(3.0f, 0.0f, 0.0f);
		//}
		this.parent.transform.position = newSpawnPoint;
	}
}