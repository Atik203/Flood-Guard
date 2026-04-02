import time
import json
import random
import threading
import logging
import paho.mqtt.client as mqtt
import os

logger = logging.getLogger(__name__)

class SimulatorService:
    def __init__(self):
        self.broker = "test.mosquitto.org"
        self.port = 1883
        self.topic = "floodguard/sensors/data"
        self.client = mqtt.Client()
        self.running = False
        self.thread = None

    def start(self):
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._run, daemon=True)
            self.thread.start()
            logger.info("Simulator Service Started Background Thread")

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join()

    def _run(self):
        try:
            self.client.connect(self.broker, self.port, 60)
            water_cm = 15.0
            
            while self.running:
                # Simulation logic
                rain_intensity = random.uniform(0, 100)
                if rain_intensity > 70:
                    water_cm += random.uniform(5, 15)
                else:
                    water_cm -= random.uniform(2, 8)
                
                water_cm = max(5, min(120, water_cm))
                
                payload = {
                    "water_cm": round(water_cm, 1),
                    "rain_adc": int(rain_intensity * 40.95),
                    "rain_intensity": round(rain_intensity, 1),
                    "flow_lpm": round(random.uniform(0, 10) if water_cm > 40 else random.uniform(0, 2), 1),
                    "temperature": round(random.uniform(25, 30), 1),
                    "humidity": round(random.uniform(60, 90), 1)
                }
                
                self.client.publish(self.topic, json.dumps(payload))
                time.sleep(10) # Slower heartbeat for production demo
                
        except Exception as e:
            logger.error(f"Simulator Thread Error: {e}")
            time.sleep(5)
            if self.running: self._run() # Retry
