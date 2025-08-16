"""
Demo-specific configuration for HEDIS AI Platform
Uses local RabbitMQ for reliable demo execution
"""

import os
import ssl
from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class RabbitMQConfig:
    """RabbitMQ connection configuration for demo"""
    host: str = os.getenv("RABBITMQ_HOST", "rabbitmq")  # Use local container
    port: int = int(os.getenv("RABBITMQ_PORT", "5672"))  # Non-SSL port
    vhost: str = os.getenv("RABBITMQ_VHOST", "ml-predictor")
    username: str = os.getenv("RABBITMQ_USER", "ml-predictor")
    password: str = os.getenv("RABBITMQ_PASSWORD", "P@ssPr3dictor")
    ssl_enabled: bool = os.getenv("RABBITMQ_SSL_ENABLED", "false").lower() == "true"
    
    @property
    def connection_url(self) -> str:
        """Generate RabbitMQ connection URL"""
        protocol = "amqps" if self.ssl_enabled else "amqp"
        return f"{protocol}://{self.username}:{self.password}@{self.host}:{self.port}/{self.vhost}"
    
    @property
    def ssl_context(self):
        """SSL context for secure connections"""
        if not self.ssl_enabled:
            return None
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        return context

@dataclass
class MLflowConfig:
    """MLflow server configuration"""
    tracking_uri: str = "http://pvposwbc02.iehp.local:8000/"
    experiment_name: str = "hedis-ai-challenge-2025"
    
    def __post_init__(self):
        """Set MLflow tracking URI"""
        os.environ["MLFLOW_TRACKING_URI"] = self.tracking_uri

@dataclass
class DatabaseConfig:
    """Database configuration"""
    host: str = os.getenv("DB_HOST", "postgres")
    port: int = int(os.getenv("DB_PORT", "5432"))
    database: str = os.getenv("DB_NAME", "hedis_ai")
    username: str = os.getenv("DB_USER", "postgres")
    password: str = os.getenv("DB_PASSWORD", "password")
    
    @property
    def connection_url(self) -> str:
        """Generate database connection URL"""
        return f"postgresql://{self.username}:{self.password}@{self.host}:{self.port}/{self.database}"

@dataclass
class RedisConfig:
    """Redis configuration"""
    host: str = os.getenv("REDIS_HOST", "redis")
    port: int = int(os.getenv("REDIS_PORT", "6379"))
    db: int = int(os.getenv("REDIS_DB", "0"))
    password: str = os.getenv("REDIS_PASSWORD", "")

@dataclass
class ServiceConfig:
    """Individual service configuration"""
    name: str
    host: str
    port: int
    health_endpoint: str = "/health"
    
    @property
    def base_url(self) -> str:
        return f"http://{self.host}:{self.port}"
    
    @property
    def health_url(self) -> str:
        return f"{self.base_url}{self.health_endpoint}"

class DemoConfig:
    """Main configuration class for demo"""
    
    def __init__(self):
        self.rabbitmq = RabbitMQConfig()
        self.mlflow = MLflowConfig()
        self.database = DatabaseConfig()
        self.redis = RedisConfig()
        
        # Service configurations
        self.services = {
            "hl7-processing": ServiceConfig("hl7-processing", "hl7-processing", 8001),
            "risk-prediction": ServiceConfig("risk-prediction", "risk-prediction", 8002),
            "care-orchestration": ServiceConfig("care-orchestration", "care-orchestration", 8003),
            "dashboard": ServiceConfig("dashboard", "dashboard", 3000)
        }
        
        # Exchange configurations
        self.exchanges = {
            "hl7_exchange": {
                "name": "hl7.exchange",
                "type": "topic",
                "durable": True
            },
            "risk_exchange": {
                "name": "risk.exchange", 
                "type": "topic",
                "durable": True
            },
            "care_exchange": {
                "name": "care.exchange",
                "type": "topic", 
                "durable": True
            },
            "dashboard_exchange": {
                "name": "dashboard.exchange",
                "type": "topic",
                "durable": True
            }
        }
        
        # Queue configurations
        self.queues = {
            "hl7_messages": {
                "name": "hl7.messages",
                "routing_key": "hl7.message",
                "exchange": "hl7.exchange"
            },
            "hl7_processed": {
                "name": "hl7.processed",
                "routing_key": "hl7.processed",
                "exchange": "risk.exchange"
            },
            "risk_scores": {
                "name": "risk.scores",
                "routing_key": "risk.calculated",
                "exchange": "care.exchange"
            },
            "care_gaps": {
                "name": "care.gaps",
                "routing_key": "care.gap.created",
                "exchange": "dashboard.exchange"
            },
            "care_alerts": {
                "name": "care.alerts",
                "routing_key": "care.alert.high",
                "exchange": "dashboard.exchange"
            }
        }
    
    def get_service_config(self, service_name: str) -> ServiceConfig:
        """Get configuration for specific service"""
        return self.services.get(service_name)

# Global demo configuration instance
demo_config = DemoConfig()
