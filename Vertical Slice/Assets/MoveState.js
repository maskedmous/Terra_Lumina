#pragma strict

class MoveState extends State {

	private var movedX:float;
	private var speed:float = 5;
	private var rightBound:float = 200;
	private var leftBound:float = -200;
	
	private var direction:String = "right";
			
	function update () {
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
	}

	function setDirection(dir:String) {
		direction = dir;
	}
	
	function setBounds(left:float, right:float) {
		leftBound = left;
		rightBound = right;
	}
}