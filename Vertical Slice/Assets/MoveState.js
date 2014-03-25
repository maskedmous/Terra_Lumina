#pragma strict

class MoveState extends State {

	private var movedX:float;
	private var speed:float = 5;
	
	private var direction:String = "right";
			
	function update () {
		parent.rigidbody.velocity.x = speed;
		movedX += speed;
		if (movedX > 200) {
			speed = -speed;
			setDirection("left");
		}
		if (movedX < -200) {
			speed = -speed;
			setDirection("right");
		}
	}

	function setDirection(dir:String) {
		direction = dir;
	}
}