#pragma strict

class MoveState extends State {

	private var direction:String = "right";
	
	public var slugBoundA:GameObject;
	public var slugBoundB:GameObject;
	
	private var difficulty:String;
			
	function Start() {
		difficulty = parentScript.getDifficulty();
		slugBoundA = parentScript.getSlugBoundA();
		slugBoundB = parentScript.getSlugBoundB();
	}		
			
	function update () {
		parent.rigidbody.velocity.x = speed * Time.deltaTime;
		
		/*if (difficulty == "Hard") {
		
			var rayStart:Vector3 = parent.transform.position + new Vector3(0.0f, 0.25f, 0.0f);
			var vectorDirection:Vector3 = Vector3.zero;
			var hitSide:RaycastHit;
			
			if (direction == "Right") vectorDirection = Vector3.right;
			else vectorDirection = Vector3.left;
			if (Physics.Raycast(rayStart, vectorDirection, hitSide, Mathf.Infinity, layerMask)) {
				if (hitSide.collider.gameObject.name == "Player") {
					Debug.Log("toChaseState");
					parentScript.toChaseState();
				}
				Debug.Log(hitSide.collider.gameObject.name);
			}
		}*/
	}
	
	function OnTriggerEnter(collider:Collider) {
		if (collider.gameObject == slugBoundA || collider.gameObject == slugBoundB) {
			speed = -speed;
			if (direction == "Right") direction = "Left";
			else direction = "Right";
		}
	}

	function setDirection(dir:String) {
		direction = dir;
	}
}