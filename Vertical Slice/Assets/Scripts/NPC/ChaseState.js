#pragma strict

class ChaseState extends State {

	private var targetFound:boolean;
	private var turn:boolean;

	function Start () {

	}

	function update () {
		targetFound = false;
	
		var rayStart:Vector3 = parent.transform.position + new Vector3(0.0f, 0.5f, 0.0f);
		var vectorDirection:Vector3 = Vector3.zero;
		var hitSide:RaycastHit;
		
		if (parent.rigidbody.velocity.x > 0.0f) vectorDirection = Vector3.right;
		else vectorDirection = Vector3.left;
		
		if (Physics.Raycast(parent.transform.position, vectorDirection, hitSide, Mathf.Infinity, layerMask)) {
			if (hitSide.collider.gameObject == target) {
				targetFound = true;
				turn = false;
			}
		}
		if (!targetFound) {
			if (Physics.Raycast(parent.transform.position, -vectorDirection, hitSide, Mathf.Infinity, layerMask)) {
				if (hitSide.collider.gameObject == target) {
					targetFound = true;
					turn = true;
				}
			}
		}
		
		if (targetFound) moveToTarget();
		else {
			Debug.Log("toReturnState");
			parentScript.toReturnState();
		}
	}
	
	private function moveToTarget() {
		if (turn) speed = -speed;
		parent.rigidbody.velocity.x = Time.deltaTime * speed;
	}
}