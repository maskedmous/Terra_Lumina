#pragma strict

private var jumpDust:GameObject;

function Start () {
	jumpDust = this.gameObject.Find("JumpDust");
	Debug.Log(jumpDust);
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