# Demo Assets Checklist
## AI-Powered HEDIS Care Gap Closure Platform

**Demo Date:** HL7 AI Challenge 2025  
**Duration:** ≤10:00 minutes  
**Environment:** Local development with synthetic data

---

## **PRE-RECORDING SETUP CHECKLIST**

### **1. System Environment Setup**

#### **Docker Services (CRITICAL)**
```bash
# Navigate to project root
cd C:\Users\shail\source\hl7-ai-challenge

# Start all services (allow 2-3 minutes for full startup)
docker-compose up -d

# Verify all services are healthy
docker-compose ps

# Expected services running:
# ✅ postgres (port 5432)
# ✅ redis (port 6379) 
# ✅ rabbitmq (port 5672)
# ✅ hl7-processing (port 8001)
# ✅ risk-prediction (port 8002)
# ✅ care-orchestration (port 8003)
# ✅ dashboard (port 3000)
# ✅ smart-app (port 3002)
# ✅ cds-hooks (port 3001)
```

#### **Health Check Verification**
```bash
# Test all service endpoints
curl http://localhost:8001/health  # HL7 Processing
curl http://localhost:8002/health  # Risk Prediction  
curl http://localhost:8003/health  # Care Orchestration
curl http://localhost:3000         # Dashboard
curl http://localhost:3002         # SMART App
curl http://localhost:3001         # CDS Hooks

# All should return 200 OK with healthy status
```

#### **Data Population**
```bash
# Run end-to-end test to populate synthetic data
python demo_end_to_end_test.py

# Expected output:
# ✅ HL7 Processing Service: Healthy
# ✅ Risk Prediction Service: Healthy
# ✅ Care Orchestration Service: Healthy
# ✅ Dashboard: Accessible
# ✅ End-to-end workflow: Success
```

### **2. Browser Configuration**

#### **Chrome Setup (RECOMMENDED)**
- **URL:** http://localhost:3000
- **Window:** Maximized (1920x1080 minimum)
- **Zoom:** 100% (Ctrl+0 to reset)
- **Extensions:** Disable ad blockers, password managers
- **Cache:** Clear browser cache (Ctrl+Shift+Delete)
- **Bookmarks:** Hide bookmarks bar for clean recording

#### **Browser Tabs (Pre-opened)**
```
Tab 1: http://localhost:3000 (Main Dashboard)
Tab 2: http://localhost:3000 (Backup)
Tab 3: Architecture diagrams (if needed)
```

### **3. Recording Software Setup**

#### **OBS Studio Configuration**
- **Scene:** Browser window capture
- **Resolution:** 1920x1080
- **FPS:** 30
- **Audio:** Microphone + system audio (low volume)
- **Hotkeys:** F9 (Start/Stop), F10 (Pause)

#### **Alternative: Built-in Screen Recording**
```bash
# Windows Game Bar
Win + G → Start recording

# PowerPoint Screen Recording
Insert → Screen Recording
```

---

## **DEMO FLOW COMMANDS & ACTIONS**

### **Opening: Legacy Dashboard (0:00–1:45)**

#### **Navigation:**
1. **Load Dashboard:** http://localhost:3000
2. **Click Tab:** "Legacy System • Chase-and-Close" (first tab)
3. **Wait for Load:** ~2-3 seconds for legacy interface

#### **Key Actions:**
```javascript
// Click Legacy System tab
document.querySelector('[data-audience="demo"]').click();

// Point to key metrics
// - 127 Open Care Gaps
// - 45 Avg Days to Close
// - Manual Chart Review

// Click on Sarah Johnson task
document.querySelector('.task-item:first-child').click();

// Show Sarah's timeline in modal
// Point to timeline events:
// - Nov 17: Due date
// - Dec 31: Completed (44 days late)
// - NON-COMPLIANT status
```

#### **Talking Points:**
- "127 care gaps still open with 0 days remaining"
- "45-day average closure time"
- "Manual chart review and phone calls"
- "Sarah's COL due Nov 17, completed Dec 31 - NON-COMPLIANT"

### **Transition: Modern Platform (1:45–3:15)**

