"""
Risk Prediction Service - HEDIS AI Platform
ML-based risk scoring using XGBoost models for CCS and WCV
Integrates with MLflow for model management
"""

import os
import sys
import logging
import json
import pickle
import joblib
from typing import Dict, Any, Optional, List
from datetime import datetime

# Add shared modules to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'shared'))

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# ML and data processing
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb
import mlflow
import mlflow.xgboost

# Shared modules
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

try:
    from shared.config import config
    from shared.rabbitmq_client import MessageConsumer, MessagePublisher
except ImportError:
    # Fallback for Docker environment
    sys.path.append('/app')
    from shared.config import config
    from shared.rabbitmq_client import MessageConsumer, MessagePublisher

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Risk Prediction Service",
    description="ML-based risk scoring using XGBoost models for CCS and WCV",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RiskPredictor:
    """Main risk prediction class with XGBoost models"""
    
    def __init__(self):
        self.ccs_model = None
        self.wcv_model = None
        self.ccs_features = None
        self.wcv_features = None
        self.label_encoders = {}
        self.publisher = None
        self.consumer = None
        self.setup_mlflow()
        self.load_models()
        # Don't setup messaging on init - do it later to avoid blocking
        self.publisher = None
        self.consumer = None
    
    def setup_mlflow(self):
        """Initialize MLflow connection"""
        try:
            mlflow.set_tracking_uri(config.mlflow.tracking_uri)
            
            # Create experiment if it doesn't exist
            try:
                experiment = mlflow.get_experiment_by_name(config.mlflow.experiment_name)
                if experiment is None:
                    mlflow.create_experiment(config.mlflow.experiment_name)
                    logger.info(f"Created MLflow experiment: {config.mlflow.experiment_name}")
                else:
                    logger.info(f"Using existing MLflow experiment: {config.mlflow.experiment_name}")
            except Exception as e:
                logger.warning(f"MLflow experiment setup warning: {e}")
            
        except Exception as e:
            logger.error(f"Failed to setup MLflow: {e}")
            # Continue without MLflow for now
    
    def load_models(self):
        """Load XGBoost models from local files or MLflow"""
        try:
            # Try to load from MLflow first
            if self._load_models_from_mlflow():
                logger.info("Models loaded from MLflow successfully")
                return
            
            # Fallback to local model files
            if self._load_models_from_local():
                logger.info("Models loaded from local files successfully")
                return
            
            # If no models available, create dummy models for demo
            self._create_dummy_models()
            logger.warning("Using dummy models for demonstration")
            
        except Exception as e:
            logger.error(f"Failed to load models: {e}")
            self._create_dummy_models()
    
    def _load_models_from_mlflow(self) -> bool:
        """Load models from MLflow"""
        try:
            # Search for latest CCS model
            ccs_runs = mlflow.search_runs(
                experiment_ids=[mlflow.get_experiment_by_name(config.mlflow.experiment_name).experiment_id],
                filter_string="tags.model_type = 'CCS'",
                order_by=["start_time DESC"],
                max_results=1
            )
            
            if not ccs_runs.empty:
                ccs_run_id = ccs_runs.iloc[0]['run_id']
                self.ccs_model = mlflow.xgboost.load_model(f"runs:/{ccs_run_id}/model")
                logger.info(f"Loaded CCS model from MLflow run: {ccs_run_id}")
            
            # Search for latest WCV model
            wcv_runs = mlflow.search_runs(
                experiment_ids=[mlflow.get_experiment_by_name(config.mlflow.experiment_name).experiment_id],
                filter_string="tags.model_type = 'WCV'",
                order_by=["start_time DESC"],
                max_results=1
            )
            
            if not wcv_runs.empty:
                wcv_run_id = wcv_runs.iloc[0]['run_id']
                self.wcv_model = mlflow.xgboost.load_model(f"runs:/{wcv_run_id}/model")
                logger.info(f"Loaded WCV model from MLflow run: {wcv_run_id}")
            
            return self.ccs_model is not None and self.wcv_model is not None
            
        except Exception as e:
            logger.error(f"Error loading models from MLflow: {e}")
            return False
    
    def _load_models_from_local(self) -> bool:
        """Load models from local files"""
        try:
            # Look for model files in the models directory
            models_dir = os.path.join(os.path.dirname(__file__), 'models')
            
            ccs_model_path = os.path.join(models_dir, 'ccs_model.pkl')
            wcv_model_path = os.path.join(models_dir, 'wcv_model.pkl')
            
            if os.path.exists(ccs_model_path):
                self.ccs_model = joblib.load(ccs_model_path)
                logger.info("Loaded CCS model from local file")
            
            if os.path.exists(wcv_model_path):
                self.wcv_model = joblib.load(wcv_model_path)
                logger.info("Loaded WCV model from local file")
            
            # Load feature lists
            features_path = os.path.join(models_dir, 'features.json')
            if os.path.exists(features_path):
                with open(features_path, 'r') as f:
                    features_data = json.load(f)
                    self.ccs_features = features_data.get('ccs_features', [])
                    self.wcv_features = features_data.get('wcv_features', [])
            
            return self.ccs_model is not None and self.wcv_model is not None
            
        except Exception as e:
            logger.error(f"Error loading models from local files: {e}")
            return False
    
    def _create_dummy_models(self):
        """Create dummy models for demonstration purposes"""
        try:
            # Create simple dummy XGBoost models
            from sklearn.datasets import make_classification
            
            # Generate dummy data for CCS
            X_ccs, y_ccs = make_classification(n_samples=1000, n_features=20, random_state=42)
            self.ccs_model = xgb.XGBClassifier(random_state=42)
            self.ccs_model.fit(X_ccs, y_ccs)
            
            # Generate dummy data for WCV
            X_wcv, y_wcv = make_classification(n_samples=1000, n_features=15, random_state=43)
            self.wcv_model = xgb.XGBClassifier(random_state=43)
            self.wcv_model.fit(X_wcv, y_wcv)
            
            # Define dummy features (based on your actual model features)
            self.ccs_features = [
                'Current_Age', 'pcp_visits_2023', 'avg_monthly_pcp_visits', 
                'chronic_condition_count', 'has_multiple_conditions', 'is_minority_ethnicity',
                'english_primary', 'months_without_pcp_visits', 'total_cost_2023',
                'has_diabetes', 'has_hypertension', 'has_depression', 'ed_visits_2023',
                'immunizations_2023', 'months_enrolled_2023', 'has_pcp_assigned',
                'pcp_visits_h1_2023', 'pcp_visits_h2_2023', 'pcp_visits_q4_2023',
                'utilization_pattern'
            ]
            
            self.wcv_features = [
                'Current_Age', 'months_without_pcp_visits', 'is_pediatric', 
                'pcp_visits_2023', 'wcv_eligible', 'chronic_condition_count',
                'has_multiple_conditions', 'english_primary', 'pcp_visits_h1_2023',
                'months_with_pcp_visits', 'immunizations_2023', 'has_pcp_assigned',
                'ed_visits_2023', 'total_cost_2023', 'utilization_pattern'
            ]
            
            logger.info("Created dummy models for demonstration")
            
        except Exception as e:
            logger.error(f"Error creating dummy models: {e}")
    
    def setup_messaging(self):
        """Initialize RabbitMQ connections"""
        try:
            self.publisher = MessagePublisher()
            self.consumer = MessageConsumer("risk-prediction")
            logger.info("RabbitMQ connections initialized")
        except Exception as e:
            logger.error(f"Failed to initialize messaging: {e}")
            # Don't raise - continue without RabbitMQ for testing
            self.publisher = None
            self.consumer = None
            logger.warning("Continuing without RabbitMQ connections")
    
    def extract_features_from_message(self, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract features from processed HL7 message for risk prediction"""
        try:
            # Extract basic information
            member_id = message_data.get('member_id', '')
            evidence_found = message_data.get('evidence_found', False)
            measures_detected = message_data.get('measures_detected', [])
            
            # For demo purposes, create synthetic features based on member_id
            # In production, this would query your database for member features
            features = self._generate_synthetic_features(member_id, evidence_found, measures_detected)
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting features: {e}")
            return {}
    
    def _generate_synthetic_features(self, member_id: str, evidence_found: bool, measures_detected: List[str]) -> Dict[str, Any]:
        """Generate synthetic features for demonstration (replace with real data query)"""
        # Use member_id as seed for consistent synthetic data
        np.random.seed(hash(member_id) % 2**32)
        
        # Base features that would come from your database
        features = {
            'Current_Age': np.random.randint(18, 80),
            'pcp_visits_2023': np.random.randint(0, 12),
            'avg_monthly_pcp_visits': np.random.uniform(0, 2),
            'chronic_condition_count': np.random.randint(0, 5),
            'has_multiple_conditions': np.random.choice([0, 1]),
            'is_minority_ethnicity': np.random.choice([0, 1]),
            'english_primary': np.random.choice([0, 1]),
            'months_without_pcp_visits': np.random.randint(0, 12),
            'total_cost_2023': np.random.uniform(0, 50000),
            'has_diabetes': np.random.choice([0, 1]),
            'has_hypertension': np.random.choice([0, 1]),
            'has_depression': np.random.choice([0, 1]),
            'ed_visits_2023': np.random.randint(0, 10),
            'immunizations_2023': np.random.randint(0, 5),
            'months_enrolled_2023': np.random.randint(6, 12),
            'has_pcp_assigned': np.random.choice([0, 1]),
            'pcp_visits_h1_2023': np.random.randint(0, 6),
            'pcp_visits_h2_2023': np.random.randint(0, 6),
            'pcp_visits_q4_2023': np.random.randint(0, 3),
            'utilization_pattern': np.random.randint(0, 3),
            'is_pediatric': 1 if features.get('Current_Age', 25) < 18 else 0,
            'wcv_eligible': 1 if features.get('Current_Age', 25) < 18 else 0
        }
        
        # Adjust features based on evidence found
        if evidence_found:
            # If evidence was found, reduce risk factors
            features['pcp_visits_2023'] = max(features['pcp_visits_2023'], 2)
            features['months_without_pcp_visits'] = min(features['months_without_pcp_visits'], 3)
        
        return features
    
    def predict_risk(self, features: Dict[str, Any], measure_type: str) -> Dict[str, Any]:
        """Predict non-compliance risk for given features"""
        try:
            if measure_type.upper() == 'CCS':
                model = self.ccs_model
                feature_list = self.ccs_features
            elif measure_type.upper() == 'WCV':
                model = self.wcv_model
                feature_list = self.wcv_features
            else:
                raise ValueError(f"Unknown measure type: {measure_type}")
            
            if model is None:
                raise ValueError(f"Model not loaded for measure type: {measure_type}")
            
            # Prepare feature vector
            feature_vector = []
            for feature_name in feature_list:
                value = features.get(feature_name, 0)
                feature_vector.append(value)
            
            # Convert to numpy array
            X = np.array(feature_vector).reshape(1, -1)
            
            # Make prediction
            risk_probability = model.predict_proba(X)[0][1]  # Probability of non-compliance
            risk_prediction = model.predict(X)[0]  # Binary prediction
            
            # Determine risk level
            if risk_probability >= 0.7:
                risk_level = "HIGH"
            elif risk_probability >= 0.4:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
            
            return {
                "measure_type": measure_type.upper(),
                "risk_probability": float(risk_probability),
                "risk_prediction": int(risk_prediction),
                "risk_level": risk_level,
                "model_version": "1.0",
                "features_used": len(feature_list)
            }
            
        except Exception as e:
            logger.error(f"Error predicting risk: {e}")
            return {
                "measure_type": measure_type.upper(),
                "risk_probability": 0.5,
                "risk_prediction": 1,
                "risk_level": "UNKNOWN",
                "error": str(e)
            }
    
    def process_message(self, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main processing function for risk prediction"""
        try:
            # Extract message details
            message_id = message_data.get('message_id', 'unknown')
            member_id = message_data.get('member_id', '')
            evidence_found = message_data.get('evidence_found', False)
            measures_detected = message_data.get('measures_detected', [])
            
            logger.info(f"Processing risk prediction for message {message_id}, member {member_id}")
            
            # Extract features for prediction
            features = self.extract_features_from_message(message_data)
            
            # Predict risk for relevant measures
            risk_predictions = {}
            
            # Determine which measures to predict based on member age and evidence
            member_age = features.get('Current_Age', 25)
            
            # CCS prediction (adult women 24-64)
            if 24 <= member_age <= 64:
                if 'ccs_evidence' in measures_detected or not evidence_found:
                    risk_predictions['CCS'] = self.predict_risk(features, 'CCS')
            
            # WCV prediction (pediatric <18)
            if member_age < 18:
                if 'wcv_evidence' in measures_detected or not evidence_found:
                    risk_predictions['WCV'] = self.predict_risk(features, 'WCV')
            
            # Create result
            result = {
                "message_id": message_id,
                "member_id": member_id,
                "processing_timestamp": datetime.utcnow().isoformat(),
                "evidence_found": evidence_found,
                "measures_detected": measures_detected,
                "member_age": member_age,
                "risk_predictions": risk_predictions,
                "high_risk_measures": [
                    measure for measure, pred in risk_predictions.items() 
                    if pred.get('risk_level') == 'HIGH'
                ]
            }
            
            logger.info(f"Risk prediction completed for message {message_id}: {len(risk_predictions)} predictions")
            return result
            
        except Exception as e:
            logger.error(f"Error processing risk prediction message: {e}")
            return {
                "message_id": message_data.get('message_id', 'unknown'),
                "member_id": message_data.get('member_id', ''),
                "processing_timestamp": datetime.utcnow().isoformat(),
                "error": str(e),
                "risk_predictions": {}
            }


# Global predictor instance
predictor = RiskPredictor()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "risk-prediction",
        "timestamp": datetime.utcnow().isoformat(),
        "models_loaded": {
            "ccs_model": predictor.ccs_model is not None,
            "wcv_model": predictor.wcv_model is not None
        },
        "mlflow_uri": config.mlflow.tracking_uri
    }


