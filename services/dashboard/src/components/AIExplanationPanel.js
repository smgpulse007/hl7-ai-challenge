import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Eye, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Info,
  Lightbulb,
  FileText,
  BarChart3
} from 'lucide-react';

const AIExplanationPanel = ({ selectedMember }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const aiAnalysisSteps = [
    {
      id: 'nlp',
      title: 'Clinical NLP Analysis',
      icon: Brain,
      confidence: 95.2,
      description: 'Natural Language Processing of clinical documentation',
      details: {
        extracted_entities: [
          { type: 'Condition', value: 'Type 2 Diabetes', confidence: 0.96 },
          { type: 'Medication', value: 'Metformin', confidence: 0.94 },
          { type: 'Symptom', value: 'Polyuria', confidence: 0.89 },
          { type: 'Lab_Value', value: 'HbA1c: 8.2%', confidence: 0.98 }
        ],
        sentiment_analysis: {
          clinical_urgency: 'moderate',
          patient_compliance: 'good',
          provider_concern: 'elevated'
        }
      }
    },
    {
      id: 'risk',
      title: 'Risk Stratification',
      icon: Target,
      confidence: 87.4,
      description: 'ML-based risk prediction using multiple data sources',
      details: {
        risk_factors: [
          { factor: 'Uncontrolled Diabetes', weight: 0.35, impact: 'high' },
          { factor: 'Age > 65', weight: 0.25, impact: 'medium' },
          { factor: 'Medication Adherence', weight: 0.20, impact: 'medium' },
          { factor: 'Comorbidities', weight: 0.20, impact: 'low' }
        ],
        model_features: {
          demographic_score: 0.72,
          clinical_score: 0.84,
          behavioral_score: 0.65,
          social_score: 0.58
        }
      }
    },
    {
      id: 'gaps',
      title: 'Care Gap Detection',
      icon: Eye,
      confidence: 92.1,
      description: 'HEDIS quality measure analysis and gap identification',
      details: {
        identified_gaps: [
          { 
            measure: 'HbA1c Testing', 
            status: 'overdue', 
            last_test: '8 months ago',
            recommendation: 'Schedule within 30 days'
          },
          { 
            measure: 'Eye Exam', 
            status: 'due_soon', 
            last_exam: '11 months ago',
            recommendation: 'Schedule within 60 days'
          },
          { 
            measure: 'Nephropathy Screening', 
            status: 'compliant', 
            last_test: '3 months ago',
            recommendation: 'Continue monitoring'
          }
        ],
        quality_scores: {
          diabetes_care: 0.78,
          preventive_care: 0.85,
          medication_management: 0.92
        }
      }
    },
    {
      id: 'evidence',
      title: 'Evidence Aggregation',
      icon: FileText,
      confidence: 89.7,
      description: 'Multi-source evidence synthesis using RAG',
      details: {
        evidence_sources: [
          { 
            source: 'Clinical Guidelines', 
            relevance: 0.94,
            recommendation: 'ADA Standards of Care 2024'
          },
          { 
            source: 'Research Literature', 
            relevance: 0.87,
            recommendation: 'Recent diabetes management studies'
          },
          { 
            source: 'Best Practices', 
            relevance: 0.91,
            recommendation: 'Population health interventions'
          }
        ],
        confidence_factors: {
          guideline_alignment: 0.93,
          evidence_quality: 0.88,
          clinical_relevance: 0.95
        }
      }
    },
    {
      id: 'recommendations',
      title: 'Clinical Recommendations',
      icon: Lightbulb,
      confidence: 91.3,
      description: 'AI-generated care recommendations and interventions',
      details: {
        primary_recommendations: [
          {
            action: 'Schedule HbA1c Test',
            priority: 'high',
            timeline: 'Within 2 weeks',
            rationale: 'Last test >6 months ago, current HbA1c elevated'
          },
          {
            action: 'Medication Review',
            priority: 'medium',
            timeline: 'Within 4 weeks',
            rationale: 'Potential for optimization based on current levels'
          },
          {
            action: 'Diabetes Education',
            priority: 'medium',
            timeline: 'Within 6 weeks',
            rationale: 'Improve self-management and adherence'
          }
        ],
        intervention_score: 0.89,
        expected_outcomes: {
          hba1c_improvement: '0.8-1.2%',
          care_gap_closure: '85%',
          cost_savings: '$1,200-1,800/year'
        }
      }
    }
  ];

  const getStepColor = (step) => {
    switch (step.id) {
      case 'nlp': return 'var(--accent-orange)';
      case 'risk': return 'var(--error-red)';
      case 'gaps': return 'var(--warning-yellow)';
      case 'evidence': return 'var(--primary-blue)';
      case 'recommendations': return 'var(--success-green)';
      default: return 'var(--text-light)';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'var(--success-green)';
    if (confidence >= 80) return 'var(--warning-yellow)';
    return 'var(--error-red)';
  };

  return (
    <div className="ai-explanation-panel">
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            AI Decision Explanation
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* AI Processing Steps */}
        <div className="space-y-4">
          {aiAnalysisSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            const isCompleted = activeStep > index;

            return (
              <motion.div
                key={step.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isActive ? 'border-blue-500 bg-blue-50' : 
                  isCompleted ? 'border-green-500 bg-green-50' : 
                  'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setActiveStep(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: getStepColor(step) }}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div 
                      className="text-lg font-bold"
                      style={{ color: getConfidenceColor(step.confidence) }}
                    >
                      {step.confidence}%
                    </div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>

                {/* Detailed Explanation */}
                <AnimatePresence>
                  {isActive && showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      {step.id === 'nlp' && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700">Extracted Clinical Entities:</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {step.details.extracted_entities.map((entity, idx) => (
                              <div key={idx} className="bg-white p-2 rounded border">
                                <div className="font-medium text-sm">{entity.type}</div>
                                <div className="text-xs text-gray-600">{entity.value}</div>
                                <div className="text-xs text-green-600">{(entity.confidence * 100).toFixed(1)}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.id === 'risk' && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700">Risk Factors Analysis:</h5>
                          {step.details.risk_factors.map((factor, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded">
                              <span className="text-sm">{factor.factor}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{factor.impact}</span>
                                <span className="text-sm font-medium">{(factor.weight * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.id === 'gaps' && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700">Identified Care Gaps:</h5>
                          {step.details.identified_gaps.map((gap, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-sm">{gap.measure}</div>
                                  <div className="text-xs text-gray-600">{gap.last_test || gap.last_exam}</div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  gap.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                  gap.status === 'due_soon' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {gap.status.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="text-xs text-blue-600 mt-1">{gap.recommendation}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.id === 'evidence' && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700">Evidence Sources:</h5>
                          {step.details.evidence_sources.map((source, idx) => (
                            <div key={idx} className="bg-white p-2 rounded border">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{source.source}</span>
                                <span className="text-sm text-blue-600">{(source.relevance * 100).toFixed(0)}%</span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">{source.recommendation}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {step.id === 'recommendations' && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700">Clinical Recommendations:</h5>
                          {step.details.primary_recommendations.map((rec, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-sm">{rec.action}</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {rec.priority} priority
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">{rec.timeline}</div>
                              <div className="text-xs text-blue-600 mt-1">{rec.rationale}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Overall AI Confidence */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-800">Overall AI Confidence</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {((aiAnalysisSteps.reduce((sum, step) => sum + step.confidence, 0) / aiAnalysisSteps.length)).toFixed(1)}%
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Based on {aiAnalysisSteps.length} AI analysis components
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIExplanationPanel;