#### **Navigation:**
1. **Click Tab:** "Population Health • For Payers"
2. **Wait for Load:** ~2-3 seconds for modern dashboard
3. **Highlight Contrast:** Legacy vs Modern metrics

### **Scene 1: Population Health Overview (3:15–4:15)**

#### **Navigation:**
1. **Already on:** "Population Health • For Payers" tab
2. **Verify Data Load:** ~2-3 seconds for member data refresh

#### **Key Actions:**
```javascript
// Highlight metrics cards (point with cursor)
// - Total Members: 1,260+
// - Evidence Found: 95.3%
// - High Risk: 27 members
// - Processing Success: 99.1%

// Click Evidence Found filter
document.querySelector('[data-filter="evidence-found"]').click();

// Show filtered results (should show ~1,200 members)
// Point to risk distribution chart
// Highlight data sources section
```

#### **Talking Points:**
- "1,260 synthetic members across 3 HEDIS measures"
- "95.3% automated evidence identification"
- "Risk stratification: HIGH (7 days), MEDIUM (45 days), LOW (90 days)"
- "Multi-source data: HL7 ORU/MDM, FHIR R4, Claims, Labs"

### **Scene 2: Provider Clinical Decision Support (4:15–5:15)**

#### **Navigation:**
```javascript
// Click Provider tab
document.querySelector('[data-view="provider-intelligence"]').click();

// Wait for load (~1-2 seconds)
// Should show SMART on FHIR interface
```

#### **Key Actions:**
```javascript
// Click "View Details" on first high-risk patient (Sarah)
document.querySelector('.patient-card[data-risk="HIGH"]').click();

// Show patient details modal
// Point to:
// - Risk score (85%+)
// - Evidence sources
// - AI rationale
// - Clinical recommendations
```

#### **Talking Points:**
- "SMART on FHIR integration with OAuth2 scopes"
- "Patient-specific care gap identification"
- "AI rationale with 95% confidence scoring"
- "CDS Hooks integration for real-time alerts"

### **Scene 3: Live Processing Demo (5:15–6:30)**

#### **Navigation:**
```javascript
// Click Live Demo tab
document.querySelector('[data-view="live-demo"]').click();

// Wait for component load
```

#### **Key Actions:**
```javascript
// Click "Start Demo Processing" button
document.querySelector('.demo-start-button').click();

// Watch processing pipeline (auto-animated)
// Steps will highlight automatically:
// 1. HL7 Message Input
// 2. spaCy NLP Processing  
// 3. LLaMA 3.2 RAG Extraction
// 4. XGBoost Risk Prediction
// 5. FHIR Resource Creation
```

#### **Timing:**
- **Processing Duration:** ~15-20 seconds
- **Narration During:** Explain each step as it highlights
- **Completion:** Show final FHIR resources created

#### **Talking Points:**
- "HL7 v2.x message processing"
- "Multi-modal AI: spaCy + LLaMA 3.2 + XGBoost"
- "Microservices on ports 8001, 8002, 8003"
- "Sub-3-second processing time"
- "FHIR R4 resource creation"

### **Scene 4: Platform Metrics (6:30–7:15)**

#### **Navigation:**
```javascript
// Click Platform Metrics tab
document.querySelector('[data-view="metrics"]').click();
```

#### **Key Actions:**
```javascript
// Point to real-time metrics cards
// Highlight processing trends chart
// Show evidence source distribution
// Point to infrastructure health indicators
```

#### **Talking Points:**
- "1,247 messages processed, 95.2% success rate"
- "1.1-second average processing time"
- "Multi-standard data processing"
- "99.1% FHIR compliance"
- "Production-ready performance"

### **Scene 5: Security & Privacy (7:15–8:00)**

#### **Visual Assets:**
```
// Show security configuration (if available in UI)
// Or overlay security diagram
// Highlight synthetic data disclaimer
```

#### **Talking Points:**
- "Defense-in-depth security architecture"
- "OAuth2 SMART scopes, TLS 1.3 encryption"
- "HIPAA compliance framework"
- "100% synthetic data - no PHI"
- "AI ethics: bias testing, human-in-the-loop"

