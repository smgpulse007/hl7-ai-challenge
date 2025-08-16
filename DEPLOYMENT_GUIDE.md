# HEDIS AI Platform - Deployment Guide

**Event-Driven Microservices Architecture for HL7 AI Challenge**  
**Target**: 5-day implementation with production-ready foundation  

## 🏗️ Architecture Overview

```
Real HL7 Messages (Manual De-identification)
    ↓
RabbitMQ hl7.exchange (IEHP Dev: rmq-dev.iehp.org)
    ↓
HL7 Processing Service (Port 8001) - NER + RAG
    ↓
RabbitMQ risk.exchange
    ↓
Risk Prediction Service (Port 8002) - XGBoost Models
    ↓
RabbitMQ care.exchange
    ↓
Care Orchestration Service (Port 8003) - FHIR Resources
    ↓
RabbitMQ dashboard.exchange
    ↓
Dashboard Service (Port 3000) - React Frontend
```

## 🚀 Quick Start (5 Minutes)

### Prerequisites
```bash
# Required software
- Docker & Docker Compose
- Python 3.11+
- Node.js 18+
- Git

# Verify installations
docker --version
docker-compose --version
python --version
node --version
```

### 1. Clone and Setup
```bash
cd hedis-ai-platform

# Install Python dependencies for testing
pip install -r shared/requirements.txt

# Test RabbitMQ connection
python test_rabbitmq_setup.py
```

### 2. Start Services
```bash
# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 3. Verify Deployment
```bash
# Health checks
curl http://localhost:8001/health  # HL7 Processing
curl http://localhost:8002/health  # Risk Prediction
curl http://localhost:8003/health  # Care Orchestration

# Dashboard
open http://localhost:3000
```

## 📋 Detailed Setup Instructions

### Step 1: Environment Configuration

**RabbitMQ (Local Environment)**
- Host: localhost:5672 (Non-SSL)
- VHost: ml-predictor
- Credentials: ml-predictor / P@ssPr3dictor
- Management UI: http://localhost:15672

**MLflow (Local)**
- URL: http://localhost:5000/
- Experiment: hedis-ai-challenge-2025

### Step 2: Service Dependencies

**HL7 Processing Service**
```bash
cd services/hl7-processing
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Test service
python app.py
```

**Risk Prediction Service**
```bash
cd services/risk-prediction
pip install -r requirements.txt

# Copy your trained models to models/ directory
mkdir models
# cp /path/to/your/ccs_model.pkl models/
# cp /path/to/your/wcv_model.pkl models/

# Test service
python app.py
```

**Care Orchestration Service**
```bash
cd services/care-orchestration
npm install

# Test service
npm start
```

### Step 3: Data Preparation

**Manual De-identification Process**
```bash
# 1. Extract 20-30 real HL7 messages from your system
# 2. Manually de-identify:
#    - Replace member IDs with synthetic ones
#    - Replace names with fake names  
#    - Shift dates by random offsets
#    - Keep clinical content intact

# 3. Save as JSON format in samples/
mkdir samples
# Create samples/demo_hl7_messages.json
```

**Sample Message Format**
```json
{
  "message_id": "demo-ccs-001",
  "member_id": "DEMO123456",
  "message_type": "MDM",
  "message": "MSH|^~\\&|EMR|IEHP|...|OBX|1|ED|...|^application^pdf^Base64^JVBER...",
  "timestamp": "2024-01-25T12:00:00Z"
}
```

### Step 4: Testing End-to-End Flow

**1. Test RabbitMQ Infrastructure**
```bash
python test_rabbitmq_setup.py
```

**2. Feed Test Messages**
```bash
# Use the test script to publish sample messages
python test_rabbitmq_setup.py
# Select 'y' when prompted to feed sample messages
```

**3. Monitor Processing**
```bash
# Watch service logs
docker-compose logs -f hl7-processing
docker-compose logs -f risk-prediction
docker-compose logs -f care-orchestration

# Check RabbitMQ queues
# Visit: https://rmq-dev.iehp.org:15672
```

**4. Verify Results**
```bash
# Check dashboard for care gaps
open http://localhost:3000

# Test API endpoints
curl -X POST http://localhost:8001/process -H "Content-Type: application/json" -d @samples/test_message.json
```

## 🔧 Development Workflow

### Day 1: Infrastructure Setup
- [x] RabbitMQ connection and exchanges
- [x] Docker Compose configuration
- [x] Service scaffolding and health checks
- [ ] Manual data de-identification

### Day 2: HL7 Processing Service
- [x] Integrate existing Layer 1 code
- [x] RabbitMQ message consumption
- [x] NER + RAG processing pipeline
- [ ] Test with real de-identified data

### Day 3: Risk Prediction Service
- [x] XGBoost model integration
- [x] MLflow connection
- [x] Feature extraction and prediction
- [ ] Load your trained models

### Day 4: Care Orchestration & Dashboard
- [x] FHIR resource creation
- [x] Care gap workflow logic
- [ ] React dashboard implementation
- [ ] WebSocket real-time updates

### Day 5: Integration & Demo
- [ ] End-to-end testing
- [ ] Demo scenario preparation
- [ ] Performance optimization
- [ ] Documentation completion

## 🎯 Demo Scenarios

### Scenario 1: CCS Care Gap Detection
```bash
# 1. Feed HL7 MDM message with Pap smear report
curl -X POST http://localhost:8001/process -d '{
  "message_id": "demo-ccs-001",
  "member_id": "DEMO123456", 
  "message_type": "MDM",
  "message": "...HL7 message with Pap smear evidence..."
}'

