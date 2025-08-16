"""
RabbitMQ client utilities for HEDIS AI Platform
Handles connection management, publishing, and consuming
"""

import json
import logging
import pika
import ssl
from typing import Callable, Dict, Any, Optional
from datetime import datetime
try:
    from .config import config
except ImportError:
    from config import config

logger = logging.getLogger(__name__)


class RabbitMQClient:
    """RabbitMQ client for publishing and consuming messages"""
    
    def __init__(self):
        self.connection = None
        self.channel = None
        self.config = config.rabbitmq
        
    def connect(self):
        """Establish connection to RabbitMQ"""
        try:
            # Connection parameters
            credentials = pika.PlainCredentials(
                self.config.username, 
                self.config.password
            )
            
            parameters = pika.ConnectionParameters(
                host=self.config.host,
                port=self.config.port,
                virtual_host=self.config.vhost,
                credentials=credentials,
                ssl_options=pika.SSLOptions(self.config.ssl_context) if self.config.ssl_enabled else None,
                heartbeat=600,
                blocked_connection_timeout=300
            )
            
            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()
            
            logger.info(f"Connected to RabbitMQ at {self.config.host}:{self.config.port}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to connect to RabbitMQ: {e}")
            return False
    
    def disconnect(self):
        """Close RabbitMQ connection"""
        try:
            if self.channel and not self.channel.is_closed:
                self.channel.close()
            if self.connection and not self.connection.is_closed:
                self.connection.close()
            logger.info("Disconnected from RabbitMQ")
        except Exception as e:
            logger.error(f"Error disconnecting from RabbitMQ: {e}")
    
    def setup_exchanges_and_queues(self):
        """Setup all exchanges and queues for the platform"""
        if not self.channel:
            if not self.connect():
                return False
        
        try:
            # Declare exchanges
            for exchange_name, exchange_config in config.exchanges.items():
                self.channel.exchange_declare(
                    exchange=exchange_config["name"],
                    exchange_type=exchange_config["type"],
                    durable=exchange_config["durable"]
                )
                logger.info(f"Declared exchange: {exchange_config['name']}")
            
            # Declare queues and bind to exchanges
            for queue_name, queue_config in config.queues.items():
                self.channel.queue_declare(
                    queue=queue_config["name"],
                    durable=True
                )
                
                self.channel.queue_bind(
                    exchange=queue_config["exchange"],
                    queue=queue_config["name"],
                    routing_key=queue_config["routing_key"]
                )
                
                logger.info(f"Declared and bound queue: {queue_config['name']}")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to setup exchanges and queues: {e}")
            return False
    
    def publish_message(self, exchange: str, routing_key: str, message: Dict[Any, Any], 
                       message_id: Optional[str] = None):
        """Publish message to exchange"""
        if not self.channel:
            if not self.connect():
                return False
        
        try:
            # Add metadata to message
            enriched_message = {
                "id": message_id or self._generate_message_id(),
                "timestamp": datetime.utcnow().isoformat(),
                "data": message
            }
            
            # Publish message
            self.channel.basic_publish(
                exchange=exchange,
                routing_key=routing_key,
                body=json.dumps(enriched_message),
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Make message persistent
                    message_id=enriched_message["id"],
                    timestamp=int(datetime.utcnow().timestamp())
                )
            )
            
            logger.info(f"Published message {enriched_message['id']} to {exchange}/{routing_key}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to publish message: {e}")
            return False
    
    def consume_messages(self, queue: str, callback: Callable, auto_ack: bool = False):
        """Start consuming messages from queue"""
        if not self.channel:
            if not self.connect():
                return False
        
        try:
            def wrapper_callback(ch, method, properties, body):
                """Wrapper callback to handle message parsing and acking"""
                try:
                    # Parse message
                    message = json.loads(body.decode('utf-8'))
                    logger.info(f"Received message {message.get('id', 'unknown')} from {queue}")
                    
                    # Call user callback
                    result = callback(message)
                    
                    # Acknowledge message if not auto-ack and callback succeeded
                    if not auto_ack and result is not False:
                        ch.basic_ack(delivery_tag=method.delivery_tag)
                        logger.debug(f"Acknowledged message {message.get('id', 'unknown')}")
                    
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse message JSON: {e}")
                    if not auto_ack:
                        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
                        
                except Exception as e:
                    logger.error(f"Error processing message: {e}")
                    if not auto_ack:
                        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
            
            # Setup consumer
            self.channel.basic_qos(prefetch_count=1)  # Process one message at a time
            self.channel.basic_consume(
                queue=queue,
                on_message_callback=wrapper_callback,
                auto_ack=auto_ack
            )
            
            logger.info(f"Started consuming from queue: {queue}")
            self.channel.start_consuming()
            
        except KeyboardInterrupt:
            logger.info("Stopping consumer...")
            self.channel.stop_consuming()
            
        except Exception as e:
            logger.error(f"Error consuming messages: {e}")
            return False
    
    def _generate_message_id(self) -> str:
        """Generate unique message ID"""
        from uuid import uuid4
        return str(uuid4())


