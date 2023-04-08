// données envoyées au format JSON (pour MQTT) sur le port série

void EnvoiDonnees() {// fonction qui envoie les valeurs de l'éclairement et du temps  {"E_Lux":E_Lux,"temps":leTemps})
  
  // mesure du temps en secondes
  unsigned long CurrentTime = millis(); //(long > 32 bits, int > 16 bits, byte > 8bits ,float > 32 bits)
  float leTemps = CurrentTime/1000;


  if(sensor.checkDataReady() == true){
    CO2 = sensor.getCO2PPM();
    TVOC = sensor.getTVOCPPB();

  }
  
  // envoi des données au format JSON
  String chaine = "{\"ppmCO2\":";   // il faut toujours initialiser la chaine avant de concaténer à la ligne suivante
  Serial.println(chaine + CO2 + ",\"TVOC\":"+TVOC + ",\"temps\":"+leTemps+"}");
  
}
