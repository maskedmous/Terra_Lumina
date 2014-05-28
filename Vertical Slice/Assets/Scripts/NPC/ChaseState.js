﻿#pragma strict

class ChaseState extends State {

	private var targetFound:boolean;
	private var turn:boolean;

	function Start () {

	}

	function update () {
		targetFound = false;
	
		var rayStart:Vector3 = parent.transform.position + new Vector3(0.0f, 0.3f, 0.0f);
		var vectorDirection:Vector3 = Vector3.zero;
		var hitSide:RaycastHit;
		var playerPos:Vector3 = target.transform.position;
		var distanceToPlayer = Vector3.Distance(parent.transform.position, playerPos);
		
		if (Mathf.Abs(parent.transform.position.y - playerPos.y) < 1.0f) {
			if (rayStart.x > playerPos.x) {
				if (Physics.Raycast(rayStart, Vector3.left, hitSide, Mathf.Infinity, layerMask)) {
					Debug.Log(hitSide.collider.gameObject.name);
					if (hitSide.collider.name == "Player" || hitSide.distance > distanceToPlayer) {	
						moveToTarget(Vector3.left);
					}
					else {
						parentScript.toReturnState();
					}
				}
			}
			else {
				if (Physics.Raycast(rayStart, Vector3.right, hitSide, Mathf.Infinity, layerMask)) {
					Debug.Log(hitSide.collider.gameObject.name);
					if (hitSide.collider.name == "Player" || hitSide.distance > distanceToPlayer) {	
						moveToTarget(Vector3.right);
					}
					else {
						parentScript.toReturnState();
					}
				}
			}
		}
		else {
			Debug.Log("to returnState");
			parentScript.toReturnState();
		}

		/*if (parent.rigidbody.velocity.x > 0.0f) vectorDirection = Vector3.right;
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
		}*/
		
		/*if (targetFound) moveToTarget();
		else {
			Debug.Log("toReturnState");
			parentScript.toReturnState();
		}*/
	}
	
	private function moveToTarget(direction:Vector3) {
		parent.rigidbody.velocity = direction * Time.deltaTime * speed;
	}
}