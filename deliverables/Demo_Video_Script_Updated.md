# HL7 AI Challenge 2025 Demo Video Script (UPDATED)
## AI-Powered HEDIS Care Gap Closure Platform

**Total Duration:** ≤10:00 (Target: 9:30)  
**Presenter:** Shailesh Dudala  
**Team:** Healthcare AI Innovation Team

---

## **OPENING SEQUENCE (0:00–3:15)**

### **Hook (0:00–0:25)** 
*[Screen: Navigate to "Legacy System • Chase-and-Close" tab at http://localhost:3000]*

**NARRATION (VERBATIM):**
"Imagine Netflix only recommending the movies you watched last year—and guessing your next pick from that stale list. Would you pay $25 a month? Probably not. Now imagine your care is managed the same way—outdated lists, late nudges."

*[Screen: Show Legacy Dashboard with overdue care gaps, focus on Sarah's 44 days overdue]*

### **Bridge (0:25–0:45)**
*[Screen: Split screen or transition from Legacy to modern dashboard]*

**NARRATION (VERBATIM):**
"Healthcare is catching up. We built a **multi-layered, AI-enabled HEDIS care-gap platform** that flips the model from **chase-and-close** to **predict-and-prevent**."

*[Screen: Navigate to "Population Health • For Payers" tab to show modern platform]*

### **Set the Stage (0:45–0:55)**
*[Screen: Focus on Sarah's record in the legacy dashboard]*

**NARRATION (VERBATIM):**
"Let me make it real with one member story."

### **Sarah's Story (0:55–1:45)**
*[Screen: Click on Sarah Johnson in Legacy Dashboard to show her timeline]*

**NARRATION (VERBATIM):**
"Meet Sarah. Her **Colorectal Cancer Screening (COL)** was due on **November 17**. In today's workflow, a care coordinator gets a queue task, manually reviews charts, and chases calls between the member, PCP, and specialist. That cycle averages **~45 days**. Sarah completed the screening—**after** the due date. For COL, that's non-compliant."

*[Screen: Point to timeline showing Nov 17 due date → Dec 31 completion = 44 days late, NON-COMPLIANT stamp]*

### **Why This Keeps Happening (1:45–2:15)**
*[Screen: Show the manual workflow elements in legacy dashboard]*

**NARRATION (VERBATIM):**
"HEDIS measures help improve quality, but they can be operationally heavy. The member often learns about a gap **after** it's due. With **HL7/FHIR** standardizing data pipes—and **AI** on top—we can surface near real-time insights before deadlines slip."

*[Screen: Highlight manual processes: chart review, phone calls, coordinator assignments]*

### **Enter the Platform (2:15–3:00)**
*[Screen: Transition to modern "Population Health • For Payers" dashboard]*

**NARRATION (VERBATIM):**
"Our **HEDIS AI Platform** starts with HEDIS but generalizes to any **Pay-for-Performance** measure. It ingests HL7/FHIR R4 data **and** unstructured evidence like PDFs and care-management notes. A **GenAI extraction layer** turns free-text into structured proof of compliance; a **predictive layer** flags members most at risk of **future non-compliance**, so outreach is focused and fewer calls are needed."

*[Screen: Show modern dashboard with 1,260+ members, 95.3% evidence found, AI processing]*

### **Segue to Live Demo (3:00–3:15)**
*[Screen: Modern dashboard fully loaded]*

**NARRATION (VERBATIM):**
"Let's walk through an end-to-end run for a coordinator, a provider, and the member—using **synthetic** data."

*[Screen: Dashboard at http://localhost:3000 ready for main demo]*

---

## **UPDATED DEMO FLOW COMMANDS**

### **Opening Sequence Navigation:**

#### **Step 1: Start with Legacy Dashboard (0:00-1:45)**
```javascript
// Navigate to Legacy System tab
document.querySelector('[data-audience="demo"]').click();

// Wait for Legacy Dashboard to load
// Point to key elements:
// - "127 Open Care Gaps"
// - "45 Avg Days to Close" 
// - "Manual Chart Review"

// Click on Sarah Johnson task
document.querySelector('[data-member="Sarah Johnson"]').click();

// Show Sarah's timeline:
// - Nov 17: Due date
// - Dec 31: Completed (44 days late)
// - NON-COMPLIANT status
```

#### **Step 2: Transition to Modern Platform (1:45-3:15)**
```javascript
// Navigate to Population Health tab
document.querySelector('[data-audience="payer"]').click();

// Wait for modern dashboard load
// Highlight contrast:
// - 1,260+ members processed
// - 95.3% automated evidence
// - 7-day intervention windows
// - Proactive risk prediction
```

### **Key Talking Points for Opening:**

#### **Legacy Dashboard Highlights:**
- **127 open care gaps** with 0 days remaining
- **45-day average** closure time
- **Manual processes:** Chart review, phone calls, coordinator assignments
- **Sarah's story:** Nov 17 due → Dec 31 completed = 44 days late = NON-COMPLIANT

#### **Modern Platform Contrast:**
- **1,260+ members** processed automatically
- **95.3% evidence identification** rate
- **7-day intervention** windows for HIGH risk
- **Predict-and-prevent** vs chase-and-close

### **Visual Storytelling:**
1. **Legacy Dashboard** shows the problem: reactive, manual, late interventions
2. **Modern Dashboard** shows the solution: proactive, automated, early interventions
3. **Sarah's Timeline** provides concrete example of 45-day cycle failure
4. **AI Platform** demonstrates how to prevent Sarah's story from repeating

---

## **CONTINUE WITH EXISTING DEMO SCENES (3:15-9:30)**

*[All remaining scenes follow the original script from Scene 1: Population Health Overview onwards]*

### **Scene 1: Population Health Overview (3:15–4:15)** - **[FUNCTIONAL]**
*[Continue with existing script...]*

### **Scene 2: Provider Clinical Decision Support (4:15–5:15)** - **[FUNCTIONAL]**
*[Continue with existing script...]*

### **Scene 3: Live Processing Demo (5:15–6:30)** - **[TECHNICAL]**
*[Continue with existing script...]*

### **Scene 4: Platform Metrics (6:30–7:15)** - **[TECHNICAL]**
*[Continue with existing script...]*

### **Scene 5: Security & Privacy (7:15–8:00)** - **[CONTEXTUAL]**
*[Continue with existing script...]*

### **Scene 6: Outcomes & ROI (8:00–8:45)** - **[FUNCTIONAL]**
*[Continue with existing script...]*

### **Scene 7: Architecture Deep Dive (8:45–9:15)** - **[TECHNICAL]**
*[Continue with existing script...]*

### **Scene 8: Roadmap & Close (9:15–9:30)**
*[Continue with existing script...]*

---

## **UPDATED TECHNICAL SETUP**

### **Pre-Demo Checklist:**
```bash
# 1. Start all services
docker-compose up -d

# 2. Verify Legacy Dashboard loads
curl http://localhost:3000
# Navigate to "Legacy System • Chase-and-Close" tab

# 3. Verify modern dashboard loads
# Navigate to "Population Health • For Payers" tab

# 4. Test navigation between tabs
# Ensure smooth transitions for demo flow
```

### **Demo Navigation Flow:**
1. **Start:** Legacy Dashboard (Chase-and-Close)
2. **Transition:** Population Health (Predict-and-Prevent)
3. **Continue:** Provider Intelligence → Live Demo → Metrics → etc.

### **Key Contrasts to Highlight:**
- **Legacy:** 127 gaps, 45 days, manual, reactive
- **Modern:** 1,260+ members, 7 days, automated, proactive
- **Sarah's Story:** NON-COMPLIANT → Prevented with AI prediction

This updated script provides a compelling narrative arc from problem (legacy chase-and-close) to solution (AI-powered predict-and-prevent) using Sarah's concrete example throughout.
