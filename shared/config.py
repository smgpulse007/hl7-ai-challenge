"""
Shared configuration for HEDIS AI Platform
Handles environment variables and service configuration
"""

import os
from dataclasses import dataclass
from typing import Optional
import ssl


@dataclass
class RabbitMQConfig:
    """RabbitMQ connection configuration"""
    host: str = os.getenv("RABBITMQ_HOST", "localhost")
    port: int = int(os.getenv("RABBITMQ_PORT", "5672"))
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
        if self.ssl_enabled:
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            return context
        return None


@dataclass
class MLflowConfig:
    """MLflow server configuration"""
    tracking_uri: str = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000/")
    experiment_name: str = "hedis-ai-challenge-2025"

    def __post_init__(self):
        """Set MLflow tracking URI"""
        os.environ["MLFLOW_TRACKING_URI"] = self.tracking_uri


@dataclass
class DatabaseConfig:
    """Database configuration"""
    host: str = os.getenv("DB_HOST", "localhost")
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
    """Redis cache configuration"""
    host: str = os.getenv("REDIS_HOST", "localhost")
    port: int = int(os.getenv("REDIS_PORT", "6379"))
    db: int = int(os.getenv("REDIS_DB", "0"))
    password: Optional[str] = os.getenv("REDIS_PASSWORD")
    
    @property
    def connection_url(self) -> str:
        """Generate Redis connection URL"""
        if self.password:
            return f"redis://:{self.password}@{self.host}:{self.port}/{self.db}"
        return f"redis://{self.host}:{self.port}/{self.db}"


@dataclass
class ServiceConfig:
    """Individual service configuration"""
    name: str
    port: int
    host: str = "0.0.0.0"
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    @property
    def base_url(self) -> str:
        """Generate service base URL"""
        return f"http://{self.host}:{self.port}"


class Config:
    """Main configuration class"""
    
    def __init__(self):
        self.rabbitmq = RabbitMQConfig()
        self.mlflow = MLflowConfig()
        self.database = DatabaseConfig()
        self.redis = RedisConfig()
        
        # Service configurations
        self.services = {
            "hl7_processing": ServiceConfig("hl7-processing", 8001),
            "risk_prediction": ServiceConfig("risk-prediction", 8002),
            "care_orchestration": ServiceConfig("care-orchestration", 8003),
            "dashboard": ServiceConfig("dashboard", 3000)
        }
        
        # RabbitMQ Exchange and Queue Configuration
        self.exchanges = {
            "hl7": {
                "name": "hl7.exchange",
                "type": "topic",
                "durable": True
            },
            "risk": {
                "name": "risk.exchange", 
                "type": "topic",
                "durable": True
            },
            "care": {
                "name": "care.exchange",
                "type": "topic", 
                "durable": True
            },
            "dashboard": {
                "name": "dashboard.exchange",
                "type": "topic",
                "durable": True
            }
        }
        
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
    
    def get_exchange_config(self, exchange_name: str) -> dict:
        """Get exchange configuration"""
        return self.exchanges.get(exchange_name)
    
    def get_queue_config(self, queue_name: str) -> dict:
        """Get queue configuration"""
        return self.queues.get(queue_name)


# Global configuration instance
config = Config()


# Environment-specific overrides
def load_environment_config():
    """Load environment-specific configuration"""
    env = os.getenv("ENVIRONMENT", "development")
    
    if env == "production":
        # Production overrides
        config.database.host = os.getenv("PROD_DB_HOST", "localhost")
        config.redis.host = os.getenv("PROD_REDIS_HOST", "localhost")

        # Production RabbitMQ (if different)
        prod_rmq_host = os.getenv("PROD_RMQ_HOST")
        if prod_rmq_host:
            config.rabbitmq.host = prod_rmq_host

    elif env == "staging":
        # Staging overrides
        config.database.host = os.getenv("STAGING_DB_HOST", "localhost")
        config.redis.host = os.getenv("STAGING_REDIS_HOST", "localhost")
    
    # Development uses defaults


# Load configuration on import
load_environment_config()