### **Scene 6: Outcomes & ROI (8:00–8:45)**

#### **Navigation:**
```javascript
// Return to Population Health tab
document.querySelector('[data-view="care-management"]').click();

// Highlight key metrics again
// Point to ROI indicators
```

#### **Talking Points:**
- "$1.7 million demonstrated ROI"
- "95.3% automated evidence vs manual review"
- "7-day vs 45-day intervention cycles"
- "162 proactive care gaps identified"
- "1.6M member population scalability"

---

## **RESET PROCEDURES BETWEEN TAKES**

### **Quick Reset (30 seconds)**
```bash
# Refresh browser
Ctrl + F5

# Wait for dashboard reload
# Verify all data is populated
```

### **Full Reset (2 minutes)**
```bash
# Restart dashboard service only
docker-compose restart dashboard

# Wait for service health
curl http://localhost:3000

# Refresh browser
```

### **Complete Reset (5 minutes)**
```bash
# Restart all services
docker-compose down
docker-compose up -d

# Wait for all services healthy
docker-compose ps

# Re-run data population
python demo_end_to_end_test.py

# Refresh browser
```

---

## **BACKUP ASSETS & FALLBACKS**

### **Pre-recorded Segments**
```
/deliverables/backup_videos/
├── live_processing_demo.mp4     # Scene 3 backup
├── architecture_overview.mp4    # Scene 7 backup
├── dashboard_navigation.mp4     # General navigation
└── full_demo_silent.mp4         # Complete silent version
```

### **Static Screenshots**
```
/deliverables/screenshots/
├── population_health_overview.png
├── provider_intelligence.png
├── live_processing_steps.png
├── platform_metrics.png
├── architecture_diagram.png
└── roi_metrics.png
```

### **Architecture Diagrams**
```
/deliverables/
├── Architecture_HL.mmd          # High-level architecture
├── Architecture_LL.mmd          # Low-level components  
├── Data_Flow.mmd               # Sequence diagram
└── architecture_images/        # PNG exports if needed
```

---

## **TROUBLESHOOTING GUIDE**

### **Service Issues**
```bash
# Check service logs
docker-compose logs dashboard
docker-compose logs hl7-processing
docker-compose logs risk-prediction

# Common fixes
docker-compose restart [service-name]
docker system prune -f  # If disk space issues
```

### **Browser Issues**
```bash
# Clear cache and reload
Ctrl + Shift + Delete → Clear cache
Ctrl + F5 → Hard refresh

# Disable extensions
Chrome → Settings → Extensions → Disable all

# Incognito mode
Ctrl + Shift + N
```

### **Network Issues**
```bash
# Check port availability
netstat -an | findstr :3000
netstat -an | findstr :8001

# Restart Docker Desktop
# Windows: Restart Docker Desktop application
```

### **Performance Issues**
```bash
# Check system resources
Task Manager → Performance tab

# Free up memory
docker system prune -f
Close unnecessary applications
```

---

## **FINAL CHECKLIST BEFORE RECORDING**

### **Technical Verification**
- [ ] All 8 Docker services running and healthy
- [ ] Dashboard loads at http://localhost:3000
- [ ] All navigation tabs functional
- [ ] Live processing demo works
- [ ] Synthetic data populated (1,260+ members)
- [ ] Browser optimized for recording
- [ ] Recording software configured
- [ ] Audio levels tested

### **Content Verification**
- [ ] Demo script reviewed and timed
- [ ] Key talking points memorized
- [ ] Architecture diagrams accessible
- [ ] Backup assets prepared
- [ ] Reset procedures tested
- [ ] Troubleshooting guide reviewed

### **Recording Environment**
- [ ] Quiet environment for audio
- [ ] Good lighting for presenter (if on camera)
- [ ] Stable internet connection
- [ ] Phone on silent
- [ ] Notifications disabled
- [ ] Backup power source

### **Post-Recording**
- [ ] Video quality check (1920x1080, clear audio)
- [ ] Duration verification (≤10:00)
- [ ] Content accuracy review
- [ ] Export in required format
- [ ] Backup copy saved

**Ready to record! 🎬**
