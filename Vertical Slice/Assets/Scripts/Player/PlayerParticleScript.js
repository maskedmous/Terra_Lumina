#pragma strict

public var jumpDust:GameObject;

function Start () {
	jumpDust = Instantiate(jumpDust, Vector3.zero, Quaternion.identity);
	jumpDust.transform.rotation.eulerAngles.x = 270.0f;
}

function Update () {

}

public function playParticle(name:String) {
	switch(name) {
		case "jumpDust":
			jumpDust.transform.position = this.gameObject.transform.position - new Vector3(0.0f, 0.5f, 0.0f);
			jumpDust.particleSystem.Clear();
			jumpDust.particleSystem.Play();
			break;
	}
}