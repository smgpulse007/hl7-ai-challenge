# Deployment Runbook
## AI-Powered HEDIS Care Gap Closure Platform

**HL7 AI Challenge 2025 Submission**  
**Version: 1.0**  
**Date: August 2025**

---

## Quick Start Guide

### Prerequisites
- **Docker:** Version 20.10+ with Docker Compose
- **System Requirements:** 8GB RAM, 4 CPU cores, 50GB disk space
- **Network:** Internet access for container downloads
- **Ports:** 3000, 3001, 3002, 5000, 5432, 5672, 6379, 8001-8003, 8080

### One-Command Deployment
```bash
# Clone repository
git clone https://github.com/smgpulse007/hl7-ai-challenge.git
cd hl7-ai-challenge

# Start all services
docker-compose up -d

# Verify deployment
python demo_end_to_end_test.py

# Access dashboard
open http://localhost:3000
```

### Service Health Check
```bash
# Check all services are running
docker-compose ps

# View service logs
docker-compose logs -f dashboard
docker-compose logs -f hl7-processing
docker-compose logs -f risk-prediction

# Health check endpoints
curl http://localhost:8001/health  # HL7 Processing
curl http://localhost:8002/health  # Risk Prediction
curl http://localhost:8003/health  # Care Orchestration
```

---

## Local Development Deployment

### Environment Setup

#### 1. Clone and Configure
```bash
# Clone repository
git clone https://github.com/smgpulse007/hl7-ai-challenge.git
cd hl7-ai-challenge

# Create environment file
cp .env.example .env

# Edit configuration (optional)
nano .env
```

#### 2. Environment Variables
**File:** `.env`
```bash
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=hedis_ai
DB_USER=postgres
DB_PASSWORD=postgres123

# Message Queue Configuration
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis123

# MLflow Configuration
MLFLOW_TRACKING_URI=http://mlflow:5000

# Security Configuration
JWT_SECRET_KEY=your-secret-key-here
ENCRYPTION_KEY=your-encryption-key-here

# API Configuration
API_GATEWAY_HOST=nginx
API_GATEWAY_PORT=8080
SSL_ENABLED=false
```

#### 3. Build and Start Services
```bash
# Build all services
docker-compose build

# Start infrastructure services first
docker-compose up -d postgres redis rabbitmq

# Wait for infrastructure to be ready
sleep 30

# Start application services
docker-compose up -d hl7-processing risk-prediction care-orchestration

# Start UI services
docker-compose up -d dashboard smart-app cds-hooks

# Start gateway
docker-compose up -d nginx

# Start MLflow (optional)
docker-compose up -d mlflow
```

#### 4. Initialize Database
```bash
# Run database initialization
docker-compose exec postgres psql -U postgres -d hedis_ai -f /docker-entrypoint-initdb.d/init_db.sql

# Verify tables created
docker-compose exec postgres psql -U postgres -d hedis_ai -c "\dt"

# Load sample data
python scripts/load_sample_data.py
```

#### 5. Verify Deployment
```bash
# Run end-to-end test
python demo_end_to_end_test.py

# Expected output:
# ✅ HL7 Processing Service: Healthy
# ✅ Risk Prediction Service: Healthy  
# ✅ Care Orchestration Service: Healthy
# ✅ Dashboard: Accessible
# ✅ End-to-end workflow: Success
```

### Development Workflow

#### 1. Code Changes
```bash
# Make code changes to services/*/

# Rebuild specific service
docker-compose build hl7-processing

# Restart service
docker-compose restart hl7-processing

# View logs
docker-compose logs -f hl7-processing
```

#### 2. Database Changes
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d hedis_ai

# Run migrations
\i /path/to/migration.sql

# Backup database
docker-compose exec postgres pg_dump -U postgres hedis_ai > backup.sql
```

#### 3. Testing
```bash
# Run unit tests
docker-compose exec hl7-processing python -m pytest tests/

