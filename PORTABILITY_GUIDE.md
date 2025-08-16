# HEDIS AI Platform - Portability Guide

## ✅ **Platform Independence Verification**

The HEDIS AI Platform is now **100% portable** and independent of IEHP infrastructure. All external dependencies have been removed or made configurable.

---

## 🔧 **Fixed Dependencies**

### **✅ RabbitMQ Configuration**
- **Before**: Hardcoded `rmq-dev.iehp.org:5671` (SSL)
- **After**: Configurable via environment variables, defaults to `localhost:5672` (non-SSL)
- **Docker**: Includes local RabbitMQ container with management UI

### **✅ MLflow Configuration**
- **Before**: Hardcoded `pvposwbc02.iehp.local:8000`
- **After**: Configurable via `MLFLOW_TRACKING_URI`, defaults to `localhost:5000`
- **Note**: MLflow is optional for demo purposes

### **✅ Database Configuration**
- **Before**: Production configs pointed to `prod-db.iehp.local`
- **After**: All environments default to `localhost` with Docker containers

### **✅ All External References Removed**
- No hardcoded IEHP URLs or hostnames
- No IEHP-specific data dependencies
- No IEHP network requirements

---

## 🚀 **Quick Setup on New Machine**

### **Prerequisites**
```bash
# Required software
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- Git
- 8GB+ RAM recommended
- 10GB+ free disk space
```

### **Step 1: Clone Repository**
```bash
git clone <repository-url>
cd hedis-ai-platform
```

### **Step 2: Start Platform**
```bash
# Start all services (includes local RabbitMQ, PostgreSQL, Redis)
docker-compose up -d

# Wait for services to be ready (30-60 seconds)
docker-compose ps

# Verify all services are healthy
docker-compose logs --tail 10
```

### **Step 3: Setup RabbitMQ Queues**
```bash
# Setup message queues (one-time setup)
python setup_rabbitmq.py
```

### **Step 4: Verify Installation**
```bash
# Run end-to-end demo test
python demo_end_to_end_test.py

# Expected output: 100% success rate
```

### **Step 5: Access Dashboard**
```bash
# Open browser to dashboard
http://localhost:3000
```

---

## 🌐 **Service Endpoints**

| Service | URL | Purpose |
|---------|-----|---------|
| Dashboard | http://localhost:3000 | Main UI |
| HL7 Processing | http://localhost:8001 | Message processing |
| Risk Prediction | http://localhost:8002 | ML predictions |
| Care Orchestration | http://localhost:8003 | FHIR resources |
| RabbitMQ Management | http://localhost:15672 | Queue management |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |

---

## ⚙️ **Environment Variables**

All external dependencies are configurable via environment variables:

### **RabbitMQ**
```bash
RABBITMQ_HOST=localhost          # Default: localhost
RABBITMQ_PORT=5672              # Default: 5672
RABBITMQ_USER=ml-predictor      # Default: ml-predictor
RABBITMQ_PASSWORD=P@ssPr3dictor # Default: P@ssPr3dictor
RABBITMQ_VHOST=ml-predictor     # Default: ml-predictor
RABBITMQ_SSL_ENABLED=false      # Default: false
```

### **Database**
```bash
DB_HOST=postgres                # Default: postgres (Docker)
DB_PORT=5432                   # Default: 5432
DB_NAME=hedis_ai               # Default: hedis_ai
DB_USER=postgres               # Default: postgres
DB_PASSWORD=password           # Default: password
```

### **MLflow (Optional)**
```bash
MLFLOW_TRACKING_URI=http://localhost:5000/  # Default: localhost:5000
```

---

## 📦 **What's Included**

### **Self-Contained Infrastructure**
- ✅ Local RabbitMQ with management UI
- ✅ PostgreSQL database with initialization
- ✅ Redis cache
- ✅ All microservices
- ✅ React dashboard
- ✅ Nginx reverse proxy

### **Demo Data**
- ✅ 25 synthetic members with realistic data
- ✅ Population analytics
- ✅ Care gap scenarios
- ✅ ROI calculations

### **Test Scripts**
- ✅ End-to-end pipeline validation
- ✅ Integration testing
- ✅ FHIR R4 processing tests
- ✅ RabbitMQ setup verification

---

## 🔍 **Verification Checklist**

Run these commands to verify complete independence:

```bash
# 1. Check for external network dependencies
grep -r "iehp.org" . --exclude-dir=node_modules
grep -r "iehp.local" . --exclude-dir=node_modules
# Should return no results

# 2. Verify all services start locally
docker-compose up -d
docker-compose ps
# All services should show "healthy" status

# 3. Test end-to-end functionality
python demo_end_to_end_test.py
# Should show 100% success rate

# 4. Verify RabbitMQ queues
python integration_test.py
# Should pass RabbitMQ connectivity tests

# 5. Check dashboard accessibility
curl http://localhost:3000
# Should return HTML content
```

---

## 🚨 **Troubleshooting**

### **Port Conflicts**
If ports are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change dashboard port
  - "8081:8001"  # Change HL7 processing port
```

### **Memory Issues**
Minimum requirements:
- 8GB RAM
- 4 CPU cores
- 10GB disk space

### **Docker Issues**
```bash
# Reset Docker environment
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

---

## ✅ **Portability Confirmed**

The platform is now **100% self-contained** and can run on any machine with Docker. No external dependencies, no IEHP infrastructure required, no network connectivity needed beyond initial Docker image downloads.

**Ready for deployment anywhere!** 🎉
