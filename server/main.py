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
from simulator_service import SimulatorService
import threading
import os
from fastapi.middleware.cors import CORSMiddleware

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FloodGuard Backend API")

# Setup CORS for the dashboard
frontend_url = os.getenv("FRONTEND_URL", "*")
origins = [frontend_url] if frontend_url != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_service = MLService()
ml_service.load_model()

mqtt_service = MQTTService(ml_service=ml_service)
simulator = SimulatorService()

@app.on_event("startup")
def startup_event():
    mqtt_service.start()
    if os.getenv("SIMULATE_MODE", "false").lower() == "true":
        simulator.start()

@app.on_event("shutdown")
def shutdown_event():
    mqtt_service.stop()
    simulator.stop()

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

class SettingsUpdate(BaseModel):
    telegram_alerts: Optional[bool] = None
    high_alert: Optional[bool] = None
    medium_alert: Optional[bool] = None
    auto_cleanup: Optional[bool] = None
    threshold_medium: Optional[int] = None
    threshold_high: Optional[int] = None
    threshold_crit: Optional[int] = None

@app.get("/api/system/settings")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(models.SettingsDB).first()
    if not settings:
        settings = models.SettingsDB()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@app.put("/api/system/settings")
def update_settings(update: SettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(models.SettingsDB).first()
    if not settings:
        settings = models.SettingsDB()
        db.add(settings)
    
    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    return settings

@app.get("/api/system/database")
def get_db_status(db: Session = Depends(get_db)):
    return {
        "provider": "Supabase PostgreSQL",
        "tier": "Free (500MB Limit)",
        "sensor_rows": db.query(models.SensorReadingDB).count(),
        "alert_rows": db.query(models.AlertDB).count(),
        "tables": ["sensor_readings", "alerts", "settings", "system_status"]
    }

@app.post("/api/system/database/cleanup")
def cleanup_database(db: Session = Depends(get_db)):
    # Keep newest 500 sensors
    sensor_keep = db.query(models.SensorReadingDB).order_by(models.SensorReadingDB.id.desc()).offset(499).first()
    if sensor_keep:
        db.query(models.SensorReadingDB).filter(models.SensorReadingDB.id < sensor_keep.id).delete()
        
    # Keep newest 100 alerts
    alert_keep = db.query(models.AlertDB).order_by(models.AlertDB.id.desc()).offset(99).first()
    if alert_keep:
        db.query(models.AlertDB).filter(models.AlertDB.id < alert_keep.id).delete()
        
    db.commit()
    return {"message": "Database cleaned successfully", "kept": 500}
