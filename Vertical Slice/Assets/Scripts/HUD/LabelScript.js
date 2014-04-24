#pragma strict

private var up:Vector3;
private var cam:Camera;

private var target:GameObject;

private var factList:List.<String> = new List.<String>();

function Awake() {
	up = new Vector3(0, 5, 0);
	cam = Camera.main;
	
	target = GameObject.Find("Player");
	
	factList.Add("Zonne-energie is helemaal gratis en het vervuilt niet.");
	factList.Add("Zonnepanelen zijn helaas nog duur, maar dit gaat veranderen in de toekomst");
	factList.Add("Zonnepanelen werken ook op bewolkte dagen");
	factList.Add("Er zijn 2 soorten zonnepanelen: zonnecellen en warmtecollectoren");
	factList.Add("Het installeren van zonnepanelen op een huis kost zo’n 7500-8500 euro");
	factList.Add("Met een volledige installatie van zonnepanelen bespaar je ongeveer 125 euro per jaar");
	factList.Add("Je hebt gemiddeld 25-40 zonnepanelen nodig om je huis te voorzien van stroom");
	factList.Add("Zonnecellen zetten zonlicht om in energie");
	factList.Add("Warmtecollectoren vangen warmte van de zon op");
	factList.Add("Zonne energie is te gebruiken tot de zon op is");
	factList.Add("De zon is al 5 miljard jaar oud en zal nog 5.5 miljard jaar branden");
	factList.Add("De omtrek van de aarde is 40.000 km. Die van de zon is 4.4 miljoen!");
}

function Start () {

}

function Update () {
	this.gameObject.transform.position = cam.WorldToViewportPoint(target.gameObject.transform.position + up);
}

function displayFact() {
	if (this.guiText.text == "") {
		var random:int = Random.value * factList.Count;
		this.guiText.text = factList[random];	
	}
}

function stopDisplay() {
	this.guiText.text = "";
}