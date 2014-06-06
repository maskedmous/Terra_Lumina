#pragma strict

public var jumpDust:GameObject;
public var engineJump:GameObject;

private var engineJumpTimer:float = 0.0f;

function Start () {
	jumpDust = Instantiate(jumpDust, Vector3.zero, Quaternion.identity);
	jumpDust.transform.rotation.eulerAngles.x = 270.0f;
}

function Update () {
	if (engineJump.particleEmitter.emit) {
		engineJumpTimer -= Time.deltaTime;
		if (engineJumpTimer < 0.0f) engineJump.particleEmitter.emit = false;
	}
}

public function playParticle(name:String) {
	switch(name) {
		case "jumpDust":
			jumpDust.transform.position = this.gameObject.transform.position - new Vector3(0.0f, 0.5f, 0.0f);
			jumpDust.particleSystem.Clear();
			jumpDust.particleSystem.Play();
			break;
		case "wheelDust":
			break;
		case "engineJump":
			engineJump.particleEmitter.emit = true;
			engineJumpTimer = 0.2f;
			break;
	}
}