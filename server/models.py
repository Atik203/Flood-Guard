from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime, timezone
from database import Base

class SensorReadingDB(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    water_cm = Column(Float)
    rain_adc = Column(Integer)
    rain_intensity = Column(Float)
    flow_lpm = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    rate_of_change = Column(Float)
    risk_level = Column(String, index=True)
    gate_open = Column(Boolean)

class AlertDB(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    risk_level = Column(String, index=True)
    water_cm = Column(Float)
    rain_intensity = Column(Float)
    flow_lpm = Column(Float)
    action = Column(String)
    telegram_sent = Column(Boolean, default=False)
    message = Column(String)

class SystemStatusDB(Base):
    __tablename__ = "system_status"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    esp32_connected = Column(Boolean, default=True)
    pi_connected = Column(Boolean, default=True)
    mqtt_broker = Column(Boolean, default=True)
    uptime_hours = Column(Float, default=0.0)
    gate_open = Column(Boolean, default=False)
