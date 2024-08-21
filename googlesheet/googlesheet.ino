#include <WiFiNINA.h>

// ----------------------------------------------------------------------------------------------
// Your WiFi credentials.
// Set password to "" for open networks.
char ssid[] = "xzeed";
char pass[] = "xzeed1128";
String GAS_ID = "AKfycbwbFRBy52lX1GLJosUPAsgc0r_yS3Vl5DHAJTvYS8AtczlVJOGoS8_4JGBwpdMtbFTK"; //--> spreadsheet script ID
int score=10;

//Your Domain name with URL path or IP address with path
const char* host = "script.google.com"; // only google.com not https://google.com

// ----------------------------------------------------------------------------------------------
#define UPDATE_INTERVAL_HOUR  (0)
#define UPDATE_INTERVAL_MIN   (0)
#define UPDATE_INTERVAL_SEC   (10)

#define UPDATE_INTERVAL_MS    ( ((UPDATE_INTERVAL_HOUR*60*60) + (UPDATE_INTERVAL_MIN * 60) + UPDATE_INTERVAL_SEC ) * 1000 )

// ----------------------------------------------------------------------------------------------
void update_google_sheet()
{
  Serial.print("connecting to ");
  Serial.println(host);

  // Use WiFiSSLClient class to create TCP connections
  WiFiSSLClient client;
  const int httpPort = 443; // 80 is for HTTP / 443 is for HTTPS!

  if (!client.connect(host, httpPort)) { //works!
    Serial.println("connection failed");
    return;
  }

  //----------------------------------------Processing data and sending data
  String url = "/macros/s/" + GAS_ID + "/exec?user=";

  url += String(21808);

  url += "&gender=";
  url += "MR";

  url += "&fname=";
  url += "Wachirawit";

  url += "&lname=";
  url += "Tanleng";
  
  url += "&score=";
  url += String(score);

  Serial.print("Requesting URL: ");
  Serial.println(url);

  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n");

  Serial.println();
  Serial.println("closing connection");
}

// ----------------------------------------------------------------------------------------------
void setup()
{
  // Debug console
  Serial.begin(9600);

  // Digital output pin
  pinMode(LED_BUILTIN, OUTPUT);

  //----------------------------------------Wait for connection
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    WiFi.begin(ssid, pass); //--> Connect to your WiFi router
    Serial.print(".");
    delay(500);
  }
  Serial.println("Connected to WiFi");

}

// ----------------------------------------------------------------------------------------------
unsigned long time_ms;
unsigned long time_1000_ms_buf;
unsigned long time_sheet_update_buf;
unsigned long time_dif;

void loop()
{
  time_ms = millis();
  time_dif = time_ms - time_1000_ms_buf;

  // Read and print serial data every 1 sec
  if ( time_dif >= 1000 ) // 1sec
  {
    time_1000_ms_buf = time_ms;

    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
  }

  // Update data to google sheet in specific period
  time_ms = millis();
  time_dif = time_ms - time_sheet_update_buf;
  if ( time_dif >= UPDATE_INTERVAL_MS ) // Specific period
  {
    time_sheet_update_buf = time_ms;
    update_google_sheet();
  }

}
