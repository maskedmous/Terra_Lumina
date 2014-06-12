#pragma strict

private var secondTimer:float = 0.0f;
private var increaseBatteryTimer:float = 0.4f;

private var gameLogic:GameLogic = null;
private var funFactScript:FunFactScript = null;

public function Awake():void
{
	gameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic) as GameLogic;
	funFactScript = GameObject.Find("Player").GetComponent(FunFactScript) as FunFactScript;
}


function OnTriggerStay(hit:Collider):void
{
	//if it hits anything execute code
	if(hit.gameObject.name == "Player")
	{
		if(!gameLogic.getCharging())
		{
			//var particleScript:PlayerParticleScript = hit.gameObject.GetComponent(PlayerParticleScript);
			//particleScript.playParticle("charging");
			gameLogic.setCharging(true);
			
		}
		charge();
		displayFact();
	}
}

public function OnTriggerExit(hit:Collider):void
{
	if (hit.gameObject.name == "Player")
	{
		//var particleScript:PlayerParticleScript = hit.gameObject.GetComponent(PlayerParticleScript);
		//particleScript.playParticle("charging");
		gameLogic.setCharging(false);
		stopDisplay();
	}
}

private function charge():void
{
	if(secondTimer > increaseBatteryTimer)
	{
		gameLogic.addBatteryPower();
		secondTimer = 0.0f;
	}
	else
	{
		secondTimer += Time.deltaTime;
	}
}

private function displayFact():void
{
	funFactScript.displayFact();
}

private function stopDisplay():void
{
	funFactScript.stopDisplay();
}