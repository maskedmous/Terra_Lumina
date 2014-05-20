#pragma strict

class MoveState extends State {

	private var speed:float = 250;
	
	private var direction:String = "right";
	
	private var difficulty:String;
			
	function Start() {
		difficulty = parentScript.getDifficulty();
	}		
			
	function update () {
		//Debug.Log(parent.rigidbody.velocity.normalized);
		parent.rigidbody.velocity.x = speed * Time.deltaTime;
//		movedX += speed * Time.deltaTime;
//		if (movedX > rightBound) {
//			speed = -speed;
//			setDirection("left");
//		}
//		if (movedX < leftBound) {
//			speed = -speed;
//			setDirection("right");
//		}
		
		if (difficulty == "Hard") {
			var hitSide:RaycastHit;
			if (Physics.Raycast(parent.transform.position, parent.rigidbody.velocity.normalized, hitSide)) {
				if (hitSide.collider.gameObject.name == "Player") {
					parentScript.toChaseState();
				}
			}
		}
	}
	
	function OnTriggerEnter(collider:Collider) {
		if (collider.name == "SlugBound") {
			speed = -speed;
		}
	}

	function setDirection(dir:String) {
		direction = dir;
	}
}