# Run integration tests
python tests/integration_test.py

# Run performance tests
python tests/performance_test.py
```

---

## Production Deployment

### Infrastructure Requirements

#### 1. Kubernetes Cluster
```yaml
# Minimum cluster specifications
apiVersion: v1
kind: Namespace
metadata:
  name: hedis-ai-platform

---
# Resource quotas
apiVersion: v1
kind: ResourceQuota
metadata:
  name: hedis-ai-quota
  namespace: hedis-ai-platform
spec:
  hard:
    requests.cpu: "8"
    requests.memory: 16Gi
    limits.cpu: "16" 
    limits.memory: 32Gi
    persistentvolumeclaims: "10"
```

#### 2. Persistent Storage
```yaml
# PostgreSQL persistent volume
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: hedis-ai-platform
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
  storageClassName: fast-ssd

---
# Redis persistent volume
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: hedis-ai-platform
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

### Kubernetes Deployment

#### 1. Deploy Infrastructure Services
```bash
# Create namespace
kubectl create namespace hedis-ai-platform

# Deploy PostgreSQL
kubectl apply -f k8s/postgres-deployment.yaml

# Deploy Redis
kubectl apply -f k8s/redis-deployment.yaml

# Deploy RabbitMQ
kubectl apply -f k8s/rabbitmq-deployment.yaml

# Wait for infrastructure
kubectl wait --for=condition=ready pod -l app=postgres -n hedis-ai-platform --timeout=300s
```

#### 2. Deploy Application Services
```bash
# Deploy HL7 Processing Service
kubectl apply -f k8s/hl7-processing-deployment.yaml

# Deploy Risk Prediction Service  
kubectl apply -f k8s/risk-prediction-deployment.yaml

# Deploy Care Orchestration Service
kubectl apply -f k8s/care-orchestration-deployment.yaml

# Deploy Dashboard
kubectl apply -f k8s/dashboard-deployment.yaml

# Deploy API Gateway
kubectl apply -f k8s/nginx-deployment.yaml
```

#### 3. Configure Ingress
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hedis-ai-ingress
  namespace: hedis-ai-platform
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.hedis-platform.com
    secretName: hedis-ai-tls
  rules:
  - host: api.hedis-platform.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
```

#### 4. Deploy Monitoring
```bash
# Deploy Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace hedis-ai-platform \
  --set grafana.adminPassword=admin123

# Deploy custom dashboards
kubectl apply -f k8s/monitoring/grafana-dashboards.yaml

# Deploy alerting rules
kubectl apply -f k8s/monitoring/prometheus-rules.yaml
```

### Production Configuration

#### 1. Security Hardening
```yaml
# security-policy.yaml
apiVersion: v1
kind: SecurityContext
metadata:
  name: hedis-ai-security-context
spec:
  runAsNonRoot: true
  runAsUser: 1000
  runAsGroup: 1000
  fsGroup: 1000
  seccompProfile:
    type: RuntimeDefault
  capabilities:
    drop:
    - ALL
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
```

#### 2. Network Policies
```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: hedis-ai-network-policy
  namespace: hedis-ai-platform
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: hedis-ai-platform
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: hedis-ai-platform
  - to: []
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
```

#### 3. Secrets Management
```bash
# Create secrets
kubectl create secret generic db-credentials \
  --from-literal=username=postgres \
  --from-literal=password=secure-password \
  --namespace hedis-ai-platform

kubectl create secret generic api-keys \
  --from-literal=jwt-secret=secure-jwt-secret \
  --from-literal=encryption-key=secure-encryption-key \
  --namespace hedis-ai-platform

# Create TLS certificates
kubectl create secret tls hedis-ai-tls \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  --namespace hedis-ai-platform
```

### High Availability Configuration

#### 1. Multi-Replica Deployment
```yaml
# hl7-processing-ha.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hl7-processing
  namespace: hedis-ai-platform
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: hl7-processing
  template:
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - hl7-processing
              topologyKey: kubernetes.io/hostname
