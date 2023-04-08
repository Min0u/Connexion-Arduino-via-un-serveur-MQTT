/* Bibliothèques */
#include <SimpleTimer.h>// Bibliothèque utilisée pour exécuter une fonction à intervalle de temps régulier ( lien pour télécharger la bibliothèque : https://github.com/jfturcot/SimpleTimer )
#include <ArduinoJson.h>// Bibliothèque nécessaire pour lire les données au format Json.
#include <CCS811.h> //

CCS811 sensor; // variable capteur CO2

const byte LEDRouge = 3;// déclaration des bornes digitales
const byte LEDVerte = 4;
const byte LEDBleue = 5;

byte valLedR = 0;// valeurs des intensités des led
byte valLedV = 0;
byte valLedB = 0;

String inputString = "";  // variable de type chaine de caratères qui contiendra les caractères de commande reçue sur le port serie

SimpleTimer timer;// objet timer permet d'exécuter une fonction à intervalle de temps régulier > on l'utilisera pour la fonction EnvoiDonnees
int periode = 5000; // periode des mesures en ms

// constantes et variables pour la LDR
//const int LDR = A0; // ldr sur A0
//int val_A0 = 0; // valeur éclairement (0 à 1023) valeur binaire affichée en décimal
//float R_LDR = 0; // valeur résistance LDR en ohms
//int R = 10000; // valeur de la résistance en série avec la LDR  en ohms
float CO2 = 0; // valeur CO2
float TVOC = 0; // valeur TVOC (organic compounds)

// Etalonnage LDR
// Caractéristique de la LDR : log(R_LDR) = A*Log(E_Lux)+B  avec A = -0.862 et B = 5.12
//const float A = -0.862;
//const float B = 5.12;     

// Initialisation
void setup() {

  // initialise la communication avec le port série à la vitesse de 9600 bits par seconde
  Serial.begin(9600);
  pinMode(LEDRouge, OUTPUT);// définit les bornes digitales en sorties.
  pinMode(LEDVerte, OUTPUT);
  pinMode(LEDBleue, OUTPUT);
  digitalWrite(LEDRouge, LOW);// met les sorties à 0
  digitalWrite(LEDVerte, LOW);
  digitalWrite(LEDBleue, LOW);


 /*Wait for the chip to be initialized completely, and then exit*/
    while(sensor.begin() != 0){
        Serial.println("failed to init chip, please check if the chip connection is fine");
        delay(1000);
    }
    /**
     * @brief Set measurement cycle
     * @param cycle:in typedef enum{
     *                  eClosed,      //Idle (Measurements are disabled in this mode)
     *                  eCycle_1s,    //Constant power mode, IAQ measurement every second
     *                  eCycle_10s,   //Pulse heating mode IAQ measurement every 10 seconds
     *                  eCycle_60s,   //Low power pulse heating mode IAQ measurement every 60 seconds
     *                  eCycle_250ms  //Constant power mode, sensor measurement every 250ms
     *                  }eCycle_t;
     */
    sensor.setMeasCycle(sensor.eCycle_250ms);
    
  timer.setInterval(periode, EnvoiDonnees); // définit un timer qui va exécuter la fonction EnvoiDonnees toutes les periodes

}

// Boucle d'exécution
void loop() {
  timer.run();// exécute en permanence le timer  > lecture des données toutes les périodes
 
}