class MessagePublisher:
    """Simplified message publisher for specific use cases"""
    
    def __init__(self):
        self.client = RabbitMQClient()
        self.client.connect()
    
    def publish_hl7_message(self, hl7_data: Dict[Any, Any], message_id: Optional[str] = None):
        """Publish HL7 message for processing"""
        return self.client.publish_message(
            exchange="hl7.exchange",
            routing_key="hl7.message",
            message=hl7_data,
            message_id=message_id
        )
    
    def publish_processed_hl7(self, processed_data: Dict[Any, Any], message_id: Optional[str] = None):
        """Publish processed HL7 data for risk prediction"""
        return self.client.publish_message(
            exchange="risk.exchange",
            routing_key="hl7.processed",
            message=processed_data,
            message_id=message_id
        )
    
    def publish_risk_score(self, risk_data: Dict[Any, Any], message_id: Optional[str] = None):
        """Publish risk score for care orchestration"""
        return self.client.publish_message(
            exchange="care.exchange",
            routing_key="risk.calculated",
            message=risk_data,
            message_id=message_id
        )
    
    def publish_care_gap(self, care_gap_data: Dict[Any, Any], message_id: Optional[str] = None):
        """Publish care gap for dashboard"""
        return self.client.publish_message(
            exchange="dashboard.exchange",
            routing_key="care.gap.created",
            message=care_gap_data,
            message_id=message_id
        )
    
    def publish_care_alert(self, alert_data: Dict[Any, Any], message_id: Optional[str] = None):
        """Publish high-priority care alert"""
        return self.client.publish_message(
            exchange="dashboard.exchange",
            routing_key="care.alert.high",
            message=alert_data,
            message_id=message_id
        )
    
    def close(self):
        """Close publisher connection"""
        self.client.disconnect()


class MessageConsumer:
    """Simplified message consumer for specific use cases"""
    
    def __init__(self, service_name: str):
        self.service_name = service_name
        self.client = RabbitMQClient()
        self.client.connect()
    
    def consume_hl7_messages(self, callback: Callable):
        """Consume HL7 messages for processing"""
        logger.info(f"{self.service_name} starting to consume HL7 messages")
        return self.client.consume_messages("hl7.messages", callback)
    
    def consume_processed_hl7(self, callback: Callable):
        """Consume processed HL7 data for risk prediction"""
        logger.info(f"{self.service_name} starting to consume processed HL7 data")
        return self.client.consume_messages("hl7.processed", callback)
    
    def consume_risk_scores(self, callback: Callable):
        """Consume risk scores for care orchestration"""
        logger.info(f"{self.service_name} starting to consume risk scores")
        return self.client.consume_messages("risk.scores", callback)
    
    def consume_care_gaps(self, callback: Callable):
        """Consume care gaps for dashboard"""
        logger.info(f"{self.service_name} starting to consume care gaps")
        return self.client.consume_messages("care.gaps", callback)
    
    def consume_care_alerts(self, callback: Callable):
        """Consume care alerts for dashboard"""
        logger.info(f"{self.service_name} starting to consume care alerts")
        return self.client.consume_messages("care.alerts", callback)
    
    def close(self):
        """Close consumer connection"""
        self.client.disconnect()


# Utility function to setup infrastructure
def setup_rabbitmq_infrastructure():
    """Setup all RabbitMQ exchanges and queues"""
    client = RabbitMQClient()
    if client.connect():
        success = client.setup_exchanges_and_queues()
        client.disconnect()
        return success
    return False


if __name__ == "__main__":
    # Test connection and setup
    logging.basicConfig(level=logging.INFO)
    
    print("Testing RabbitMQ connection...")
    if setup_rabbitmq_infrastructure():
        print("✅ RabbitMQ infrastructure setup successful!")
    else:
        print("❌ RabbitMQ infrastructure setup failed!")
