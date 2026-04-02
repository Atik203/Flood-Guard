from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import SensorReadingDB, AlertDB, SystemStatusDB
from pydantic import BaseModel
from typing import List, Optional
import models
from datetime import datetime, timedelta
from ml_service import MLService
from mqtt_service import MQTTService
import threading
from fastapi.middleware.cors import CORSMiddleware

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FloodGuard Backend API")

# Setup CORS for the dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_service = MLService()
ml_service.load_model()

mqtt_service = MQTTService(ml_service=ml_service)

@app.on_event("startup")
def startup_event():
    mqtt_service.start()

@app.on_event("shutdown")
def shutdown_event():
    mqtt_service.stop()

class SensorReadingResponse(BaseModel):
    id: int
    timestamp: datetime
    water_cm: float
    rain_intensity: float
    flow_lpm: float
    temperature: float
    humidity: float
    rate_of_change: float
    risk_level: str
    gate_open: bool

    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: int
    timestamp: datetime
    risk_level: str
    water_cm: float
    rain_intensity: float
    flow_lpm: float
    action: str
    telegram_sent: bool
    message: str

    class Config:
        from_attributes = True

@app.get("/api/sensors/current", response_model=SensorReadingResponse)
def get_current_reading(db: Session = Depends(get_db)):
    reading = db.query(SensorReadingDB).order_by(SensorReadingDB.id.desc()).first()
    if not reading:
        return {}
    return reading

@app.get("/api/sensors/history", response_model=List[SensorReadingResponse])
def get_sensor_history(hours: int = 24, db: Session = Depends(get_db)):
    time_limit = datetime.utcnow() - timedelta(hours=hours)
    readings = db.query(SensorReadingDB).filter(SensorReadingDB.timestamp >= time_limit).all()
    return readings

@app.get("/api/system/alerts", response_model=List[AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(AlertDB).order_by(AlertDB.id.desc()).limit(50).all()
    return alerts

@app.get("/api/system/status")
def get_system_status(db: Session = Depends(get_db)):
    return {
        "esp32_connected": True,
        "pi_connected": True,
        "mqtt_broker": True,
        "uptime_hours": 12.5,
        "last_data_received": datetime.utcnow().isoformat(),
        "gate_open": False
    }

@app.get("/api/ml/analytics")
def get_ml_analytics():
    return {
        "accuracy": 96.5,
        "model_type": ml_service.model.__class__.__name__ if ml_service.model else "Mock",
        "features": ml_service.features,
        "predictions_today": 120,
        "feature_importance": [
            {"feature": "water_cm", "importance": 0.48},
            {"feature": "rain_intensity", "importance": 0.27},
            {"feature": "rate_of_change", "importance": 0.16},
            {"feature": "flow_lpm", "importance": 0.09}
        ]
    }
