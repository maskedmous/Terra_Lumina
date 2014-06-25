#pragma strict

///////////////////////////////////////////////////
//
//
//Written by: Kevin Mettes
//Usage:
//Create a scene, a GameObject, attach the script
//fill in the desired filePath
//fill in the desired fileType what it should search for
//fill in the next scene it should load
//add a loading screen texture
//
//
///////////////////////////////////////////////////
import System.IO;	//needed for searching files

public class TextureLoader extends MonoBehaviour
{
	//settings
	public var filePath:String 			= "/FolderName";	//filePath of the textures
	public var fileType:String 			= "*.png";			//* means all names possible  .png means files with the png extention only
	public var nextScene:String			= "someScene";		//next scene
	public var loadingScreen:Texture2D 	= null;				//texture2D loadingscreen
	public var loadedLabelWidth:int		= 100;				//width and height for the % loaded
	public var loadedLabelHeight:int	= 100;
	public var fontSize:int				= 18;				//font size for the loading %
	
	//private variables not to be touched
	private var fileCount:int			= 0;				//the amount of files that are to be loaded
	private var loadedFiles:int			= 0;				//the amount that is loaded at this point
	private var textureArray:Array 		= new Array();		//array where we put all textures in
	private var guiStyle:GUIStyle		= new GUIStyle();
	private var loaded:boolean			= false;
	
	private var dotTimer:float = 1.0f;
	public var dotTexture:Texture2D = null;
	public var dotX:float = 0.0f;
	public var dotY:float = 0.0f;
	private var firstDot:boolean = true;
	private var secondDot:boolean = false;
	private var thirdDot:boolean = false;
	
	private var scale:Vector2 = new Vector2();
	private var originalWidth:float = 1920;
	private var originalHeight:float = 1080;
	//static variables not to be touched
	static var LoaderExists:boolean = false;
	
	public function Awake():void
	{
		//we don't want the texture loader to be destroyed
		DontDestroyOnLoad(this.gameObject);
		
		//make sure it doesn't exist already
		if(LoaderExists == false)
		{
			guiStyle.font = Resources.Load("Fonts/sofachrome rg", Font);
			guiStyle.normal.textColor.b = 197.0 / 255.0;
			guiStyle.normal.textColor.g = 185.0 / 255.0;
			guiStyle.normal.textColor.r = 147.0 / 255.0;
			guiStyle.fontSize = fontSize;
			//the filePath of the textures you want to load(use the root folder, it searches through all subfolders)
			filePath = Application.dataPath + filePath;	//replace FolderName with the folder you store the Textures in (don't forget to copy the folder to the data folder when compiling)
			
			//check if the filePath is initialized
			if(filePath != Application.dataPath + "/FolderName" && nextScene != "someScene")	//don't change this
			{
				Debug.Log("Loading Textures...");
				fillTextureArray();
				LoaderExists = true;
			}
			else
			{
				Debug.LogError("You probably forgot to set either the foldername or nextscene");
			}
		}
		else
		{
			Destroy(this.gameObject);
		}
	}
	
	private function checkDot():void
	{
		dotTimer -= Time.deltaTime;
		
		if(dotTimer <= 0.0f)
		{
			dotTimer = 1.0f;
			
			if(firstDot)
			{
				firstDot = false;
				secondDot = true;
				return;
			}
			else if(secondDot)
			{
				secondDot = false;
				thirdDot = true;
				return;
			}
			else if(thirdDot)
			{
				thirdDot = false;
				firstDot = true;
				return;
			}
		}
	}
	
	public function OnGUI():void
	{
		if(!loaded)
		{
			scale = new Vector2(Screen.width / originalWidth, Screen.height / originalHeight);
			
			if(loadingScreen != null)
			{
				GUI.DrawTexture(new Rect(0,0, Screen.width, Screen.height), loadingScreen);
			}
			
			checkDot();
			if(firstDot)
			{
				GUI.DrawTexture(new Rect(dotX * scale.x, dotY * scale.y, dotTexture.width * scale.x, dotTexture.height * scale.y), dotTexture);
			}
			else if(secondDot)
			{
				GUI.DrawTexture(new Rect((dotX + 50) * scale.x, dotY * scale.y, dotTexture.width * scale.x, dotTexture.height * scale.y), dotTexture);
			}
			else if(thirdDot)
			{
				GUI.DrawTexture(new Rect((dotX + 100) * scale.x, dotY * scale.y, dotTexture.width * scale.x, dotTexture.height * scale.y), dotTexture);
			}
			
			if(isLoading())
			{
				GUI.Label(Rect(Screen.width / 2, Screen.height / 2 + (Screen.height * 5 / 16), loadedLabelWidth, loadedLabelHeight), percentLoaded(), guiStyle);
			}	
		}
	}
	