```

#### 2. Database High Availability
```bash
# Deploy PostgreSQL with replication
helm install postgres-ha bitnami/postgresql-ha \
  --namespace hedis-ai-platform \
  --set postgresql.replicaCount=3 \
  --set postgresql.synchronousCommit=on \
  --set postgresql.numSynchronousReplicas=1
```

#### 3. Load Balancing
```yaml
# load-balancer.yaml
apiVersion: v1
kind: Service
metadata:
  name: hl7-processing-service
  namespace: hedis-ai-platform
spec:
  type: LoadBalancer
  selector:
    app: hl7-processing
  ports:
  - port: 80
    targetPort: 8001
    protocol: TCP
  sessionAffinity: None
```

---

## Cloud Provider Deployments

### AWS Deployment

#### 1. EKS Cluster Setup
```bash
# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create EKS cluster
eksctl create cluster \
  --name hedis-ai-cluster \
  --region us-west-2 \
  --nodegroup-name standard-workers \
  --node-type m5.xlarge \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 10 \
  --managed
```

#### 2. RDS Database
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier hedis-ai-db \
  --db-instance-class db.r5.xlarge \
  --engine postgres \
  --engine-version 13.7 \
  --allocated-storage 100 \
  --storage-type gp2 \
  --storage-encrypted \
  --master-username postgres \
  --master-user-password secure-password \
  --vpc-security-group-ids sg-12345678 \
  --db-subnet-group-name hedis-ai-subnet-group \
  --backup-retention-period 7 \
  --multi-az
```

#### 3. ElastiCache Redis
```bash
# Create ElastiCache Redis cluster
aws elasticache create-replication-group \
  --replication-group-id hedis-ai-redis \
  --description "HEDIS AI Platform Redis Cluster" \
  --num-cache-clusters 3 \
  --cache-node-type cache.r5.large \
  --engine redis \
  --engine-version 6.2 \
  --cache-subnet-group-name hedis-ai-cache-subnet-group \
  --security-group-ids sg-87654321 \
  --at-rest-encryption-enabled \
  --transit-encryption-enabled
```

### Azure Deployment

#### 1. AKS Cluster Setup
```bash
# Create resource group
az group create --name hedis-ai-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group hedis-ai-rg \
  --name hedis-ai-cluster \
  --node-count 3 \
  --node-vm-size Standard_D4s_v3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group hedis-ai-rg --name hedis-ai-cluster
```

#### 2. Azure Database for PostgreSQL
```bash
# Create PostgreSQL server
az postgres server create \
  --resource-group hedis-ai-rg \
  --name hedis-ai-postgres \
  --location eastus \
  --admin-user postgres \
  --admin-password secure-password \
  --sku-name GP_Gen5_4 \
  --storage-size 102400 \
  --ssl-enforcement Enabled
```

### GCP Deployment

#### 1. GKE Cluster Setup
```bash
# Create GKE cluster
gcloud container clusters create hedis-ai-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-4 \
  --enable-autorepair \
  --enable-autoupgrade \
  --enable-autoscaling \
  --min-nodes 1 \
  --max-nodes 10

# Get credentials
gcloud container clusters get-credentials hedis-ai-cluster --zone us-central1-a
```

#### 2. Cloud SQL PostgreSQL
```bash
# Create Cloud SQL instance
gcloud sql instances create hedis-ai-db \
  --database-version POSTGRES_13 \
  --tier db-custom-4-16384 \
  --region us-central1 \
  --storage-type SSD \
  --storage-size 100GB \
  --storage-auto-increase \
  --backup-start-time 03:00
```

---

## Monitoring and Observability

### Application Monitoring

