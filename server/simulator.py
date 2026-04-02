import time
import json
import random
import paho.mqtt.client as mqtt

MQTT_BROKER = "test.mosquitto.org"
MQTT_PORT = 1883
TOPIC_SENSORS = "floodguard/sensors/data"

def simulate():
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    
    water_cm = 15.0
    rain_intensity = 0.0
    
    print(f"Starting Sensor Simulator to {MQTT_BROKER}...")
    
    try:
        while True:
            # Simulate natural fluctuations and potential rain events
            rain_intensity += random.uniform(-5, 10)
            rain_intensity = max(0, min(100, rain_intensity))
            
            if rain_intensity > 40:
                water_cm += random.uniform(1, 5)
            else:
                water_cm -= random.uniform(0.5, 2)
                
            water_cm = max(5, min(100, water_cm))
            
            payload = {
                "water_cm": round(water_cm, 1),
                "rain_adc": int(rain_intensity * 40.95),
                "rain_intensity": round(rain_intensity, 1),
                "flow_lpm": round(random.uniform(0, 10) if water_cm > 40 else random.uniform(0, 2), 1),
                "temperature": round(random.uniform(25, 30), 1),
                "humidity": round(random.uniform(60, 90), 1)
            }
            
            client.publish(TOPIC_SENSORS, json.dumps(payload))
            print(f"Published: {payload}")
            time.sleep(5) # Publish every 5 seconds for simulation
            
    except KeyboardInterrupt:
        print("Simulator stopped.")
        client.disconnect()

if __name__ == "__main__":
    simulate()
