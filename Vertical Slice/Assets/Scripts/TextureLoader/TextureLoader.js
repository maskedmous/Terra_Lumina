#pragma strict

///////////////////////////////////////////////////
//
//
//Written by: Kevin Mettes
//Usage:
//Create a scene, a GameObject, attach the script
//fill in the desired filePath
//fill in the desired fileType what it should search for
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
	private var textureNameArray:Array 	= new Array();		//the texture names because www.texture does not save the texture name
	private var guiStyle:GUIStyle		= new GUIStyle();
	private var loaded:boolean			= false;
	//static variables not to be touched
	static var LoaderExists:boolean = false;
	
	public function Awake():void
	{
		//we don't want the texture loader to be destroyed
		DontDestroyOnLoad(this.gameObject);
		
		//make sure it doesn't exist already
		if(LoaderExists == false)
		{
			guiStyle.fontSize = fontSize;
			guiStyle.normal.textColor = Color.white;
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
	
	public function OnGUI():void
	{
		if(!loaded)
		{
			if(loadingScreen != null)
			{
				GUI.DrawTexture(Rect(0,0,Screen.width, Screen.height), loadingScreen);
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
			var wwwPNG = new WWW("file://"+file);
			//wait for it to download
			yield wwwPNG;
			//put the texture into the array
			textureArray.push(wwwPNG.texture);
			//put the name of the texture into a separate array
			textureNameArray.push(Path.GetFileNameWithoutExtension(file));
			
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
					textureArray.push(wwwTexture.texture);
					textureNameArray.push(Path.GetFileNameWithoutExtension(file));
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
		//our variable texture initialized with a null
		var texture:Texture2D = null;
		
		//go through the textureNameArray with the given textureName
		for(var i:int = 0; i<textureNameArray.length; ++i)
		{
			//if the names match
			if(textureNameArray[i] == textureName)
			{
				//get the texture from the textureArray
				texture = textureArray[i] as Texture2D;
				//texture was found so return it
				return texture;
			}
		}
		//texture hasn't been return yet which means it is not found
		Debug.LogError("Texture not found using getTexture: " + textureName);
		return null;
	}
	
	//checks if the texture is already in the textureArray
	private function textureExistsAlready(textureName:String):boolean
	{
		for(var i:int = 0; i<textureNameArray.length; ++i)
		{
			//get the name from the textureNameArray and compare it with the incoming textureName
			var check:String = textureNameArray[i] as String;
			//if this is true then it is already in the array
			if(check == textureName)
			{
				//the texture is already in the array return true
				return true;
			}
		}
		//the texture does not exist in the array yet, return false
		return false;
	}
}