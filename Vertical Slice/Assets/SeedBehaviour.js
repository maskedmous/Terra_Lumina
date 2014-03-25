#pragma strict

function Start () {
}

function Update () {

}

function OnCollisionEnter(collision:Collision)
{
	if (collision.gameObject.name == "Plateau") {
		this.rigidbody.velocity = new Vector3(0, 0, 0);
		this.rigidbody.isKinematic = true;
		this.rigidbody.useGravity = false;
	}
}