@app.post("/predict")
async def predict_risk(request_data: Dict[str, Any]):
    """Predict risk for given features (for testing)"""
    try:
        result = predictor.process_message(request_data)
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Error in predict endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def message_callback(message: Dict[str, Any]) -> bool:
    """Callback function for RabbitMQ message processing"""
    try:
        # Process the risk prediction
        result = predictor.process_message(message['data'])
        
        # Publish result to care orchestration service
        success = predictor.publisher.publish_risk_score(result)
        
        if success:
            logger.info(f"Successfully processed and published risk prediction {result['message_id']}")
            return True
        else:
            logger.error(f"Failed to publish risk prediction {result['message_id']}")
            return False
            
    except Exception as e:
        logger.error(f"Error in message callback: {e}")
        return False


@app.on_event("startup")
async def startup_event():
    """Initialize service on startup"""
    logger.info("Starting Risk Prediction Service...")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Risk Prediction Service...")
    if predictor.publisher:
        predictor.publisher.close()
    if predictor.consumer:
        predictor.consumer.close()


def start_consumer():
    """Start RabbitMQ consumer in background"""
    logger.info("Starting RabbitMQ consumer for processed HL7 messages...")
    predictor.consumer.consume_processed_hl7(message_callback)


if __name__ == "__main__":
    import threading
    
    # Start consumer in background thread
    consumer_thread = threading.Thread(target=start_consumer, daemon=True)
    consumer_thread.start()
    
    # Start FastAPI server
    service_config = config.get_service_config("risk_prediction")
    uvicorn.run(
        app,
        host=service_config.host,
        port=service_config.port,
        log_level=service_config.log_level.lower()
    )
