#pragma strict

public var tutorialText:String = "";
private var label:GameObject = null;

//Start because label might not be created yet
function Start ()
{
	label = GameObject.Find("Label");
	//if the label is still null log the error
	if(label == null)
	{
		Debug.LogError("Not initialized properly");
	}
}

function OnTriggerStay (collider:Collider)
{
	if(collider.gameObject.name == "Player")
	{
		label.gameObject.guiText.text = tutorialText;
	}

}

function OnTriggerExit (collider:Collider)
{
	label.guiText.text = "";
}

public function getTutorialText():String
{
	return tutorialText;
}

public function setTutorialText(text:String):void
{
	tutorialText = text;
}