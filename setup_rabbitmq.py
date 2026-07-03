#!/usr/bin/env python3
"""
Setup RabbitMQ exchanges and queues for HEDIS AI Platform
"""

import pika
import json
import os
from datetime import datetime

# RabbitMQ configuration
RABBITMQ_CONFIG = {
    'host': os.getenv('RABBITMQ_HOST', 'localhost'),
    'port': int(os.getenv('RABBITMQ_PORT', '5672')),
    'vhost': os.getenv('RABBITMQ_VHOST', 'ml-predictor'),
    'username': os.getenv('RABBITMQ_USER', 'ml-predictor'),
    'password': os.getenv('RABBITMQ_PASSWORD', 'demo-rabbitmq-password')
}

def setup_rabbitmq():
    """Setup RabbitMQ exchanges and queues"""
    try:
        # Connection parameters
        credentials = pika.PlainCredentials(
            RABBITMQ_CONFIG['username'],
            RABBITMQ_CONFIG['password']
        )

        parameters = pika.ConnectionParameters(
            host=RABBITMQ_CONFIG['host'],
            port=RABBITMQ_CONFIG['port'],
            virtual_host=RABBITMQ_CONFIG['vhost'],
            credentials=credentials,
            heartbeat=600,
            blocked_connection_timeout=300
        )

        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()

        print("âœ… Connected to RabbitMQ")

        # Declare exchanges
        exchanges = [
            ('hl7.exchange', 'topic'),
            ('risk.exchange', 'topic'),
            ('care.exchange', 'topic'),
            ('dashboard.exchange', 'topic')
        ]

        for exchange_name, exchange_type in exchanges:
            channel.exchange_declare(
                exchange=exchange_name,
                exchange_type=exchange_type,
                durable=True
            )
            print(f"âœ… Created exchange: {exchange_name}")

        # Declare queues and bind them
        queue_bindings = [
            ('hl7.messages', 'hl7.exchange', 'hl7.message'),
            ('hl7.processed', 'risk.exchange', 'hl7.processed'),
            ('risk.scores', 'care.exchange', 'risk.calculated'),
            ('care.gaps', 'dashboard.exchange', 'care.gap.created'),
            ('care.alerts', 'dashboard.exchange', 'care.alert.high')
        ]

        for queue_name, exchange, routing_key in queue_bindings:
            # Declare queue
            channel.queue_declare(queue=queue_name, durable=True)

            # Bind queue to exchange
            channel.queue_bind(
                exchange=exchange,
                queue=queue_name,
                routing_key=routing_key
            )

            print(f"âœ… Created and bound queue: {queue_name} -> {exchange}")

        # Publish a test message to verify setup
        test_message = {
            "test": True,
            "timestamp": datetime.now().isoformat(),
            "message": "RabbitMQ setup verification"
        }

        channel.basic_publish(
            exchange='hl7.exchange',
            routing_key='hl7.message',
            body=json.dumps(test_message),
            properties=pika.BasicProperties(delivery_mode=2)
        )

        print("âœ… Published test message")

        connection.close()
        print("âœ… RabbitMQ setup completed successfully!")
        return True

    except Exception as e:
        print(f"âŒ RabbitMQ setup failed: {e}")
        return False

if __name__ == "__main__":
    success = setup_rabbitmq()
    exit(0 if success else 1)
