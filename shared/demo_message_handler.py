"""
Demo Message Handler for HEDIS AI Platform
Hybrid approach using both RabbitMQ and HTTP APIs for demo reliability
"""

import json
import logging
import requests
import asyncio
from typing import Dict, Any, Optional, Callable
from datetime import datetime

try:
    from .demo_config import demo_config
    from .rabbitmq_client import RabbitMQClient
except ImportError:
    from demo_config import demo_config
    from rabbitmq_client import RabbitMQClient

logger = logging.getLogger(__name__)

class DemoMessageHandler:
    """Hybrid message handler for demo reliability"""
    
    def __init__(self):
        self.config = demo_config
        self.rabbitmq_client = None
        self.rabbitmq_available = False
        self._initialize_rabbitmq()
    
    def _initialize_rabbitmq(self):
        """Try to initialize RabbitMQ connection"""
        try:
            self.rabbitmq_client = RabbitMQClient()
            if self.rabbitmq_client.connect():
                self.rabbitmq_client.setup_exchanges_and_queues()
                self.rabbitmq_available = True
                logger.info("RabbitMQ initialized successfully for demo")
            else:
                logger.warning("RabbitMQ not available, using HTTP API fallback")
        except Exception as e:
            logger.warning(f"RabbitMQ initialization failed: {e}, using HTTP API fallback")
            self.rabbitmq_available = False
    
    async def process_hl7_message(self, hl7_message: Dict[str, Any]) -> Dict[str, Any]:
        """Process HL7 message through the pipeline"""
        try:
            # Step 1: HL7 Processing
            logger.info("Step 1: Processing HL7 message")
            processed_hl7 = await self._call_hl7_processing(hl7_message)
            if not processed_hl7:
                raise Exception("HL7 processing failed")
            
            # Step 2: Risk Prediction
            logger.info("Step 2: Generating risk predictions")
            risk_data = await self._call_risk_prediction(processed_hl7)
            if not risk_data:
                raise Exception("Risk prediction failed")
            
            # Step 3: Care Orchestration
            logger.info("Step 3: Creating care plan")
            care_plan = await self._call_care_orchestration(risk_data)
            if not care_plan:
                raise Exception("Care orchestration failed")
            
            # Step 4: Update Dashboard (via HTTP)
            logger.info("Step 4: Updating dashboard")
            await self._update_dashboard(care_plan)
            
            return {
                "success": True,
                "pipeline_result": {
                    "hl7_processed": processed_hl7,
                    "risk_data": risk_data,
                    "care_plan": care_plan
                },
                "processing_time": datetime.utcnow().isoformat(),
                "method": "rabbitmq" if self.rabbitmq_available else "http_api"
            }
            
        except Exception as e:
            logger.error(f"Pipeline processing failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "processing_time": datetime.utcnow().isoformat()
            }
    
    async def _call_hl7_processing(self, hl7_message: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Call HL7 processing service"""
        try:
            if self.rabbitmq_available:
                # Try RabbitMQ first
                return await self._rabbitmq_call("hl7-processing", "hl7.messages", hl7_message)
            else:
                # Fallback to HTTP API
                return await self._http_call("hl7-processing", "/process", hl7_message)
        except Exception as e:
            logger.warning(f"RabbitMQ call failed, trying HTTP: {e}")
            return await self._http_call("hl7-processing", "/process", hl7_message)
    
    async def _call_risk_prediction(self, processed_hl7: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Call risk prediction service"""
        try:
            if self.rabbitmq_available:
                return await self._rabbitmq_call("risk-prediction", "hl7.processed", processed_hl7)
            else:
                return await self._http_call("risk-prediction", "/predict", processed_hl7)
        except Exception as e:
            logger.warning(f"RabbitMQ call failed, trying HTTP: {e}")
            return await self._http_call("risk-prediction", "/predict", processed_hl7)
    
    async def _call_care_orchestration(self, risk_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Call care orchestration service"""
        try:
            if self.rabbitmq_available:
                return await self._rabbitmq_call("care-orchestration", "risk.scores", risk_data)
            else:
                return await self._http_call("care-orchestration", "/orchestrate", risk_data)
        except Exception as e:
            logger.warning(f"RabbitMQ call failed, trying HTTP: {e}")
            return await self._http_call("care-orchestration", "/orchestrate", risk_data)
    
    async def _update_dashboard(self, care_plan: Dict[str, Any]):
        """Update dashboard with new care plan"""
        try:
            if self.rabbitmq_available:
                await self._rabbitmq_publish("dashboard.exchange", "care.gap.created", care_plan)
            # Dashboard updates are handled via database, so HTTP call not needed
            logger.info("Dashboard update triggered")
        except Exception as e:
            logger.warning(f"Dashboard update failed: {e}")
    
    async def _rabbitmq_call(self, service: str, queue: str, message: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Make RabbitMQ call with response handling"""
        # For demo, we'll use HTTP calls as RabbitMQ async response handling is complex
        # In production, this would use RPC pattern with correlation IDs
        service_config = self.config.get_service_config(service)
        if service == "hl7-processing":
            return await self._http_call(service, "/process", message)
        elif service == "risk-prediction":
            return await self._http_call(service, "/predict", message)
        elif service == "care-orchestration":
            return await self._http_call(service, "/orchestrate", message)
        return None
    
    async def _rabbitmq_publish(self, exchange: str, routing_key: str, message: Dict[str, Any]):
        """Publish message to RabbitMQ"""
        if self.rabbitmq_client and self.rabbitmq_available:
            try:
                self.rabbitmq_client.publish_message(exchange, routing_key, message)
                logger.info(f"Published message to {exchange} with key {routing_key}")
            except Exception as e:
                logger.error(f"Failed to publish to RabbitMQ: {e}")
    
    async def _http_call(self, service: str, endpoint: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Make HTTP API call to service"""
        try:
            service_config = self.config.get_service_config(service)
            url = f"{service_config.base_url}{endpoint}"
            
            # Use requests in a thread pool for async behavior
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: requests.post(url, json=data, timeout=30)
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"HTTP call to {service}{endpoint} successful")
                return result.get("result", result)
            else:
                logger.error(f"HTTP call to {service}{endpoint} failed: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"HTTP call to {service}{endpoint} error: {e}")
            return None
    
    def publish_demo_message(self, message: Dict[str, Any]):
        """Publish a message for demo purposes"""
        try:
            if self.rabbitmq_available:
                self.rabbitmq_client.publish_message("hl7.exchange", "hl7.message", message)
                logger.info("Demo message published to RabbitMQ")
            else:
                logger.info("RabbitMQ not available, use HTTP API directly")
        except Exception as e:
            logger.error(f"Failed to publish demo message: {e}")

# Global demo message handler
demo_handler = DemoMessageHandler()
