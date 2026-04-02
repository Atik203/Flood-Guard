import os
import json
import requests
import logging
import paho.mqtt.client as mqtt
from datetime import datetime, timezone
from database import SessionLocal
from models import SensorReadingDB, AlertDB
from ml_service import MLService

logger = logging.getLogger(__name__)

MQTT_BROKER = "test.mosquitto.org"
MQTT_PORT = 1883
TOPIC_SENSORS = "floodguard/sensors/data"
TOPIC_GATE_COMMAND = "floodguard/actuators/gate"
TOPIC_BUZZER_COMMAND = "floodguard/system/buzzer"

class MQTTService:
    def __init__(self, ml_service: MLService):
        self.ml_service = ml_service
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.last_water_cm = None
    
    def start(self):
        try:
            self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
            self.client.loop_start()
            logger.info("MQTT Client started and connected to broker.")
        except Exception as e:
            logger.error(f"Failed to connect to MQTT Broker: {e}")
            
    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info(f"Connected to MQTT Broker: {MQTT_BROKER}")
            client.subscribe(TOPIC_SENSORS)
        else:
            logger.error(f"Failed to connect, return code {rc}")

    def on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode('utf-8'))
            self.process_sensor_data(payload)
        except json.JSONDecodeError:
            logger.error(f"Failed to decode MQTT message: {msg.payload}")
        except Exception as e:
            logger.error(f"Error processing MQTT message: {e}")

    def process_sensor_data(self, data):
        water_cm = data.get('water_cm', 0.0)
        rain_intensity = data.get('rain_intensity', 0.0)
        flow_lpm = data.get('flow_lpm', 0.0)
        temperature = data.get('temperature', 0.0)
        humidity = data.get('humidity', 0.0)

        # Calculate rate of change
        rate_of_change = 0.0
        if self.last_water_cm is not None:
            rate_of_change = water_cm - self.last_water_cm
        self.last_water_cm = water_cm
        
        # ML Prediction
        risk_level = self.ml_service.predict_risk(water_cm, rain_intensity, flow_lpm, rate_of_change)

        # Active Logic
        gate_open = False
        target_angle = 0
        gate_action_str = None
        
        if risk_level in ['HIGH', 'CRITICAL']:
            gate_open = True
            
            # Blockage logic
            if water_cm > 50 and flow_lpm < 1.0:
                # Need flush
                gate_action_str = "Auto-flush sequence initiated (Blockage Detected)"
                self.set_gate(180) # Mock sweep
                target_angle = 180
            else:
                gate_action_str = "Gate OPENED automatically"
                self.set_gate(90)
                target_angle = 90
        elif risk_level == 'MEDIUM':
            gate_open = True
            self.set_gate(45)
            target_angle = 45
        else:
            self.set_gate(0)

        db = SessionLocal()
        try:
            # Save reading
            reading = SensorReadingDB(
                water_cm=water_cm,
                rain_adc=data.get('rain_adc', 0),
                rain_intensity=rain_intensity,
                flow_lpm=flow_lpm,
                temperature=temperature,
                humidity=humidity,
                rate_of_change=rate_of_change,
                risk_level=risk_level,
                gate_open=gate_open
            )
            db.add(reading)
            
            # Generate alert if HIGH/CRITICAL or block detected
            if risk_level in ['HIGH', 'CRITICAL'] and gate_action_str:
                alert = AlertDB(
                    risk_level=risk_level,
                    water_cm=water_cm,
                    rain_intensity=rain_intensity,
                    flow_lpm=flow_lpm,
                    action=gate_action_str,
                    telegram_sent=True,
                    message=f"🚨 FLOOD {risk_level}: Water at {water_cm}cm. Action: {gate_action_str}"
                )
                db.add(alert)
                self.send_telegram(alert.message)

            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"DB Error: {e}")
        finally:
            db.close()

    def set_gate(self, angle: int):
        self.client.publish(TOPIC_GATE_COMMAND, json.dumps({"angle": angle}))

    def trigger_buzzer(self, state: bool):
        self.client.publish(TOPIC_BUZZER_COMMAND, json.dumps({"state": state}))
        
    def send_telegram(self, message: str):
        bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        chat_id = os.getenv("TELEGRAM_CHAT_ID")
        
        if not bot_token or not chat_id:
            logger.warning(f"Telegram not configured in .env! Local log only: {message}")
            return
            
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message
        }
        
        try:
            response = requests.post(url, json=payload, timeout=5)
            if response.status_code == 200:
                logger.info(f"✅ REAL TELEGRAM SENT: {message}")
            else:
                logger.error(f"❌ Failed to send Telegram: {response.text}")
        except Exception as e:
            logger.error(f"❌ Telegram Request Exception: {e}")
