#pragma strict

class MoveState extends State {

	private var movedX:float;
	private var speed:float = 5;
	private var rightBound:float = 200;
	private var leftBound:float = -200;
	
	private var direction:String = "right";
	
	private var difficulty:String;
			
	function Start() {
		difficulty = parentScript.getDifficulty();
	}		
			
	function update () {
		Debug.Log(parent.rigidbody.velocity.normalized);
		parent.rigidbody.velocity.x = speed;
		movedX += speed;
		if (movedX > rightBound) {
			speed = -speed;
			setDirection("left");
		}
		if (movedX < leftBound) {
			speed = -speed;
			setDirection("right");
		}
		
		if (difficulty == "Hard") {
			var hitSide:RaycastHit;
			if (Physics.Raycast(parent.transform.position, parent.rigidbody.velocity.normalized, hitSide)) {
				if (hitSide.collider.gameObject.name == "Player") {
					parentScript.toChaseState();
				}
			}
		}
	}
	

	function setDirection(dir:String) {
		direction = dir;
	}
	
	function setBounds(left:float, right:float) {
		leftBound = left;
		rightBound = right;
	}
}