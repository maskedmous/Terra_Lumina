#pragma strict

private var buttonDownShooting:boolean = false;
private var buttonDownJumping:boolean = false;
private var isShooting:boolean = false;
private var isJumping:boolean = false;

public function OnGUI()
{
	if(GUI.RepeatButton(new Rect(Screen.width*1/16, Screen.height* 7/ 8, 80, 50), "Left"))
	{
		//function call movement left
		GameObject.Find("Player").GetComponent(PlayerController).moveLeft();
	}
	if(GUI.RepeatButton(new Rect(Screen.width*3/16, Screen.height*7/8, 80, 50), "Right"))
	{
		//function call movement right
		GameObject.Find("Player").GetComponent(PlayerController).moveRight();
	}
	
	if(GUI.RepeatButton(new Rect(Screen.width*5/16, Screen.height*6/8, 80, 50), "Jump"))
	{
		buttonDownJumping = true;
		isJumping = true;
	}
	else
	{
		//button might still be held in
		if(!Input.GetMouseButton(0))
		{
			buttonDownJumping = false;
		}
	}
	
	
	//OnButtonUp event with shooting
	//use Update()
	if(GUI.RepeatButton(new Rect(Screen.width*5/16, Screen.height*7/8, 80, 50), "Shoot"))
	{
		buttonDownShooting = true;
		isShooting = true;
	}
	else
	{
		//button might still be held in
		if(!Input.GetMouseButton(0))
		{
			buttonDownShooting = false;
		}
	}
	if (GUI.Button(new Rect(Screen.width * 7 / 16, Screen.height * 7 / 8, 80, 50), "Place")) {
		//places item in inventory
		GameObject.Find("Player").GetComponent(PlayerController).Place();
	}
	
	if(GUI.Button(new Rect(Screen.width * 9 / 16, Screen.height * 7 / 8, 90, 50), "Reset Rover"))
	{
		GameObject.Find("Player").transform.rotation.eulerAngles.z = 0;
	}
}


/*
	OnGUI is called twice per frame
	Repeat buttons with the events OnButtonUp have to be called in the Update()
	This is the only fix at the moment.
*/

public function Update()
{
	//on down event
	if(buttonDownShooting)
	{
		GameObject.Find("Player").GetComponent(PlayerController).shootSeed();
	}
	//on up event
	if(buttonDownShooting == false && isShooting == true)
	{
		GameObject.Find("Player").GetComponent(PlayerController).shoot();
		isShooting = false;
	}
	
	//on down event
	if(buttonDownJumping)
	{
		GameObject.Find("Player").GetComponent(PlayerController).jumpButtonDown();
	}
	//on up event
	if(buttonDownJumping == false && isJumping == true)
	{
		GameObject.Find("Player").GetComponent(PlayerController).jumpButtonUp();
		isJumping = false;
	}
}