#### 1. Health Check Endpoints
```python
# Health check implementation in each service
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "hl7-processing",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "dependencies": {
            "database": check_database_connection(),
            "redis": check_redis_connection(),
            "rabbitmq": check_rabbitmq_connection()
        }
    }

@app.get("/metrics")
async def metrics():
    return {
        "requests_total": request_counter.get(),
        "requests_duration_seconds": request_duration.get(),
        "active_connections": active_connections.get(),
        "error_rate": error_rate.get()
    }
```

#### 2. Prometheus Metrics
```yaml
# prometheus-config.yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
- job_name: 'hedis-ai-services'
  static_configs:
  - targets:
    - 'hl7-processing:8001'
    - 'risk-prediction:8002'
    - 'care-orchestration:8003'
  metrics_path: /metrics
  scrape_interval: 30s
```

#### 3. Grafana Dashboards
```json
{
  "dashboard": {
    "title": "HEDIS AI Platform Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph", 
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      }
    ]
  }
}
```

### Log Management

#### 1. Centralized Logging
```yaml
# fluentd-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      format json
    </source>
    
    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch.logging.svc.cluster.local
      port 9200
      index_name hedis-ai-logs
    </match>
```

#### 2. Log Aggregation
```bash
# Deploy ELK stack
helm install elasticsearch elastic/elasticsearch \
  --namespace logging \
  --set replicas=3

helm install kibana elastic/kibana \
  --namespace logging \
  --set service.type=LoadBalancer

helm install logstash elastic/logstash \
  --namespace logging
```

### Alerting

#### 1. Prometheus Alerting Rules
```yaml
# alerting-rules.yaml
groups:
- name: hedis-ai-alerts
  rules:
  - alert: ServiceDown
    expr: up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Service {{ $labels.instance }} is down"
      
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High error rate on {{ $labels.service }}"
      
  - alert: DatabaseConnectionFailure
    expr: database_connections_failed_total > 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Database connection failures detected"
```

#### 2. Notification Channels
```yaml
# alertmanager-config.yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@hedis-platform.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
- name: 'web.hook'
  email_configs:
  - to: 'ops-team@hedis-platform.com'
    subject: 'HEDIS AI Platform Alert'
    body: |
      {{ range .Alerts }}
      Alert: {{ .Annotations.summary }}
      Description: {{ .Annotations.description }}
      {{ end }}
```

---

## Backup and Recovery

### Database Backup

#### 1. Automated Backups
```bash
#!/bin/bash
# backup-script.sh

# Database backup
BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# PostgreSQL backup
docker-compose exec postgres pg_dump -U postgres hedis_ai > $BACKUP_DIR/hedis_ai_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip $BACKUP_DIR/hedis_ai_*.sql

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/ s3://hedis-ai-backups/$(date +%Y%m%d)/ --recursive

# Cleanup old backups (keep 30 days)
find /backups -type d -mtime +30 -exec rm -rf {} \;
```

#### 2. Point-in-Time Recovery
```bash
# Restore from backup
RESTORE_DATE="2025-08-15"
BACKUP_FILE="hedis_ai_20250815_120000.sql.gz"

# Download backup
aws s3 cp s3://hedis-ai-backups/$RESTORE_DATE/$BACKUP_FILE ./

# Decompress
gunzip $BACKUP_FILE

# Restore database
docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS hedis_ai;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE hedis_ai;"
docker-compose exec postgres psql -U postgres hedis_ai < hedis_ai_20250815_120000.sql
```

### Disaster Recovery

#### 1. Multi-Region Setup
```yaml
# disaster-recovery.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: dr-config
data:
  primary_region: "us-west-2"
  secondary_region: "us-east-1"
  rpo_minutes: "15"  # Recovery Point Objective
  rto_minutes: "60"  # Recovery Time Objective
```

