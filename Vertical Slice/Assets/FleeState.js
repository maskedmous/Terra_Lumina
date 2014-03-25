#pragma strict

class FleeState extends State {
	
	function update () {
	
	}
	
	function toWaitState() {
		parentScript.toWaitState();
	}
	
}