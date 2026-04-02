import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import joblib
import os

def create_mock_model():
    """
    Creates a synthetic Decision Tree model for Flood Risks
    so the system can work immediately without real historical data.
    """
    print("Generating synthetic data for model training...")
    
    # Generate 2000 random samples
    np.random.seed(42)
    n_samples = 2000
    
    water_cm = np.random.uniform(0, 100, n_samples)
    rain_intensity = np.random.uniform(0, 100, n_samples)
    flow_lpm = np.random.uniform(0, 15, n_samples)
    rate_of_change = np.random.uniform(-5, 5, n_samples)
    
    # Simple rule-based labeling for our mock
    # Features: [water_cm, rain_intensity, flow_lpm, rate_of_change]
    y = []
    for i in range(n_samples):
        w = water_cm[i]
        r = rain_intensity[i]
        
        if w < 20 and r < 30:
            y.append('LOW')
        elif w < 50 and r < 60:
            y.append('MEDIUM')
        elif w < 80:
            y.append('HIGH')
        else:
            y.append('CRITICAL')
            
    X = pd.DataFrame({
        'water_cm': water_cm,
        'rain_intensity': rain_intensity,
        'flow_lpm': flow_lpm,
        'rate_of_change': rate_of_change
    })
    
    print("Training Decision Tree Classifier...")
    # max_depth=6 as mock metadata says
    clf = DecisionTreeClassifier(max_depth=6, random_state=42)
    clf.fit(X, y)
    
    accuracy = clf.score(X, y) # Will be practically 100% since rules are deterministic, but good enough for mock
    print(f"Training complete. Accuracy on synth set: {accuracy * 100:.2f}%")
    
    # Save the model
    os.makedirs('ml_models', exist_ok=True)
    model_path = 'ml_models/decision_tree_v3.pkl'
    joblib.dump(clf, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    create_mock_model()
