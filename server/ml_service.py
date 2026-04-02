import joblib
import pandas as pd
import os
import logging

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self, model_path='ml_models/decision_tree_v3.pkl'):
        self.model_path = model_path
        self.model = None
        self.features = ['water_cm', 'rain_intensity', 'flow_lpm', 'rate_of_change']
        
    def load_model(self):
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            logger.info(f"Loaded ML model from {self.model_path}")
            return True
        else:
            logger.error(f"Cannot find ML model at {self.model_path}")
            return False
            
    def predict_risk(self, water_cm: float, rain_intensity: float, flow_lpm: float, rate_of_change: float) -> str:
        if not self.model:
            # Fallback to simple logic if model not loaded
            logger.warning("Model not loaded. Using fallback logic.")
            if water_cm >= 80: return 'CRITICAL'
            if water_cm >= 50: return 'HIGH'
            if water_cm >= 20: return 'MEDIUM'
            return 'LOW'
            
        data = pd.DataFrame([{
            'water_cm': water_cm,
            'rain_intensity': rain_intensity,
            'flow_lpm': flow_lpm,
            'rate_of_change': rate_of_change
        }])
        
        prediction = self.model.predict(data)
        return prediction[0]