#### 2. Failover Procedures
```bash
#!/bin/bash
# failover-script.sh

# Check primary region health
if ! curl -f http://primary-region-lb/health; then
    echo "Primary region unhealthy, initiating failover"
    
    # Update DNS to point to secondary region
    aws route53 change-resource-record-sets \
        --hosted-zone-id Z123456789 \
        --change-batch file://failover-dns.json
    
    # Scale up secondary region
    kubectl scale deployment --replicas=3 -n hedis-ai-platform
    
    # Notify operations team
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"Failover to secondary region initiated"}' \
        $SLACK_WEBHOOK_URL
fi
```

---

## Troubleshooting Guide

### Common Issues

#### 1. Service Startup Failures
```bash
# Check service logs
docker-compose logs hl7-processing

# Common issues and solutions:
# - Database connection timeout: Check DB_HOST environment variable
# - Port already in use: Check for conflicting services
# - Memory issues: Increase Docker memory allocation
# - Missing dependencies: Rebuild container images
```

#### 2. Database Connection Issues
```bash
# Test database connectivity
docker-compose exec postgres psql -U postgres -c "SELECT 1;"

# Check connection pool
docker-compose exec hl7-processing python -c "
import psycopg2
conn = psycopg2.connect('postgresql://postgres:postgres123@postgres:5432/hedis_ai')
print('Database connection successful')
"
```

#### 3. Message Queue Issues
```bash
# Check RabbitMQ status
docker-compose exec rabbitmq rabbitmqctl status

# Check queue lengths
docker-compose exec rabbitmq rabbitmqctl list_queues

# Purge stuck queues
docker-compose exec rabbitmq rabbitmqctl purge_queue hl7.processing.queue
```

#### 4. Performance Issues
```bash
# Check resource usage
docker stats

# Check database performance
docker-compose exec postgres psql -U postgres -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
"

# Check Redis memory usage
docker-compose exec redis redis-cli info memory
```

### Emergency Procedures

#### 1. Service Recovery
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart hl7-processing

# Force rebuild and restart
docker-compose build hl7-processing
docker-compose up -d hl7-processing
```

#### 2. Data Recovery
```bash
# Restore from latest backup
./scripts/restore-backup.sh latest

# Restore from specific date
./scripts/restore-backup.sh 2025-08-15
```

#### 3. Emergency Contacts
```
Primary On-Call: +1-555-0123
Secondary On-Call: +1-555-0124
Database Admin: +1-555-0125
Security Team: +1-555-0126
```

---

## Maintenance Procedures

### Regular Maintenance

#### 1. Weekly Tasks
```bash
# Update container images
docker-compose pull
docker-compose up -d

# Clean up unused images
docker image prune -f

# Check disk space
df -h

# Review logs for errors
docker-compose logs --since 7d | grep ERROR
```

#### 2. Monthly Tasks
```bash
# Update dependencies
pip-review --auto

# Security scan
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
    aquasec/trivy image hedis-ai-platform:latest

# Performance review
python scripts/performance-report.py
```

#### 3. Quarterly Tasks
```bash
# Full system backup
./scripts/full-backup.sh

# Disaster recovery test
./scripts/dr-test.sh

# Security audit
./scripts/security-audit.sh

# Capacity planning review
./scripts/capacity-report.py
```

---

## Support and Documentation

### Getting Help
- **Documentation:** https://github.com/smgpulse007/hl7-ai-challenge/wiki
- **Issues:** https://github.com/smgpulse007/hl7-ai-challenge/issues
- **Discussions:** https://github.com/smgpulse007/hl7-ai-challenge/discussions

### Additional Resources
- **HL7 FHIR Specification:** https://hl7.org/fhir/R4/
- **SMART on FHIR:** https://docs.smarthealthit.org/
- **CDS Hooks:** https://cds-hooks.org/
- **Docker Documentation:** https://docs.docker.com/
- **Kubernetes Documentation:** https://kubernetes.io/docs/

This runbook provides comprehensive deployment and operational guidance for the AI-Powered HEDIS Care Gap Closure Platform across development, staging, and production environments.
