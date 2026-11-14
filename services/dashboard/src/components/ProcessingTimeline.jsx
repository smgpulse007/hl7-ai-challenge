import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Database, 
  Brain, 
  Zap, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Activity,
  AlertTriangle,
  Target
} from 'lucide-react';

const ProcessingTimeline = ({ isActive = false }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const timelineSteps = [
    {
      id: 'receive',
      title: 'Message Received',
      description: 'HL7 v2.x message ingested via API endpoint',
      icon: FileText,
      color: '#0066CC',
      duration: 200,
      details: {
        input: 'HL7 ADT^A01 Message',
        size: '2.4 KB',
        encoding: 'UTF-8',
        validation: 'Passed'
      }
    },
    {
      id: 'parse',
      title: 'HL7 Parsing',
      description: 'Segment parsing and field extraction',
      icon: Database,
      color: '#0066CC',
      duration: 400,
      details: {
        segments: ['MSH', 'EVN', 'PID', 'PV1', 'DG1', 'OBX'],
        fields_extracted: 47,
        validation_errors: 0,
        confidence: '99.2%'
      }
    },
    {
      id: 'nlp',
      title: 'Clinical NLP',
      description: 'Natural language processing of clinical text',
      icon: Brain,
      color: '#FF6B35',
      duration: 800,
      details: {
        entities_found: 12,
        conditions: ['Type 2 Diabetes', 'Hypertension'],
        medications: ['Metformin', 'Lisinopril'],
        confidence: '95.2%'
      }
    },
    {
      id: 'ml',
      title: 'Risk Analysis',
      description: 'ML-based risk prediction and scoring',
      icon: Target,
      color: '#00A651',
      duration: 600,
      details: {
        risk_score: 0.78,
        risk_level: 'HIGH',
        factors: ['Uncontrolled DM', 'Age >65', 'Comorbidities'],
        model_version: 'v2.1.3'
      }
    },
    {
      id: 'gaps',
      title: 'Care Gap Detection',
      description: 'HEDIS quality measure analysis',
      icon: AlertTriangle,
      color: '#F59E0B',
      duration: 500,
      details: {
        measures_evaluated: 8,
        gaps_identified: 3,
        priority_gaps: ['HbA1c Testing', 'Eye Exam'],
        compliance_score: '72%'
      }
    },
    {
      id: 'fhir',
      title: 'FHIR Transformation',
      description: 'Standards-compliant FHIR R4 resource creation',
      icon: Zap,
      color: '#0066CC',
      duration: 300,
      details: {
        resources_created: 5,
        resource_types: ['Patient', 'Condition', 'Observation'],
        validation: 'FHIR R4 Compliant',
        size: '8.7 KB'
      }
    },
    {
      id: 'complete',
      title: 'Processing Complete',
      description: 'Results stored and notifications sent',
      icon: CheckCircle,
      color: '#10B981',
      duration: 200,
      details: {
        total_time: '1.1s',
        success_rate: '100%',
        notifications_sent: 2,
        status: 'SUCCESS'
      }
    }
  ];

  useEffect(() => {
    if (isActive) {
      runProcessingSimulation();
    } else {
      resetTimeline();
    }
  }, [isActive]);

  const runProcessingSimulation = async () => {
    setCompletedSteps([]);
    setCurrentStep(-1);

    for (let i = 0; i < timelineSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, timelineSteps[i].duration));
      setCompletedSteps(prev => [...prev, i]);
    }
    
    setCurrentStep(-1);
  };

  const resetTimeline = () => {
    setCurrentStep(-1);
    setCompletedSteps([]);
  };

  const getStepStatus = (index) => {
    if (completedSteps.includes(index)) return 'completed';
    if (currentStep === index) return 'active';
    return 'pending';
  };

  return (
    <div className="processing-timeline">
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Real-time Processing Pipeline
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Average: 1.1s</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Animated Progress Line */}
          {isActive && (
            <motion.div
              className="absolute left-8 top-0 w-0.5 bg-blue-500"
              initial={{ height: 0 }}
              animate={{ 
                height: completedSteps.length > 0 
                  ? `${(completedSteps.length / timelineSteps.length) * 100}%` 
                  : currentStep >= 0 
                    ? `${((currentStep + 1) / timelineSteps.length) * 100}%`
                    : 0
              }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Timeline Steps */}
          <div className="space-y-6">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              const status = getStepStatus(index);
              
              return (
                <motion.div
                  key={step.id}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0.5 }}
                  animate={{ 
                    opacity: status === 'pending' ? 0.5 : 1,
                    scale: status === 'active' ? 1.02 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step Icon */}
                  <div 
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                      status === 'completed' 
                        ? 'bg-green-500 border-green-500' 
                        : status === 'active'
                          ? 'border-blue-500 bg-blue-50'
                          : 'bg-white border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: status === 'active' ? `${step.color}20` : undefined,
                      borderColor: status === 'active' ? step.color : undefined
                    }}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : status === 'active' ? (
                      <div className="relative">
                        <Icon className="w-8 h-8" style={{ color: step.color }} />
                        <div className="absolute -inset-2 border-2 border-blue-500 rounded-full animate-ping opacity-30"></div>
                      </div>
                    ) : (
                      <Icon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-lg font-semibold ${
                        status === 'completed' ? 'text-green-700' :
                        status === 'active' ? 'text-blue-700' :
                        'text-gray-500'
                      }`}>
                        {step.title}
                      </h4>
                      
                      {status === 'active' && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <div className="loading-spinner"></div>
                          <span className="text-sm font-medium">Processing...</span>
                        </div>
                      )}
                      
                      {status === 'completed' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">{step.duration}ms</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mt-1">{step.description}</p>
                    
                    {/* Step Details */}
                    {(status === 'active' || status === 'completed') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(step.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">
                                {key.replace('_', ' ')}:
                              </span>
                              <span className="font-medium text-gray-800">
                                {Array.isArray(value) ? value.join(', ') : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Arrow to next step */}
                  {index < timelineSteps.length - 1 && status === 'completed' && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute right-0 top-8 text-green-500"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        {completedSteps.length === timelineSteps.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="font-semibold text-green-800">Processing Complete!</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">1.1s</div>
                <div className="text-sm text-green-600">Total Time</div>
              </div>
            </div>
            <div className="mt-2 text-sm text-green-700">
              Successfully processed HL7 message with 95.2% AI confidence and 100% FHIR compliance
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProcessingTimeline;
