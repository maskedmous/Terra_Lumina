#pragma strict

import System.Xml;	//needed for XML reading
import System.IO;	//needed for File IO (example: File.Exists)

public var levelName:String = "";		//name of the xml it will be saved as
public var levelID:int 		= 0;		//level ID (level0, level1, level2 etc)
public var overwrite:boolean = false;	//override the current .xml if it already exists

public var easy:boolean = false;		//boolean for level difficulty setting
public var medium:boolean = false;
public var hard:boolean = false;

private var xmlPath:String 	= "";		//initialized in the awake

function Awake()
{
	if(Application.loadedLevelName == "LevelEditor")
	{	
		Debug.LogError("Please save this scene first as a new scene before saving the level");
	}
	else
	{
		xmlPath = Application.dataPath + "/LevelsXML/";
		
		if(levelName != "")
		{
			if(!levelName.Contains(".xml"))
			{
				levelName = levelName + ".xml";
			}
			
			if(saveLevel() == -1)
			{
				Debug.LogError("Xml not saved due to an error");
			}
		}
		else
		{
			Debug.LogError("You haven't filled in a Level Name, see SaveLevel");
		}
	}
}

private function saveLevel():int
{
	var xmlDocument:XmlDocument = new XmlDocument();
	var filePath:String = xmlPath + levelName;
	
	var masterNode:XmlElement = null;
	
	//check if the file already exists
	if(File.Exists(filePath))
	{
		//file already exists!
		//check if you may override or not (standard false)
		if(overwrite)
		{
			Debug.Log("overwriting = true, overwriting xml file");
			xmlDocument.Load(filePath);
			masterNode = xmlDocument.DocumentElement;
			masterNode.RemoveAll();
		}
		else
		{
			Debug.LogError("This file already exists and override is set to false");
			return -1;
		}
		
	}
	else
	{
		//file does not exist yet so we are going to create it
		File.WriteAllText(filePath, "<Root></Root>");
		//load the xml document
		xmlDocument.Load(filePath);
		//set the masternode for appending level stuff
		masterNode = xmlDocument.DocumentElement;
	}
	
	//begin saving the level elements!
	
	//
	//Level ID
	//
		var levelIDNode:XmlElement = xmlDocument.CreateElement("LevelID");
		masterNode.AppendChild(levelIDNode);
		levelIDNode.InnerText = levelID.ToString();
		Debug.Log("Level ID: " + levelID);
	
	//
	//Difficulty
	//
		var difficultyNode:XmlElement = xmlDocument.CreateElement("Difficulty");
		masterNode.AppendChild(difficultyNode);
		
		if(easy != false || medium != false || hard != false)
		{
			if(easy == true && medium == false && hard == false)
			{
				difficultyNode.InnerText = "Easy";
				Debug.Log("Difficulty = easy");
			}
			else if(medium == true && easy == false && hard == false)
			{
				difficultyNode.InnerText = "Medium";
				Debug.Log("Difficulty = Medium");
			}
			else if(hard == true && easy == false && medium == false)
			{
				difficultyNode.InnerText = "Hard";
				Debug.Log("Difficulty = Hard");
			}
			else
			{
				Debug.LogError("Something went wrong with selecting the difficulty setting, thicked 2 boxes perhaps?");
				return -1;
			}
		}
		else
		{
			Debug.LogError("Please state the difficulty setting correctly");
			return -1;
		}
	
	//
	//camera
	//
		var mainCamera:GameObject = Camera.main.gameObject;
		var cameraNode:XmlElement = xmlDocument.CreateElement("Camera");
		masterNode.AppendChild(cameraNode);
		
		//save position
		var cameraPositionNode:XmlElement = xmlDocument.CreateElement("Position");
		cameraNode.AppendChild(cameraPositionNode);
		
		var cameraXNode:XmlElement = xmlDocument.CreateElement("x");
		var cameraYNode:XmlElement = xmlDocument.CreateElement("y");
		var cameraZNode:XmlElement = xmlDocument.CreateElement("z");
		
		cameraPositionNode.AppendChild(cameraXNode);
		cameraPositionNode.AppendChild(cameraYNode);
		cameraPositionNode.AppendChild(cameraZNode);
		
		cameraXNode.InnerText = mainCamera.transform.position.x.ToString();
		cameraYNode.InnerText = mainCamera.transform.position.y.ToString();
		cameraZNode.InnerText = mainCamera.transform.position.z.ToString();
		
		//save the rotation
		var cameraRotationNode:XmlElement = xmlDocument.CreateElement("Rotation");
		cameraNode.AppendChild(cameraRotationNode);
		
		var cameraXRotationNode:XmlElement = xmlDocument.CreateElement("x");
		var cameraYRotationNode:XmlElement = xmlDocument.CreateElement("y");
		var cameraZRotationNode:XmlElement = xmlDocument.CreateElement("z");
		
		cameraRotationNode.AppendChild(cameraXRotationNode);
		cameraRotationNode.AppendChild(cameraYRotationNode);
		cameraRotationNode.AppendChild(cameraZRotationNode);
		
		cameraXRotationNode.InnerText = mainCamera.transform.eulerAngles.x.ToString();
		cameraYRotationNode.InnerText = mainCamera.transform.eulerAngles.y.ToString();
		cameraZRotationNode.InnerText = mainCamera.transform.eulerAngles.z.ToString();
	//
	
	//
	//GameLogic xml
	//
		var gameLogic:XmlElement = xmlDocument.CreateElement("GameLogic");
		masterNode.AppendChild(gameLogic);
		
		var gameLogicObject:GameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic);
		
		//save the variables into the GameLogic xml
		var batteryNode:XmlElement 					= xmlDocument.CreateElement("Battery");
		var maximumBatteryCapacityNode:XmlElement 	= xmlDocument.CreateElement("MaximumBatteryCapacity");
		var decreaseTimerNode:XmlElement 			= xmlDocument.CreateElement("DecreaseTimer");
		var negativeBatteryFlowNode:XmlElement 		= xmlDocument.CreateElement("NegativeBatteryFlow");
		var positiveBatteryFlowNode:XmlElement 		= xmlDocument.CreateElement("PositiveBatteryFlow");
		var speedNode:XmlElement					= xmlDocument.CreateElement("Speed");
		var jumpDrainNode:XmlElement				= xmlDocument.CreateElement("JumpDrain");
		var shootDrainNode:XmlElement				= xmlDocument.CreateElement("ShootDrain");
		var pickUpDrainNode:XmlElement				= xmlDocument.CreateElement("PickUpDrain");
		var placeDrainNode:XmlElement				= xmlDocument.CreateElement("PlaceDrain"); 
		var flashDrainNode:XmlElement				= xmlDocument.CreateElement("FlashDrain");
		var collectDrainNode:XmlElement				= xmlDocument.CreateElement("CollectDrain");
			
		//append them
		gameLogic.AppendChild(batteryNode);
		gameLogic.AppendChild(maximumBatteryCapacityNode);
		gameLogic.AppendChild(decreaseTimerNode);
		gameLogic.AppendChild(negativeBatteryFlowNode);
		gameLogic.AppendChild(positiveBatteryFlowNode);
		gameLogic.AppendChild(speedNode);
		gameLogic.AppendChild(jumpDrainNode);
		gameLogic.AppendChild(shootDrainNode);
		gameLogic.AppendChild(pickUpDrainNode);
		gameLogic.AppendChild(placeDrainNode);
		gameLogic.AppendChild(flashDrainNode);
		gameLogic.AppendChild(collectDrainNode);
		
		//write text to it
		batteryNode.InnerText 					= gameLogicObject.getBattery().ToString();
		maximumBatteryCapacityNode.InnerText	= gameLogicObject.getBatteryCapacity().ToString();
		decreaseTimerNode.InnerText				= gameLogicObject.getDecreaseTimer().ToString();
		negativeBatteryFlowNode.InnerText		= gameLogicObject.getNegativeBatteryFlow().ToString();
		positiveBatteryFlowNode.InnerText		= gameLogicObject.getPositiveBatteryFlow().ToString();
		speedNode.InnerText									= gameLogicObject.getSpeed().ToString();
		jumpDrainNode.InnerText							= gameLogicObject.getJumpDrain().ToString();
		shootDrainNode.InnerText							= gameLogicObject.getShootDrain().ToString();
		pickUpDrainNode.InnerText						= gameLogicObject.getPickUpDrain().ToString();
		placeDrainNode.InnerText							= gameLogicObject.getPlaceDrain().ToString();
		flashDrainNode.InnerText							= gameLogicObject.getFlashDrain().ToString();
		collectDrainNode.InnerText						= gameLogicObject.getCollectDrain().ToString();
	//
	
	//
	//Level xml
	//
		var levelNode:XmlElement = xmlDocument.CreateElement("Level");
		masterNode.AppendChild(levelNode);
		
		var levelObject:GameObject = GameObject.Find("Level");
		for(var _obj in levelObject.transform)
		{
			var obj:Transform 			= _obj as Transform;
			var objectNode:XmlElement 	= xmlDocument.CreateElement("GameObject");
			levelNode.AppendChild(objectNode);
			
			//save prefab name
			var prefabNode:XmlElement 	= xmlDocument.CreateElement("Prefab");
			objectNode.AppendChild(prefabNode);
			prefabNode.InnerText 		= obj.gameObject.name;
			
			//save position
			var positionNode:XmlElement = xmlDocument.CreateElement("Position");
			objectNode.AppendChild(positionNode);
			
			var xNode:XmlElement = xmlDocument.CreateElement("x");
			var yNode:XmlElement = xmlDocument.CreateElement("y");
			var zNode:XmlElement = xmlDocument.CreateElement("z");
			
			positionNode.AppendChild(xNode);
			positionNode.AppendChild(yNode);
			positionNode.AppendChild(zNode);
			
			xNode.InnerText = obj.gameObject.transform.position.x.ToString();
			yNode.InnerText = obj.gameObject.transform.position.y.ToString();
			zNode.InnerText = obj.gameObject.transform.position.z.ToString();
			
			//save the rotation
			var rotationNode:XmlElement = xmlDocument.CreateElement("Rotation");
			objectNode.AppendChild(rotationNode);
			
			var xRotationNode:XmlElement = xmlDocument.CreateElement("x");
			var yRotationNode:XmlElement = xmlDocument.CreateElement("y");
			var zRotationNode:XmlElement = xmlDocument.CreateElement("z");
			
			rotationNode.AppendChild(xRotationNode);
			rotationNode.AppendChild(yRotationNode);
			rotationNode.AppendChild(zRotationNode);
			
			xRotationNode.InnerText = obj.gameObject.transform.eulerAngles.x.ToString();
			yRotationNode.InnerText = obj.gameObject.transform.eulerAngles.y.ToString();
			zRotationNode.InnerText = obj.gameObject.transform.eulerAngles.z.ToString();
			
			//save the scale
			var scaleNode:XmlElement = xmlDocument.CreateElement("Scaling");
			objectNode.AppendChild(scaleNode);
			
			var xScaleNode:XmlElement = xmlDocument.CreateElement("x");
			var yScaleNode:XmlElement = xmlDocument.CreateElement("y");
			var zScaleNode:XmlElement = xmlDocument.CreateElement("z");
			
			scaleNode.AppendChild(xScaleNode);
			scaleNode.AppendChild(yScaleNode);
			scaleNode.AppendChild(zScaleNode);
			
			xScaleNode.InnerText = obj.gameObject.transform.localScale.x.ToString();
			yScaleNode.InnerText = obj.gameObject.transform.localScale.y.ToString();
			zScaleNode.InnerText = obj.gameObject.transform.localScale.z.ToString();
			
			//special nodes
			//only if it is a tutorial object
			if(obj.gameObject.name == "TutorialObject")
			{
				//required objects
				var triggerScript:TutorialTriggerScript = obj.gameObject.GetComponent(TutorialTriggerScript) as TutorialTriggerScript;
				var boxCollider:BoxCollider = obj.gameObject.GetComponent(BoxCollider) as BoxCollider;
				var boundingBox:Vector3 = boxCollider.size;
				
				//tutorial node
				var tutorialNode:XmlElement = xmlDocument.CreateElement("Tutorial");
				objectNode.AppendChild(tutorialNode);
				
				//trigger string
				var triggerStringNode:XmlElement = xmlDocument.CreateElement("TriggerString");
				tutorialNode.AppendChild(triggerStringNode);
				triggerStringNode.InnerText = triggerScript.getTutorialText();
				
				//bounding box
				var boundingBoxNode:XmlElement = xmlDocument.CreateElement("BoundingBox");
				tutorialNode.AppendChild(boundingBoxNode);
				
				var xBoundingBoxNode:XmlElement = xmlDocument.CreateElement("x");
				var yBoundingBoxNode:XmlElement = xmlDocument.CreateElement("y");
				var zBoundingBoxNode:XmlElement = xmlDocument.CreateElement("z");
				
				boundingBoxNode.AppendChild(xBoundingBoxNode);
				boundingBoxNode.AppendChild(yBoundingBoxNode);
				boundingBoxNode.AppendChild(zBoundingBoxNode);
				
				xBoundingBoxNode.InnerText = boundingBox.x.ToString();
				yBoundingBoxNode.InnerText = boundingBox.y.ToString();
				zBoundingBoxNode.InnerText = boundingBox.z.ToString();
			}
		}
	//
	
	//player
	//
			var player:GameObject = GameObject.Find("Player");
			
			var playerNode:XmlElement = xmlDocument.CreateElement("Player");
			masterNode.AppendChild(playerNode);
			
			//save position
			var playerPositionNode:XmlElement = xmlDocument.CreateElement("Position");
			playerNode.AppendChild(playerPositionNode);
			
			var playerXNode:XmlElement = xmlDocument.CreateElement("x");
			var playerYNode:XmlElement = xmlDocument.CreateElement("y");
			var playerZNode:XmlElement = xmlDocument.CreateElement("z");
			
			playerPositionNode.AppendChild(playerXNode);
			playerPositionNode.AppendChild(playerYNode);
			playerPositionNode.AppendChild(playerZNode);
			
			playerXNode.InnerText = player.transform.position.x.ToString();
			playerYNode.InnerText = player.transform.position.y.ToString();
			playerZNode.InnerText = player.transform.position.z.ToString();
			
			//save the rotation
			var playerRotationNode:XmlElement = xmlDocument.CreateElement("Rotation");
			playerNode.AppendChild(playerRotationNode);
			
			var playerXRotationNode:XmlElement = xmlDocument.CreateElement("x");
			var playerYRotationNode:XmlElement = xmlDocument.CreateElement("y");
			var playerZRotationNode:XmlElement = xmlDocument.CreateElement("z");
			
			playerRotationNode.AppendChild(playerXRotationNode);
			playerRotationNode.AppendChild(playerYRotationNode);
			playerRotationNode.AppendChild(playerZRotationNode);
			
			playerXRotationNode.InnerText = player.transform.eulerAngles.x.ToString();
			playerYRotationNode.InnerText = player.transform.eulerAngles.y.ToString();
			playerZRotationNode.InnerText = player.transform.eulerAngles.z.ToString();
	//
	
	xmlDocument.Save(filePath);
	Debug.Log("Xml saved to: Assets/LevelsXML/" + levelName);
	return 0;
}