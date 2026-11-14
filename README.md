# HEDIS AI Platform

**HL7 AI Challenge 2025 - Clinical Quality Improvement**

A challenge prototype for exploring event-driven care-gap workflows with HL7/FHIR-style resources, synthetic features, and local demo services.

> Public challenge/demo code using synthetic or sample data only. No PHI/PII. Not a production clinical decision system.

## 🏆 HL7 AI Challenge Submission

**Category:** Clinical Quality Improvement
**Focus:** Solutions that improve care delivery, clinical outcomes, and quality

### Prototype Scope
- **Multi-Standard Processing:** HL7 v2.x → FHIR R4 transformation with AI enhancement
- **Risk-scoring demonstration:** XGBoost loading hooks with synthetic dummy-model fallback
- **Workflow exploration:** FHIR-shaped resources and dashboard examples; SMART/CDS integration is not established by this demo
- **Production-Style Architecture:** Scenario modeling for ROI and quality improvement workflows

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- 8GB+ RAM
- 10GB+ disk space

### Installation
```bash
# Clone repository
git clone https://github.com/smgpulse007/hl7-ai-challenge.git
cd hl7-ai-challenge

# Start all services
docker-compose up -d

# Setup message queues (one-time)
python setup_rabbitmq.py

# Verify installation
python demo_end_to_end_test.py

# Access dashboard
open http://localhost:3000
```

## 🏗️ Architecture

### Microservices
- **HL7 Processing Service** - spaCy matching and Ollama `llama3` prompting for sample evidence extraction
- **Risk Prediction Service** - XGBoost loader and synthetic dummy models when trained artifacts are unavailable
- **Care Orchestration Service** - FHIR R4 resource creation and workflow management
- **Dashboard Service** - Real-time Population Health Intelligence interface

### Infrastructure
- **Message Broker:** RabbitMQ with event-driven processing
- **Database:** PostgreSQL with Redis caching
- **Containerization:** Docker with health monitoring
- **Resource formats explored:** selected HL7 v2.x messages and FHIR R4-style resources

## Demo boundaries and evidence

The checked-in risk service loads external artifacts when configured, otherwise it trains dummy XGBoost classifiers on `make_classification` data. Its message features are generated synthetically. No trained model binaries are included in the public tree; metadata alone does not establish reproducible clinical performance.

The integration scripts exercise a running local stack. They are not load tests, clinical validation, or HL7/FHIR conformance certification. This README makes no measured throughput, latency, reliability, care-gap closure, or ROI claim. Record the commit, environment, inputs, commands, and raw results before publishing a benchmark.

Historical submission documents and dashboard scenarios contain illustrative figures and design aspirations. They should not be treated as verified deployment results or evidence that SMART authorization, CDS Hooks, or full standards support is implemented.

## 🎯 HL7 Standards Showcase

### Input Processing
- **HL7 v2.x Messages:** MDM, ORU, ADT with clinical NLP
- **FHIR R4 Resources:** Patient, DiagnosticReport, Procedure, Encounter

### Output Generation
- **FHIR R4 Resources:** Patient, RiskAssessment, CarePlan, Task

SMART on FHIR authorization and CDS Hooks remain integration goals; an end-to-end conformant implementation is not demonstrated here.

## 📈 Value Proposition

### Questions the demo can help explore
- How can message-derived evidence be routed into a care-management workflow?
- What resource contracts and failure handling would an integration need?
- What data, evaluation, authorization, and workflow review are still needed before deployment?

### Workflow Design
- **Multiple source categories** represented in demo scenarios; live EMR, HIE, claims, lab, and pharmacy integrations are not established here
- **Simulated prioritization** for exploring care-gap workflows
- **Event-driven architecture** using RabbitMQ; capacity has not been benchmarked here
- **Standards-oriented prototype** requiring further validation and EHR integration work

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete setup instructions
- [Portability Guide](PORTABILITY_GUIDE.md) - Platform independence verification
- [HL7 AI Challenge Alignment](HL7_AI_Challenge_Alignment.md) - Evaluation criteria alignment
- [Technical Documentation](docs/) - Detailed architecture and analysis

## 🧪 Testing

```bash
# End-to-end pipeline test
python demo_end_to_end_test.py

# Service integration test
python integration_test.py

# RabbitMQ setup verification
python setup_rabbitmq.py
```

## 🌐 Service Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:3000 | Population Health Intelligence |
| HL7 Processing | http://localhost:8001 | Message processing |
| Risk Prediction | http://localhost:8002 | ML predictions |
| Care Orchestration | http://localhost:8003 | FHIR resources |
| RabbitMQ Management | http://localhost:15672 | Queue management |

## 🏥 Multi-Industry Application

- **Health Plans:** Population health management and Star Ratings optimization
- **Health Systems:** Care coordination and quality improvement
- **Provider Practices:** Panel management and clinical decision support

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions that add reproducible synthetic fixtures, failure-path tests, or documented interoperability validation are welcome. Please keep example data synthetic.

## Portfolio Relevance

Demonstrates a multi-service prototype, selected message/resource parsing, synthetic risk-scoring workflows, and Docker packaging. The next engineering milestone is reproducible integration and failure-path testing, not a claim of clinical readiness.

---

**Built for HL7 AI Challenge 2025** — an exploratory demo, not evidence of measured healthcare outcomes.
