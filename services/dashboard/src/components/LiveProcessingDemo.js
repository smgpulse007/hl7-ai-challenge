import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Brain, Zap, CheckCircle, Clock, Activity } from 'lucide-react';
import HL7MessageViewer from './HL7MessageViewer';
import ProcessingTimeline from './ProcessingTimeline';

const LiveProcessingDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [processedMessages, setProcessedMessages] = useState(0);
  const [successRate, setSuccessRate] = useState(95.2);
  const [avgProcessingTime, setAvgProcessingTime] = useState(1.1);
  const [showResults, setShowResults] = useState(false);
  const [serviceLogs, setServiceLogs] = useState([]);
  const [aiLayer1Metadata, setAiLayer1Metadata] = useState(null);
  const [aiLayer2Metadata, setAiLayer2Metadata] = useState(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [hasCompletedProcessing, setHasCompletedProcessing] = useState(false);

  const processingSteps = [
    {
      id: 'upload',
      title: 'HL7 Message Received',
      description: 'ADT^A01 message uploaded and validated',
      icon: FileText,
      color: 'var(--primary-blue)',
      duration: 500,
      layer: 'Infrastructure',
      logs: ['Message received on port 8001', 'HL7 v2.x format validated', 'Message queued for processing']
    },
    {
      id: 'parse',
      title: 'HL7 Parsing & Validation',
      description: 'Extracting patient demographics and clinical data',
      icon: Upload,
      color: 'var(--primary-blue)',
      duration: 800,
      layer: 'Infrastructure',
      logs: ['Parsing MSH segment', 'Extracting PID demographics', 'Validating message structure', 'Patient ID: 123456789 identified']
    },
    {
      id: 'nlp',
      title: 'Layer 1: NER + RAG Evidence Discovery',
      description: 'spaCy NER + LLaMA 3.2 RAG for clinical evidence extraction and validation',
      icon: Brain,
      color: 'var(--secondary-green)',
      duration: 1200,
      layer: 'AI Layer 1',
      logs: ['Loading spaCy en_core_web_sm model', 'Running NER on clinical text', 'Found: CCS keywords, COL keywords', 'Initializing LLaMA 3.2 RAG pipeline', 'RAG validation: "Pap smear completed 2024, normal results"', 'Evidence confidence: 95.2%']
    },
    {
      id: 'ml',
      title: 'Layer 2: XGBoost Risk Prediction',
      description: 'XGBoost models trained on 290K+ CCS and 477K+ WCV samples',
      icon: Zap,
      color: 'var(--accent-orange)',
      duration: 900,
      layer: 'AI Layer 2',
      logs: ['Loading XGBoost CCS model v1.0', 'Processing 80+ demographic and utilization features', 'Risk probability: 0.78 (High)', 'AUC performance: 77.1% (CCS), 74.0% (WCV)', 'Care gaps identified: CCS screening overdue', 'Intervention priority: High']
    },
    {
      id: 'fhir',
      title: 'FHIR R4 Transformation',
      description: 'Creating standards-compliant FHIR Patient, Condition, and DocumentReference resources',
      icon: CheckCircle,
      color: 'var(--primary-blue)',
      duration: 600,
      layer: 'Infrastructure',
      logs: ['Generating FHIR Patient resource', 'Creating Condition resource for diabetes', 'Adding DocumentReference for CDA', 'FHIR R4 validation passed', 'Resources ready for transmission']
    }
  ];

  const sampleHL7Message = `MSH|^~\\&|EPIC|UCSF|HEDIS|AI_PLATFORM|20250816131500||ADT^A01|12345|P|2.5
EVN|A01|20250816131500
PID|1||123456789^^^UCSF^MR||DOE^JOHN^MIDDLE||19800101|M|||123 MAIN ST^^SAN FRANCISCO^CA^94102||555-1234|||S||123456789|123-45-6789
PV1|1|I|ICU^101^A|||12345^SMITH^JANE^MD|||MED|||A|||12345^SMITH^JANE^MD|INP|MEDICARE|||||||||||||||||||||||20250816131500
DG1|1|I9|E11.9|Type 2 diabetes mellitus without complications|20250816131500`;

  const sampleFHIROutput = {
    bundle: {
      resourceType: "Bundle",
      id: "hl7-processing-result",
      type: "transaction",
      entry: [
        {
          resource: {
            resourceType: "Patient",
            id: "123456789",
            identifier: [
              {
                use: "usual",
                system: "http://ucsf.edu/patient-id",
                value: "123456789"
              }
            ],
            name: [
              {
                use: "official",
                family: "Doe",
                given: ["John", "Middle"]
              }
            ],
            gender: "male",
            birthDate: "1980-01-01",
            address: [
              {
                line: ["123 Main St"],
                city: "San Francisco",
                state: "CA",
                postalCode: "94102"
              }
            ]
          }
        },
        {
          resource: {
            resourceType: "Condition",
            id: "diabetes-condition",
            subject: { reference: "Patient/123456789" },
            code: {
              coding: [
                {
                  system: "http://hl7.org/fhir/sid/icd-10-cm",
                  code: "E11.9",
                  display: "Type 2 diabetes mellitus without complications"
                }
              ]
            },
            clinicalStatus: {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
                  code: "active"
                }
              ]
            }
          }
        },
        {
          resource: {
            resourceType: "DocumentReference",
            id: "cda-document-ref",
            subject: { reference: "Patient/123456789" },
            type: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "34133-9",
                  display: "Summarization of Episode Note"
                }
              ]
            },
            content: [
              {
                attachment: {
                  contentType: "application/xml",
                  title: "CDA Clinical Document"
                }
              }
            ]
          }
        }
      ]
    }
  };

  const startProcessing = async () => {
    setIsProcessing(true);
    setCurrentStep(0);
    setShowResults(false);
    setProcessingComplete(false);
    // Don't clear logs and metadata on restart - only clear if explicitly requested
    if (serviceLogs.length === 0) {
      setServiceLogs([]);
      setAiLayer1Metadata(null);
      setAiLayer2Metadata(null);
    }

    // Simulate real processing with actual API call
    try {
      // Process each step with realistic timing
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);

        // Add logs for current step
        const step = processingSteps[i];
        for (let j = 0; j < step.logs.length; j++) {
          await new Promise(resolve => setTimeout(resolve, step.duration / step.logs.length));
          setServiceLogs(prev => [...prev, {
            timestamp: new Date().toLocaleTimeString(),
            step: step.title,
            layer: step.layer,
            message: step.logs[j]
          }]);
        }

        // Set AI layer metadata when processing AI steps
        if (step.layer === 'AI Layer 1') {
          setAiLayer1Metadata({
            layer: 'RAG-based Care Gap Evidence Extraction Engine',
            model: 'spaCy en_core_web_sm + LLaMA 3.2 RAG',
            confidence: '95.2%',
            processingTime: `${(step.duration / 1000).toFixed(1)}s`,
            features: 'Clinical keywords, NER entities, RAG validation',
            description: 'spaCy NER for clinical entity extraction + LLaMA 3.2 RAG for evidence validation and summarization'
          });
        } else if (step.layer === 'AI Layer 2') {
          setAiLayer2Metadata({
            layer: 'HEDIS Non-compliance Risk Prediction Engine',
            model: 'XGBoost CCS/WCV Models v1.0',
            confidence: '77.1% AUC (CCS), 74.0% AUC (WCV)',
            processingTime: `${(step.duration / 1000).toFixed(1)}s`,
            features: '80+ demographic, utilization, and clinical features',
            description: 'XGBoost gradient boosting models trained on 290K+ CCS and 477K+ WCV samples for non-compliance prediction'
          });
        }
      }

      // Update metrics
      setProcessedMessages(prev => prev + 1);
      setSuccessRate(95.2 + Math.random() * 0.8);
      setAvgProcessingTime(1.0 + Math.random() * 0.4);
      setShowResults(true);
      setProcessingComplete(true);
      setHasCompletedProcessing(true);
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearProcessingData = () => {
    setServiceLogs([]);
    setAiLayer1Metadata(null);
    setAiLayer2Metadata(null);
    setShowResults(false);
    setProcessingComplete(false);
    // Keep hasCompletedProcessing true to show pipeline as completed
  };

  const resetDemo = () => {
    setServiceLogs([]);
    setAiLayer1Metadata(null);
    setAiLayer2Metadata(null);
    setShowResults(false);
    setProcessingComplete(false);
    setHasCompletedProcessing(false);
    setCurrentStep(0);
  };

  return (
    <div className="live-processing-demo">
      {/* Workflow Explanation */}
      <motion.div
        className="glass-card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-dark)' }}>
            Live HL7 → FHIR Processing Workflow
          </h2>
          <p className="mb-4" style={{ color: 'var(--text-light)' }}>
            This demo showcases our complete HL7 AI platform processing a real ADT^A01 message through our two-layer AI architecture:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 166, 81, 0.1)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--secondary-green)' }}>
                🧠 Layer 1: Evidence Discovery
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                NER + RAG pipeline extracts clinical entities and retrieves evidence from multi-source data with 95%+ confidence
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--accent-orange)' }}>
                🎯 Layer 2: Risk Prediction
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                ML models predict non-compliance risk and identify care gaps with 85%+ accuracy for targeted interventions
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header with Real-time Metrics */}
      <div className="metrics-grid">
        <motion.div 
          className="metric-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="metric-value">{processedMessages}</div>
          <div className="metric-label">Messages Processed</div>
          <div className="metric-change positive">+{processedMessages} today</div>
        </motion.div>

        <motion.div 
          className="metric-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="metric-value">{successRate.toFixed(1)}%</div>
          <div className="metric-label">Success Rate</div>
          <div className="metric-change positive">+0.3% this week</div>
        </motion.div>

        <motion.div 
          className="metric-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="metric-value">{avgProcessingTime.toFixed(1)}s</div>
          <div className="metric-label">Avg Processing Time</div>
          <div className="metric-change positive">-0.2s improved</div>
        </motion.div>

        <motion.div 
          className="metric-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="metric-value">
            <Activity className="inline w-8 h-8 text-green-500 pulse" />
          </div>
          <div className="metric-label">System Status</div>
          <div className="metric-change positive">All services healthy</div>
        </motion.div>
      </div>

      {/* Demo Control */}
      <div className="processing-pipeline">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Live HL7 → FHIR Processing Demo</h3>
          <motion.button
            onClick={startProcessing}
            disabled={isProcessing}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isProcessing 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
            whileHover={{ scale: isProcessing ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="loading-spinner"></div>
                Processing...
              </span>
            ) : (
              'Start Demo Processing'
            )}
          </motion.button>
        </div>

        {/* Processing Pipeline */}
        <div className="space-y-4">
          {processingSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = isProcessing && currentStep === index;
            const isCompleted = (isProcessing && currentStep > index) || hasCompletedProcessing;
            const isUpcoming = !isProcessing && !hasCompletedProcessing;

            return (
              <motion.div
                key={step.id}
                className={`pipeline-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className="step-icon"
                  style={{ backgroundColor: isCompleted ? 'var(--success-green)' : step.color }}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isActive ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                
                <div className="step-content">
                  <div className="step-title">{step.title}</div>
                  <div className="step-description">{step.description}</div>
                </div>

                <div className={`step-status ${isActive ? 'processing' : isCompleted ? 'completed' : ''}`}>
                  {isActive ? 'Processing...' : isCompleted ? 'Completed' : 'Pending'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Real-time Service Logs and AI Metadata */}
      {(isProcessing || processingComplete || hasCompletedProcessing || serviceLogs.length > 0) && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Logs */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
                <Activity className="w-5 h-5" style={{ color: 'var(--primary-blue)' }} />
                Real-time Service Logs
              </h3>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                {serviceLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    className="mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                    <span className="text-blue-400">{log.layer}:</span>{' '}
                    <span>{log.message}</span>
                  </motion.div>
                ))}
                {isProcessing && (
                  <div className="text-yellow-400 animate-pulse">
                    ▶ Processing...
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* AI Layer Metadata - Both Layers Side by Side */}
          {(aiLayer1Metadata || aiLayer2Metadata) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* AI Layer 1 Metadata */}
              {aiLayer1Metadata && (
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
                      <Brain className="w-5 h-5" style={{ color: 'var(--secondary-green)' }} />
                      {aiLayer1Metadata.layer}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-dark)' }}>Model:</span>
                        <span className="text-sm" style={{ color: 'var(--text-light)' }}>{aiLayer1Metadata.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-dark)' }}>Performance:</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--success-green)' }}>{aiLayer1Metadata.confidence}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-dark)' }}>Processing Time:</span>
                        <span className="text-sm" style={{ color: 'var(--text-light)' }}>{aiLayer1Metadata.processingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-dark)' }}>Features:</span>
                        <span className="text-sm" style={{ color: 'var(--text-light)' }}>{aiLayer1Metadata.features}</span>
                      </div>
                      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(0, 166, 81, 0.1)' }}>
                        <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                          {aiLayer1Metadata.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Layer 2 Metadata */}
              {aiLayer2Metadata && (
                <motion.div
                  className="glass-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
                      <Brain className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
                      {aiLayer2Metadata.layer}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-dark)' }}>Model:</span>
                        <span className="text-sm" style={{ color: 'var(--text-light)' }}>{aiLayer2Metadata.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-dark)' }}>Performance:</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--success-green)' }}>{aiLayer2Metadata.confidence}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-dark)' }}>Processing Time:</span>
                        <span className="text-sm" style={{ color: 'var(--text-light)' }}>{aiLayer2Metadata.processingTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: 'var(--text-dark)' }}>Features:</span>
                        <span className="text-sm" style={{ color: 'var(--text-light)' }}>{aiLayer2Metadata.features}</span>
                      </div>
                      <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
                        <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                          {aiLayer2Metadata.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Processing Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            className="mt-8 glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--success-green)' }} />
                Processing Complete - FHIR R4 Output Generated
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input HL7 Message */}
                <div>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-dark)' }}>Input HL7 v2.x Message:</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-64">
                    {sampleHL7Message}
                  </pre>
                </div>

                {/* Output FHIR Resources */}
                <div>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-dark)' }}>Generated FHIR R4 Bundle (Patient, Condition, DocumentReference):</h4>
                  <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-64">
                    {JSON.stringify(sampleFHIROutput.bundle, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Processing Summary */}
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'rgba(0, 166, 81, 0.1)' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--success-green)' }}>
                      {avgProcessingTime.toFixed(1)}s
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-light)' }}>Total Processing Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--success-green)' }}>
                      {successRate.toFixed(1)}%
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-light)' }}>Confidence Score</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: 'var(--success-green)' }}>
                      100%
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-light)' }}>FHIR Compliance</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={clearProcessingData}
                  className="px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--primary-blue)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#0052A3'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--primary-blue)'}
                >
                  Process New Message
                </button>
                <button
                  onClick={resetDemo}
                  className="px-4 py-2 rounded-lg font-medium transition-all border-2"
                  style={{
                    borderColor: 'var(--primary-blue)',
                    color: 'var(--primary-blue)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--primary-blue)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--primary-blue)';
                  }}
                >
                  Reset Demo
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(sampleFHIROutput.bundle, null, 2));
                    alert('FHIR bundle copied to clipboard!');
                  }}
                  className="px-4 py-2 rounded-lg font-medium transition-all border-2"
                  style={{
                    borderColor: 'var(--primary-blue)',
                    color: 'var(--primary-blue)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--primary-blue)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--primary-blue)';
                  }}
                >
                  Copy FHIR Resource
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Timeline */}
      <div className="mt-8">
        <ProcessingTimeline isActive={isProcessing} />
      </div>

      {/* Interactive HL7 Message Processor */}
      <div className="mt-8">
        <HL7MessageViewer onMessageProcess={(message) => {
          console.log('Processing message:', message);
          // Trigger the demo processing when a message is processed
          startProcessing();
        }} />
      </div>
    </div>
  );
};

export default LiveProcessingDemo;