	//Fills the arrays with the textures
	private function fillTextureArray():IEnumerator
	{
		//getting all files at the desired filePath with the desired fileType and searching through all directories
		var fileInfo = Directory.GetFiles(filePath, fileType, SearchOption.AllDirectories);
		
		fileCount = fileInfo.Length;
		
		for(file in fileInfo)
		{	
			//download the file via WWW
			var wwwTexture = new WWW("file://"+file);
			//wait for it to download
			yield wwwTexture;
			var texture:Texture2D = wwwTexture.texture;
			//assign the name to the texture
			var pngName:String = Path.GetFileNameWithoutExtension(file);
			
			texture.name = pngName;
			//put the texture into the array
			textureArray.push(texture);
			loadedFiles++;
		}
		loaded = true;
		Debug.Log("Done loading textures");
		//its done loading so load the next scene
		Application.LoadLevel(nextScene);
	}
	
	//returns boolean if it is still loading files
	public function isLoading():boolean
	{
		if(countedFiles() == currentLoaded())
		{
			return false;
		}
		
		return true;
	}
	
	public function percentLoaded():String
	{
		var part:float = currentLoaded();
		var total:float = countedFiles();
		var percentage:float = (part / total) * 100.0f;
		percentage = Mathf.Round(percentage * 100.0f) / 100.0f;
		return percentage.ToString();
	}

	//returns the amount of files that are to be loaded
	public function countedFiles():int
	{
		return fileCount;
	}
	//returns the amount of files that are loaded currently
	public function currentLoaded():int
	{
		return loadedFiles;
	}
	
	public function loadTextureInArray(aFilePath:String, textureName:String):IEnumerator
	{
		//searching for the specific texture
		var fileInfo = Directory.GetFiles(aFilePath, textureName + fileType, SearchOption.AllDirectories);
		//if the texture is found then the length would be 1 if not found it would be 0
		//so if it is not 0 continue
		if(fileInfo.Length != 0)
		{
			for(file in fileInfo)
			{
				//if the texture exists already in the array then you have doubles, conflicting
				if(textureExistsAlready(textureName) == false)
				{
					//download the texture
					var wwwTexture = new WWW("file://"+file);
					//add it to the array
					var texture:Texture2D = wwwTexture.texture;
					texture.name = textureName;
					textureArray.push(texture);
				}
				else
				{
					//you tried to add a texture that was already added previously
					Debug.LogError("You tried to add a texture but the texture was already in there. Texture: " + textureName);
				}
			}
		}
		else
		{
			Debug.LogError("You tried to use loadTexture but the texture was not found. Texture: " + textureName);
		}
	}
	
	//getter for textures
	public function getTexture(textureName:String):Texture2D
	{		
		//go through the textureNameArray with the given textureName
		for(var i:int = 0; i<textureArray.length; ++i)
		{
			var checkTexture:Texture2D = textureArray[i] as Texture2D;
			//if the names match
			if(checkTexture.name == textureName)
			{
				//texture was found so return it
				return checkTexture;
			}
		}
		//texture hasn't been return yet which means it is not found
		Debug.LogError("Texture not found using getTexture: " + textureName);
		return null;
	}
	
	//checks if the texture is already in the textureArray
	private function textureExistsAlready(textureName:String):boolean
	{
		for(var i:int = 0; i<textureArray.length; ++i)
		{
			//get the name from the textureNameArray and compare it with the incoming textureName
			var texture:Texture2D = textureArray[i] as Texture2D;
			//if this is true then it is already in the array
			if(texture.name == textureName)
			{
				//the texture is already in the array return true
				return true;
			}
		}
		//the texture does not exist in the array yet, return false
		return false;
	}
}