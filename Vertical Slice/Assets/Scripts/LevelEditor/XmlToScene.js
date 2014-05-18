#pragma strict

import System.Xml;	//needed for XML reading
import System.IO;	//needed for File IO (example: File.Exists)

private var xmlPath:String = "";
private var xmlLevel:String = "";

public function Awake():void
{
	xmlPath = Application.dataPath + "/LevelsXML/";	//standard XML Level Path
}

public function setLevel(levelString:String):void
{
	xmlLevel = levelString;
	
	if(!xmlLevel.Contains(".xml"))
	{
		xmlLevel += ".xml";
	}
}

public function loadLevel()
{
	var filePath:String = xmlPath + xmlLevel;
	var xmlDocument:XmlDocument = new XmlDocument();
	
	if(File.Exists(filePath))
	{		
		xmlDocument.Load(filePath);
		//getting the necessary gameobjects into variables
		var camera:GameObject 	= Camera.main.gameObject;
		var gameLogic:GameLogic = GameObject.Find("GameLogic").GetComponent(GameLogic);
		var level:GameObject 	= GameObject.Find("Level");
		var player:GameObject 	= GameObject.Find("Player");
		var textureLoader:TextureLoader = GameObject.Find("TextureLoader").GetComponent(TextureLoader);
		
		var rootNode:XmlNode 		= xmlDocument.DocumentElement;
		var masterNode:XmlNodeList 	= rootNode.ChildNodes;
		
		for each(var _nodes in masterNode)
		{
			var nodes:XmlNode = _nodes as XmlNode;
			if(nodes.Name == "Camera")
			{
				var cameraNodesList:XmlNodeList = nodes.ChildNodes;
				
				for each(var _cameraStatsNodes in cameraNodesList)
				{
					var cameraStatsNodes:XmlNode = _cameraStatsNodes as XmlNode;
					//get position
					if(cameraStatsNodes.Name == "Position")
					{
						//get x,y,z nodes
						var cameraPositionStatsList:XmlNodeList = cameraStatsNodes.ChildNodes;
						
						for each(var _cameraPositionStats in cameraPositionStatsList)
						{
							var cameraPositionStats:XmlNode = _cameraPositionStats as XmlNode;
							
							if(cameraPositionStats.Name == "x")
							{
								camera.transform.position.x = float.Parse(cameraPositionStats.InnerText);
							}
							if(cameraPositionStats.Name == "y")
							{
								camera.transform.position.y = float.Parse(cameraPositionStats.InnerText);
							}
							if(cameraPositionStats.Name == "z")
							{
								camera.transform.position.z = float.Parse(cameraPositionStats.InnerText);
							}
						}
					}
					//get rotation
					if(cameraStatsNodes.Name == "Rotation")
					{
						var cameraRotationStatsList:XmlNodeList = cameraStatsNodes.ChildNodes;
						
						for each(var _cameraRotationStats in cameraRotationStatsList)
						{
							var cameraRotationStats:XmlNode = _cameraRotationStats as XmlNode;
							
							if(cameraRotationStats.Name == "x")
							{
								camera.transform.rotation.eulerAngles.x = float.Parse(cameraRotationStats.InnerText);
							}
							if(cameraRotationStats.Name == "y")
							{
								camera.transform.rotation.eulerAngles.y = float.Parse(cameraRotationStats.InnerText);
							}
							if(cameraRotationStats.Name == "z")
							{
								camera.transform.rotation.eulerAngles.z = float.Parse(cameraRotationStats.InnerText);
							}
						}
					}
				}
				
			}
			
			if(nodes.Name == "GameLogic")
			{
				var gameLogicStatsNodes:XmlNodeList = nodes.ChildNodes;
				
				for each(var _gameLogicStats in gameLogicStatsNodes)
				{
					var gameLogicStats:XmlNode = _gameLogicStats as XmlNode;
					
					if(gameLogicStats.Name == "Battery")
					{
						gameLogic.setBattery(float.Parse(gameLogicStats.InnerText));
					}
					if(gameLogicStats.Name == "MaximumBatteryCapacity")
					{
						gameLogic.setBatteryCapacity(int.Parse(gameLogicStats.InnerText));
					}
					if(gameLogicStats.Name == "DecreaseTimer")
					{
						gameLogic.setDecreaseTimer(float.Parse(gameLogicStats.InnerText));
					}
					if(gameLogicStats.Name == "NegativeBatteryFlow")
					{
						gameLogic.setNegativeBatteryFlow(int.Parse(gameLogicStats.InnerText));
					}
					if(gameLogicStats.Name == "PositiveBatteryFlow")
					{
						gameLogic.setPositiveBatteryFlow(int.Parse(gameLogicStats.InnerText));
					}
					if(gameLogicStats.Name == "SamplesToComplete")
					{
						gameLogic.setSamplesToComplete(int.Parse(gameLogicStats.InnerText));
					}
					if (gameLogicStats.Name == "Speed") {
						gameLogic.setSpeed(float.Parse(gameLogicStats.InnerText));
					}
					
					if (gameLogicStats.Name == "MaximumAmmo")
					{
						gameLogic.setMaximumAmmo(int.Parse(gameLogicStats.InnerText));
					}
					
					if(gameLogicStats.Name == "InfiniteAmmo")
					{
						gameLogic.setInfiniteAmmo(boolean.Parse(gameLogicStats.InnerText));
					}
					
					if (gameLogicStats.Name == "JumpDrain") {
						gameLogic.setJumpDrain(float.Parse(gameLogicStats.InnerText));
					}
					if (gameLogicStats.Name == "ShootDrain") {
						gameLogic.setShootDrain(float.Parse(gameLogicStats.InnerText));
					}
					if (gameLogicStats.Name == "PickUpDrain") {
						gameLogic.setPickUpDrain(float.Parse(gameLogicStats.InnerText));
					}
					if (gameLogicStats.Name == "PlaceDrain") {
						gameLogic.setPlaceDrain(float.Parse(gameLogicStats.InnerText));
					}
					if (gameLogicStats.Name == "FlashDrain") {
						gameLogic.setFlashDrain(float.Parse(gameLogicStats.InnerText));
					}
					if (gameLogicStats.Name == "CollectDrain") {
						gameLogic.setCollectDrain(float.Parse(gameLogicStats.InnerText));
					}
				}
			}
			
			if(nodes.Name == "Level")
			{
				
				var gameObjectNodeList:XmlNodeList = nodes.ChildNodes;
				
				for each(var _gameObjectNodes in gameObjectNodeList)
				{
					var gameObjectNodes:XmlNode = _gameObjectNodes as XmlNode;
					var gameObjectStatsNodeList = gameObjectNodes.ChildNodes;
					
					var newGameObject	:GameObject = null;
					var prefabName		:String 	= "";
					var position		:Vector3 	= new Vector3(9999,9999,9999);
					var rotation		:Vector3 	= new Vector3(9999,9999,9999);
					var scaling			:Vector3 	= new Vector3(9999,9999,9999);
					
					//tutorial things
					var tutorialTriggerString	:String 	= "";
					var boundingBox				:Vector3 	= new Vector3(9999,9999,9999);
					var tutorialTextTimer		:int 		= -1;
					var movementLeftEnabled		:boolean	= true;
					var movementRightEnabled	:boolean	= true;
					var jumpButtonEnabled		:boolean	= true;
					var normalShroomButtonEnabled:boolean	= true;
					var bumpyShroomButtonEnabled:boolean	= true;
					
					var tutorialTextureA		:Texture2D	= null;
					var xPositionTexA			:float		= 0;
					var yPositionTexA			:float		= 0;
					var timerTexA				:float		= 0;
					
					var tutorialTextureB		:Texture2D	= null;
					var xPositionTexB			:float		= 0;
					var yPositionTexB			:float		= 0;
					var timerTexB				:float		= 0;
					
					var destroyOnExit			:boolean	= false;
					
					for each(var _gameObjectStatsNodes in gameObjectStatsNodeList)
					{
						var gameObjectStatsNodes:XmlNode = _gameObjectStatsNodes as XmlNode;
				
						if(gameObjectStatsNodes.Name == "Prefab")
						{
							prefabName = gameObjectStatsNodes.InnerText;
						}
						if(gameObjectStatsNodes.Name == "Position")
						{
							var gameObjectPositionNodes:XmlNodeList = gameObjectStatsNodes.ChildNodes;
							
							for each(var _positionNodes in gameObjectPositionNodes)
							{
								var positionNode:XmlNode = _positionNodes as XmlNode;
								
								if(positionNode.Name == "x")
								{
									//newGameObject.transform.position.x = float.Parse(positionNode.InnerText);
									position.x = float.Parse(positionNode.InnerText);
								}
								if(positionNode.Name == "y")
								{
									//newGameObject.transform.position.y = float.Parse(positionNode.InnerText);
									position.y = float.Parse(positionNode.InnerText);
								}
								if(positionNode.Name == "z")
								{
									//newGameObject.transform.position.z = float.Parse(positionNode.InnerText);
									position.z = float.Parse(positionNode.InnerText);
								}
							}
						}
						
						if(gameObjectStatsNodes.Name == "Rotation")
						{
							var gameObjectRotationNodes:XmlNodeList = gameObjectStatsNodes.ChildNodes;
							
							for each(var _rotationNodes in gameObjectRotationNodes)
							{
								var rotationNode:XmlNode = _rotationNodes as XmlNode;
								
								if(rotationNode.Name == "x")
								{
									rotation.x = float.Parse(rotationNode.InnerText);
								}
								if(rotationNode.Name == "y")
								{
									rotation.y = float.Parse(rotationNode.InnerText);
								}
								if(rotationNode.Name == "z")
								{
									rotation.z = float.Parse(rotationNode.InnerText);
								}
							}
						}
						
						if(gameObjectStatsNodes.Name == "Scaling")
						{
							var gameObjectScalingNodes:XmlNodeList = gameObjectStatsNodes.ChildNodes;
							
							for each(var _scalingNodes in gameObjectScalingNodes)
							{
								var scalingNode:XmlNode = _scalingNodes as XmlNode;
								
								if(scalingNode.Name == "x")
								{
									scaling.x = float.Parse(scalingNode.InnerText);
								}
								if(scalingNode.Name == "y")
								{
									scaling.y = float.Parse(scalingNode.InnerText);
								}
								if(scalingNode.Name == "z")
								{
									scaling.z = float.Parse(scalingNode.InnerText);
								}
							}
						}
						
						if(gameObjectStatsNodes.Name == "Tutorial")
						{
							var tutorialNode:XmlNodeList = gameObjectStatsNodes.ChildNodes;
							
							for each(var _tutorialNodeStats in tutorialNode)
							{
								var tutorialNodeStats:XmlNode = _tutorialNodeStats as XmlNode;
								
								if(tutorialNodeStats.Name == "TriggerString")
								{
									tutorialTriggerString = tutorialNodeStats.InnerText;
								}
								if(tutorialNodeStats.Name == "Timer")
								{
									tutorialTextTimer = int.Parse(tutorialNodeStats.InnerText);
								}
								if(tutorialNodeStats.Name == "ButtonsEnabled")
								{
									var buttonNodes:XmlNodeList = tutorialNodeStats.ChildNodes;
									
									for each(var _buttonNodeStats in buttonNodes)
									{
										var buttonNodeStats:XmlNode = _buttonNodeStats as XmlNode;
										
										if(buttonNodeStats.Name == "MovementLeft")
										{
											movementLeftEnabled = boolean.Parse(buttonNodeStats.InnerText);
										}
										if(buttonNodeStats.Name == "MovementRight")
										{
											movementRightEnabled = boolean.Parse(buttonNodeStats.InnerText);
										}
										if(buttonNodeStats.Name == "Jumpbutton")
										{
											jumpButtonEnabled = boolean.Parse(buttonNodeStats.InnerText);
										}
										if(buttonNodeStats.Name == "NormalShroomButton")
										{
											normalShroomButtonEnabled = boolean.Parse(buttonNodeStats.InnerText);
										}
										if(buttonNodeStats.Name == "BumpyShroomButton")
										{
											bumpyShroomButtonEnabled = boolean.Parse(buttonNodeStats.InnerText);
										}
									}
								}
								if(tutorialNodeStats.Name == "Textures")
								{
									var textureNodes:XmlNodeList = tutorialNodeStats.ChildNodes;
									
									for each(var _textureNodeStats in textureNodes)
									{
										var textureNodeStats:XmlNode = _textureNodeStats as XmlNode;
										
										if(textureNodeStats.Name == "TextureA")
										{
											var textureANode:XmlNodeList = textureNodeStats.ChildNodes;
											
											for each(var _textureANodeStats in textureANode)
											{
												var textureANodeStats:XmlNode = _textureANodeStats as XmlNode;
												
												if(textureANodeStats.Name == "Texturename")
												{
													tutorialTextureA = textureLoader.getTexture(textureANodeStats.InnerText);
												}
												if(textureANodeStats.Name == "x")
												{
													xPositionTexA = float.Parse(textureANodeStats.InnerText);
												}
												if(textureANodeStats.Name == "y")
												{
													yPositionTexA = float.Parse(textureANodeStats.InnerText);
												}
												if(textureANodeStats.Name == "Timer")
												{
													timerTexA = float.Parse(textureANodeStats.InnerText);
												}
											}
										}
										if(textureNodeStats.Name == "TextureB")
										{
											var textureBNode:XmlNodeList = textureNodeStats.ChildNodes;
											
											for each(var _textureBNodeStats in textureBNode)
											{
												var textureBNodeStats:XmlNode = _textureBNodeStats as XmlNode;
												
												if(textureBNodeStats.Name == "Texturename")
												{
													tutorialTextureB = textureLoader.getTexture(textureBNodeStats.InnerText);
												}
												if(textureBNodeStats.Name == "x")
												{
													xPositionTexB = float.Parse(textureBNodeStats.InnerText);
												}
												if(textureBNodeStats.Name == "y")
												{
													xPositionTexB = float.Parse(textureBNodeStats.InnerText);
												}
												if(textureBNodeStats.Name == "Timer")
												{
													timerTexB = float.Parse(textureBNodeStats.InnerText);
												}
											}
										}
									}
								}
								if(tutorialNodeStats.Name == "DestroyOnExit")
								{
									destroyOnExit = boolean.Parse(tutorialNodeStats.InnerText);
								}
								if(tutorialNodeStats.Name == "BoundingBox")
								{
									var boundingBoxStatsNode:XmlNodeList = tutorialNodeStats.ChildNodes;
									
									for each(_boundingBoxStats in boundingBoxStatsNode)
									{
										var boundingBoxStats:XmlNode = _boundingBoxStats as XmlNode;
										
										if(boundingBoxStats.Name == "x")
										{
											boundingBox.x = float.Parse(boundingBoxStats.InnerText);
										}
										if(boundingBoxStats.Name == "y")
										{
											boundingBox.y = float.Parse(boundingBoxStats.InnerText);
										}
										if(boundingBoxStats.Name == "z")
										{
											boundingBox.z = float.Parse(boundingBoxStats.InnerText);
										}
									}
								}
							}
						}
					}
					
					//instantiate the things
					if(prefabName != "" && position != Vector3(9999,9999,9999) && rotation != Vector3(9999,9999,9999) && scaling != Vector3(9999,9999,9999))
					{
						if(Resources.Load(("Prefabs/" + prefabName)) != null)
						{
							newGameObject 						= Instantiate(Resources.Load(("Prefabs/" + prefabName))) as GameObject;
							newGameObject.name 					= prefabName;
							newGameObject.transform.parent 		= level.transform;
							newGameObject.transform.position 	= position;
							newGameObject.transform.eulerAngles = rotation;
							newGameObject.transform.localScale 	= scaling;
							
							if(newGameObject.name == "TutorialObject" && boundingBox != Vector3(9999,9999,9999))
							{
								var triggerScript:TutorialTriggerScript = newGameObject.GetComponent(TutorialTriggerScript);
								//set string
								triggerScript.setTutorialText(tutorialTriggerString);
								//set timer
								triggerScript.setTextInSeconds(tutorialTextTimer);
								//set button booleans
								triggerScript.setMovementLeftEnabled(movementLeftEnabled);
								triggerScript.setMovementRightEnabled(movementRightEnabled);
								triggerScript.setJumpButtonEnabled(jumpButtonEnabled);
								triggerScript.setNormalShroomButtonEnabled(normalShroomButtonEnabled);
								triggerScript.setBumpyShroomButtonEnabled(bumpyShroomButtonEnabled);
								
								if(tutorialTextureA != null)
								{									
									triggerScript.setTutorialTextureA(tutorialTextureA);
									triggerScript.setXPositionTexA(xPositionTexA);
									triggerScript.setYPositionTexA(yPositionTexA);
									triggerScript.setTimerTexA(timerTexA);
								}
								
								if(tutorialTextureB != null)
								{
									triggerScript.setTutorialTextureB(tutorialTextureB);
									triggerScript.setXPositionTexB(xPositionTexB);
									triggerScript.setYPositionTexB(yPositionTexB);
									triggerScript.setTimerTexB(timerTexB);
								}
								
								//set destroy on exit
								triggerScript.setDestroyOnExit(destroyOnExit);
								
								//set bounding box
								newGameObject.GetComponent(BoxCollider).size = boundingBox;
							}
							//Debug.Log("created: " + prefabName + " at: " + position);
						}
						else
						{
							Debug.LogError("something went wrong creating the new object, prefab might not exist: " + prefabName);
						}
					}
					else
					{
						Debug.LogError("Something went wrong creating this: " + prefabName + " " + position + " " + rotation + " " + scaling);
					}
				}
			}
			
			if(nodes.Name == "Player")
			{
				var playerStatsNodesList:XmlNodeList = nodes.ChildNodes;
				
				for each(var _playerStats in playerStatsNodesList)
				{
					var playerStats = _playerStats as XmlNode;
					
					if(playerStats.Name == "Position")
					{
						var playerPositionNodeList:XmlNodeList = playerStats.ChildNodes;
						
						for each(var _playerPosition in playerPositionNodeList)
						{
							var playerPosition:XmlNode = _playerPosition as XmlNode;
							
							if(playerPosition.Name == "x")
							{
								player.transform.position.x = float.Parse(playerPosition.InnerText);
							}
							
							if(playerPosition.Name == "y")
							{
								player.transform.position.y = float.Parse(playerPosition.InnerText);
							}
							
							if(playerPosition.Name == "z")
							{
								player.transform.position.z = float.Parse(playerPosition.InnerText);
							}
						}
					}
					
					if(playerStats.Name == "Rotation")
					{
						var playerRotationNodeList:XmlNodeList = playerStats.ChildNodes;
						
						for each(var _playerRotation in playerRotationNodeList)
						{
							var playerRotation:XmlNode = _playerRotation as XmlNode;
							
							if(playerRotation.Name == "x")
							{
								player.transform.eulerAngles.x = float.Parse(playerRotation.InnerText);
							}
							
							if(playerRotation.Name == "y")
							{
								player.transform.eulerAngles.y = float.Parse(playerRotation.InnerText);
							}
							
							if(playerRotation.Name == "z")
							{
								player.transform.eulerAngles.z = float.Parse(playerRotation.InnerText);
							}
						}
					}
				}
			}
		}
	}
	else
	{
		Debug.LogError("This level doesn't even exist!");
		Debug.Log("Loading back to menu again as this is a non existant level");
		Application.LoadLevel("Menu");
	}
	
	Debug.Log("Finished Loading");
	Destroy(this.gameObject);
}