var CO2 = 0; // valeur de l'éclairement reçu
var TVOC = 0
var temps=0;
var data,layout; // variables globales pour le tracé du graphe plotly.js
var tempsDepart = 0;
var depart = true;//pour trouver le premier point du tracé
var LignePoints = true; // pour changer le type de tracé
var AffichePoints = true; // affiche les points sur la courbe

var dataJson;// les données reçues au format json

var RedSlider, GreenSlider, BlueSlider;
var gauge1;// Jauge luxmètre

var connected_flag= 0 // indicateur de connexion au serveur mqtt
var mqtt; // objet pour connexion au serveur mqtt
var reconnectTimeout = 2000;// reconnexion automatique si erreur
var host=""; // url du serveur (laisser vide ici)
var port=443;// 443 uns ou 8083 wp  port du serveur mqtt
var row=0; // ligne pour affichage des données reçues dans l'onglet paramètre
var clientId; // identification client pour le mqtt (ce n'est pas le login)
var out_msg=""; // message reçu
var mcount=0; // variable de comptage pour afficher un certain nombre de lignes des données reçues

var csvdata = [];// tableau qui contiendra les messures > pour faire un fichier .csv
var NbPointsMax = 500; // nombre de point maximum dans le fichier de données csv

var topicPub1 = "FABLAB_21_22/Sofia/ledLDR/in/";
var topicSub1 = "FABLAB_21_22/Sofia/ledLDR/out/";

// tracé du graphe plotly.js
data = [{ // les données
  x: [], 
  y: [],
  mode: 'lines+markers',
  marker: {
    color: 'red',
    size: 6,
    //line: {
    //  color: 'rgb(231, 99, 250)',
    //  width: 2
    //},
  },
  line: {color: '#80CAF6'}

}] 

layout = {// disposition présentation
	title: 'Acquisition CO2',
  xaxis: {
	title: 'temps (s)',
    autorange: true
  }, 
  yaxis: {
    //type: 'log',
	title: 'CO2 (ppm)',
    autorange: true
  }
};


$(document).ready(function() {// attend que la page soit chargée avant de lancer le script javascript

			
			
			// cadran pour afficher l'éclairement : bibliothèque et documentation disponibles sur le site https://canvas-gauges.com/ 
						gauge1 = new RadialGauge({
						renderTo: 'LUXMETRE',
						width: 550, //dimensions peuvent être ajustées dans le css (fichier style1.css)
						height: 550,
						units: "ppm",
						title: "CO2",
						minValue: 0,
						maxValue: 2000,
						value: 0,
						majorTicks: [
							0,
							250,
							500,
							750,
							1000,
							1250,
							1500,
							1750,
							2000,
						],
						minorTicks: 2,
						strokeTicks: true,
						highlights: [
							{
								"from": 0,
								"to": 750,
								"color": "rgba(0,95, 123, 1)"
							},
							{
								"from": 750,
								"to": 1500,
								"color": "rgba(0,194, 255, .94)"
							},
							{
								"from": 1500,
								"to": 2000,
								"color": "rgba(255, 0, 0, 1)"
							}
						],
						ticksAngle: 225,
						startAngle: 67.5,
						colorMajorTicks: "#fff",
						colorMinorTicks: "#fff",
						colorTitle: "#fff",
						colorUnits: "#fff",
						colorNumbers: "#fff",
						colorPlate: "#908686",
						borderShadowWidth: 0,
						borders: true,
						needleType: "arrow",
						needleWidth: 4,
						needleCircleSize: 7,
						needleCircleOuter: true,
						needleCircleInner: true,
						animationDuration: 1000,
						animationRule: "linear",
						colorBorderOuter: "#333",
						colorBorderOuterEnd: "#111",
						colorBorderMiddle: "#222",
						colorBorderMiddleEnd: "#111",
						colorBorderInner: "#111",
						colorBorderInnerEnd: "#333",
						colorNeedleShadowDown: "#333",
						colorNeedleCircleOuter: "#F00",
						colorNeedleCircleOuterEnd: "#F00",
						colorNeedleCircleInner: "#F00",
						colorNeedleCircleInnerEnd: "#F00",
						colorNeedle: "rgba(255, 0, 0, 1)",
						colorNeedleEnd: "rgba(255, 50, 50, .75)",
						valueBox: true,
						valueBoxBorderRadius: 4,
						colorValueBoxRect: "#fff",
						colorValueBoxRectEnd: "#eee",
						valueDec: 0,// nombre de décimales
						animatedValue: true // animation des valeurs dans la boite
					}).draw();
					



Plotly.newPlot('graph', data, layout,{responsive: true,displaylogo: false});// important de définir le graphe

// Pour Bootstrap : quand le menu 1 est affiché on dessine la courbe 
	$('#monTab li:eq(1) a').on('shown.bs.tab', function(){ // quand le menu 1 est affiché on dessine le graphe pour l'ajuster correctement 
				Plotly.newPlot('graph', data, layout,{responsive: true,displaylogo: false});
				//console.log("OK menu 1");
	});
});// fin doc ready					


//autre fonctions
// initialisation de la jauge du luxmètre
function initGauge1(){
	CO2 = 0;
	$('#ECL1').html(CO2);
	gauge1.value = 0;
	gauge1.update();
	//console.log("init gauge1 ok !");
}

