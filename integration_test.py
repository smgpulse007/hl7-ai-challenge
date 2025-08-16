#!/usr/bin/env python3
"""
HEDIS AI Platform - Service Integration Test
Tests both RabbitMQ and HTTP API communication for demo reliability
"""

import json
import requests
import time
import pika
import ssl
from datetime import datetime
from typing import Dict, Any

# Service endpoints
SERVICES = {
    'hl7_processing': 'http://localhost:8001',
    'risk_prediction': 'http://localhost:8002', 
    'care_orchestration': 'http://localhost:8003',
    'dashboard': 'http://localhost:3000'
}

# RabbitMQ configuration
RABBITMQ_CONFIG = {
    'host': 'localhost',
    'port': 5672,
    'vhost': 'ml-predictor',
    'username': 'ml-predictor',
    'password': 'P@ssPr3dictor',
    'ssl_enabled': False
}

def print_test_result(test_name: str, success: bool, details: Dict[str, Any] = None):
    """Print formatted test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {status}: {test_name}")
    if details:
        for key, value in details.items():
            print(f"   📊 {key}: {value}")
    print("   " + "-"*50)

def test_http_api_communication():
    """Test HTTP API communication between services"""
    print("\n🔗 TESTING HTTP API COMMUNICATION")
    print("="*60)
    
    # Test data
    test_message = {
        "message_id": "TEST_HTTP_001",
        "member_id": "99990001000000",
        "message_type": "MDM",
        "patient_name": "Test Patient",
        "content": "Test cervical cancer screening content"
    }
    
    # Test HL7 Processing
    try:
        response = requests.post(f"{SERVICES['hl7_processing']}/process", 
                               json=test_message, timeout=10)
        hl7_success = response.status_code == 200
        hl7_result = response.json() if hl7_success else None
        
        print_test_result("HL7 Processing HTTP API", hl7_success, {
            "status_code": response.status_code,
            "response_time": f"{response.elapsed.total_seconds():.2f}s"
        })
    except Exception as e:
        print_test_result("HL7 Processing HTTP API", False, {"error": str(e)})
        return False
    
    # Test Risk Prediction
    try:
        risk_input = hl7_result.get("result", test_message) if hl7_result else test_message
        response = requests.post(f"{SERVICES['risk_prediction']}/predict", 
                               json=risk_input, timeout=10)
        risk_success = response.status_code == 200
        risk_result = response.json() if risk_success else None
        
        print_test_result("Risk Prediction HTTP API", risk_success, {
            "status_code": response.status_code,
            "response_time": f"{response.elapsed.total_seconds():.2f}s"
        })
    except Exception as e:
        print_test_result("Risk Prediction HTTP API", False, {"error": str(e)})
        return False
    
    # Test Care Orchestration
    try:
        care_input = risk_result.get("result", test_message) if risk_result else test_message
        response = requests.post(f"{SERVICES['care_orchestration']}/process", 
                               json=care_input, timeout=10)
        care_success = response.status_code == 200
        
        print_test_result("Care Orchestration HTTP API", care_success, {
            "status_code": response.status_code,
            "response_time": f"{response.elapsed.total_seconds():.2f}s"
        })
    except Exception as e:
        print_test_result("Care Orchestration HTTP API", False, {"error": str(e)})
        return False
    
    return hl7_success and risk_success and care_success

def test_rabbitmq_connectivity():
    """Test RabbitMQ connectivity and queue setup"""
    print("\n🐰 TESTING RABBITMQ CONNECTIVITY")
    print("="*60)
    
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
        
        # Test connection
        connection = pika.BlockingConnection(parameters)
        channel = connection.channel()
        
        print_test_result("RabbitMQ Connection", True, {
            "host": f"{RABBITMQ_CONFIG['host']}:{RABBITMQ_CONFIG['port']}",
            "vhost": RABBITMQ_CONFIG['vhost'],
            "ssl_enabled": RABBITMQ_CONFIG['ssl_enabled']
        })
        
        # Test queue declarations
        queues_to_test = [
            "hl7.messages",
            "hl7.processed", 
            "risk.scores",
            "care.gaps"
        ]
        
        queue_success = True
        for queue_name in queues_to_test:
            try:
                method = channel.queue_declare(queue=queue_name, durable=True, passive=True)
                print_test_result(f"Queue: {queue_name}", True, {
                    "messages": method.method.message_count,
                    "consumers": method.method.consumer_count
                })
            except Exception as e:
                print_test_result(f"Queue: {queue_name}", False, {"error": str(e)})
                queue_success = False
        
        # Test message publishing
        try:
            test_message = {
                "test": True,
                "timestamp": datetime.now().isoformat(),
                "message": "Integration test message"
            }
            
            channel.basic_publish(
                exchange='hl7.exchange',
                routing_key='hl7.message',
                body=json.dumps(test_message),
                properties=pika.BasicProperties(delivery_mode=2)  # Make message persistent
            )
            
            print_test_result("Message Publishing", True, {
                "exchange": "hl7.exchange",
                "routing_key": "hl7.message"
            })
            
        except Exception as e:
            print_test_result("Message Publishing", False, {"error": str(e)})
            queue_success = False
        
        connection.close()
        return queue_success
        
    except Exception as e:
        print_test_result("RabbitMQ Connection", False, {"error": str(e)})
        return False

def test_service_health_endpoints():
    """Test all service health endpoints"""
    print("\n🏥 TESTING SERVICE HEALTH ENDPOINTS")
    print("="*60)
    
    all_healthy = True
    for service_name, base_url in SERVICES.items():
        try:
            response = requests.get(f"{base_url}/health", timeout=5)
            success = response.status_code == 200
            
            if success:
                health_data = response.json()
                print_test_result(f"{service_name} Health", True, {
                    "status": health_data.get("status", "unknown"),
                    "response_time": f"{response.elapsed.total_seconds():.2f}s"
                })
            else:
                print_test_result(f"{service_name} Health", False, {
                    "status_code": response.status_code
                })
                all_healthy = False
                
        except Exception as e:
            print_test_result(f"{service_name} Health", False, {"error": str(e)})
            all_healthy = False
    
    return all_healthy

def test_dashboard_data_endpoints():
    """Test dashboard data endpoints"""
    print("\n📊 TESTING DASHBOARD DATA ENDPOINTS")
    print("="*60)
    
    endpoints_to_test = [
        ("/care-gaps", "Care Gaps"),
        ("/members", "Members"),
        ("/population-analytics", "Population Analytics"),
        ("/care-management-stats", "Care Management Stats")
    ]
    
    all_success = True
    for endpoint, name in endpoints_to_test:
        try:
            response = requests.get(f"{SERVICES['care_orchestration']}{endpoint}", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                data_count = len(data) if isinstance(data, list) else 1
                print_test_result(f"{name} Endpoint", True, {
                    "status_code": response.status_code,
                    "data_count": data_count,
                    "response_time": f"{response.elapsed.total_seconds():.2f}s"
                })
            else:
                print_test_result(f"{name} Endpoint", False, {
                    "status_code": response.status_code
                })
                all_success = False
                
        except Exception as e:
            print_test_result(f"{name} Endpoint", False, {"error": str(e)})
            all_success = False
    
    return all_success

def run_integration_tests():
    """Run all integration tests"""
    print("🧪 HEDIS AI PLATFORM - INTEGRATION TEST SUITE")
    print("="*80)
    print("🎯 Testing both RabbitMQ and HTTP API communication")
    print("🔧 Ensuring demo reliability across all communication methods")
    print("="*80)
    
    start_time = time.time()
    
    # Run all tests
    test_results = {
        "Service Health": test_service_health_endpoints(),
        "HTTP API Communication": test_http_api_communication(),
        "RabbitMQ Connectivity": test_rabbitmq_connectivity(),
        "Dashboard Data Endpoints": test_dashboard_data_endpoints()
    }
    
    total_time = time.time() - start_time
    
    # Summary
    print("\n📋 INTEGRATION TEST SUMMARY")
    print("="*60)
    
    passed_tests = sum(1 for result in test_results.values() if result)
    total_tests = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\n📊 Results: {passed_tests}/{total_tests} tests passed")
    print(f"⏱️  Total time: {total_time:.2f}s")
    
    overall_success = all(test_results.values())
    
    if overall_success:
        print("\n🎉 ALL INTEGRATION TESTS PASSED!")
        print("✅ Platform ready for live demo recording")
        print("✅ Both RabbitMQ and HTTP APIs working")
        print("✅ All services communicating properly")
    else:
        print("\n⚠️  SOME TESTS FAILED!")
        print("❌ Review failed tests before demo")
    
    return overall_success

if __name__ == "__main__":
    success = run_integration_tests()
    exit(0 if success else 1)