# 2. Observe processing flow:
#    - HL7 Processing: Extracts "Pap smear completed 2023-06-15"
#    - Risk Prediction: Low risk (evidence found)
#    - Care Orchestration: Creates FHIR CarePlan (completed)
#    - Dashboard: Shows closed care gap
```

### Scenario 2: WCV High-Risk Prediction
```bash
# 1. Feed HL7 message without recent well-child visit
# 2. Observe processing flow:
#    - HL7 Processing: No WCV evidence found
#    - Risk Prediction: High risk (no recent visits)
#    - Care Orchestration: Creates urgent CarePlan
#    - Dashboard: Shows high-priority alert
```

### Scenario 3: Population Health View
```bash
# 1. Feed multiple messages simultaneously
# 2. Dashboard shows:
#    - Population-level metrics
#    - Risk stratification
#    - Care gap prioritization
#    - Provider actionable insights
```

## 🔍 Monitoring & Debugging

### Service Health Monitoring
```bash
# Health check endpoints
curl http://localhost:8001/health | jq
curl http://localhost:8002/health | jq  
curl http://localhost:8003/health | jq

# Docker service status
docker-compose ps
docker stats
```

### RabbitMQ Monitoring
```bash
# Management UI
open https://rmq-dev.iehp.org:15672

# Queue depths and message rates
# Exchange message routing
# Consumer connections
```

### Log Analysis
```bash
# Service logs
docker-compose logs -f --tail=100 hl7-processing
docker-compose logs -f --tail=100 risk-prediction
docker-compose logs -f --tail=100 care-orchestration

# Filter for errors
docker-compose logs | grep ERROR
```

### Performance Metrics
```bash
# Message processing times
# Queue depths and throughput
# Service response times
# Resource utilization
```

## 🚨 Troubleshooting

### Common Issues

**RabbitMQ Connection Failed**
```bash
# Check network connectivity
ping rmq-dev.iehp.org

# Verify SSL certificate
openssl s_client -connect rmq-dev.iehp.org:5671

# Check credentials and vhost
```

**Service Won't Start**
```bash
# Check port conflicts
netstat -tulpn | grep :8001

# Check Docker resources
docker system df
docker system prune

# Rebuild containers
docker-compose build --no-cache
```

**Models Not Loading**
```bash
# Check model files
ls -la services/risk-prediction/models/

# Check MLflow connection
curl http://localhost:5000/

# Check model format compatibility
```

**Message Processing Stuck**
```bash
# Check queue depths
# Restart consumer services
docker-compose restart hl7-processing

# Check dead letter queues
# Verify message format
```

## 📊 Performance Expectations

### Processing Throughput
- **HL7 Processing**: 10-50 messages/minute
- **Risk Prediction**: 100-500 predictions/minute  
- **Care Orchestration**: 50-200 care gaps/minute
- **Dashboard Updates**: Real-time (<2 seconds)

### Resource Requirements
- **CPU**: 4-8 cores recommended
- **Memory**: 8-16 GB RAM
- **Storage**: 10-50 GB for logs and data
- **Network**: Stable connection to IEHP infrastructure

### Scalability Targets
- **Current**: 1K messages/day, 10K members
- **Production**: 10K messages/day, 1.6M members
- **Horizontal Scaling**: Kubernetes deployment ready

## 🔐 Security Considerations

### Data Protection
- Manual de-identification for demo
- TLS encryption for all communications
- No PHI in logs or error messages
- Secure credential management

### Network Security
- VPN connection to IEHP infrastructure
- Firewall rules for service communication
- SSL/TLS for RabbitMQ connections
- API authentication and authorization

### Compliance
- HIPAA-compliant data handling
- Audit logging for all data access
- Secure development practices
- Regular security assessments

## 📈 Success Metrics

### Technical Metrics
- [ ] All services healthy and responsive
- [ ] End-to-end message flow working
- [ ] Real-time dashboard updates
- [ ] FHIR resources created correctly

### Business Metrics
- [ ] Care gaps identified accurately
- [ ] Risk predictions align with clinical expectations
- [ ] Provider workflow integration demonstrated
- [ ] Population health insights generated

### Demo Readiness
- [ ] 3 complete demo scenarios working
- [ ] Professional dashboard interface
- [ ] Real-time processing demonstration
- [ ] FHIR compliance validation

This deployment guide provides everything needed to get the HEDIS AI Platform running in 5 days with production-ready architecture!
