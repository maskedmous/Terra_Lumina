#pragma strict

public var jumpDust:GameObject;
public var landDust:GameObject;

public var driveDust:Transform;
public var engineJump:Transform;

private var engineJumpTimer:float = 0.0f;

function Start () {
	jumpDust = Instantiate(jumpDust, Vector3.zero, Quaternion.identity);
	jumpDust.transform.rotation.eulerAngles.x = 270.0f;
	
	landDust = Instantiate(landDust, Vector3.zero, Quaternion.identity);
	
	driveDust = this.gameObject.transform.FindChild("DriveDust");
	driveDust.gameObject.transform.localPosition = new Vector3(-1.35f, -0.76f, 0.0f);
	driveDust.gameObject.transform.rotation.eulerAngles.y = 270.0f;
	
	engineJump = this.gameObject.transform.FindChild("Engine");
	engineJump.gameObject.transform.localPosition = new Vector3(-0.9f, -0.25f, 0.0f);
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
		case "engineJump":
			engineJump.particleEmitter.emit = true;
			engineJumpTimer = 0.2f;
			break;
		case "landDust":
			landDust.transform.position = this.gameObject.transform.position - new Vector3(0.0f, 0.5f, 0.0f);
			landDust.particleSystem.Clear();
			landDust.particleSystem.Play();
			break;
	}
}

public function playParticle(name:String, speed:float) {
	switch(name) {
		case "driveDust":
			if (speed > 0.08f) {
				driveDust.particleSystem.startSpeed = speed;
				if (!driveDust.particleSystem.isPlaying) driveDust.particleSystem.Play();
			}
			else if (driveDust.particleSystem.isPlaying) {
				driveDust.particleSystem.Stop();
			}
			break;
	}
}