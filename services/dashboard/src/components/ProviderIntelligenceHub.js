import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  FileText,
  Eye,
  Calendar,
  Phone,
  Target
} from 'lucide-react';

const ProviderIntelligenceHub = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [panelData, setPanelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCDSHook, setShowCDSHook] = useState(false);
  const [cdsPatient, setCdsPatient] = useState(null);
  const [viewMode, setViewMode] = useState('panel'); // 'panel' or 'patient'

  // Mock provider data - in real implementation, this would come from API
  const providerInfo = {
    name: "Dr. Sarah Martinez",
    specialty: "Family Practice",
    panelSize: 1247,
    location: "IEHP Medical Group - Riverside"
  };

  // Simulate CDS Hook activation (what provider sees when clicking patient)
  const activateCDSHook = (patient) => {
    setCdsPatient({
      ...patient,
      clinicalEvidence: [
        {
          source: "HL7 MDM Message",
          date: "2025-08-15",
          content: "CERVICAL CANCER SCREENING: Patient completed Pap smear on 08/15/2025. Results show normal cytology. HPV test negative.",
          confidence: 0.95,
          extracted: "Pap smear completed, normal cytology, HPV negative"
        },
        {
          source: "FHIR DiagnosticReport",
          date: "2025-08-10",
          content: "Colonoscopy completed successfully. No polyps detected. Recommend routine screening in 10 years.",
          confidence: 0.92,
          extracted: "Colonoscopy normal, no polyps"
        },
        {
          source: "Claims Data",
          date: "2025-07-20",
          content: "CPT 99213 - Office visit, established patient",
          confidence: 0.88,
          extracted: "Recent office visit documented"
        }
      ],
      riskFactors: [
        { factor: "Age 52", impact: "Moderate", description: "Increased screening frequency recommended" },
        { factor: "Family History", impact: "High", description: "Mother diagnosed with cervical cancer at age 58" },
        { factor: "Previous Normal Results", impact: "Protective", description: "Last 3 screenings normal" }
      ],
      recommendations: [
        {
          action: "Schedule cervical cancer screening",
          priority: "High",
          dueDate: "Within 30 days",
          rationale: "Overdue by 31 days, family history present"
        },
        {
          action: "Update family history documentation",
          priority: "Medium",
          dueDate: "Next visit",
          rationale: "Ensure complete risk assessment"
        }
      ]
    });
    setShowCDSHook(true);
    setViewMode('patient');
  };

  // High-risk patients needing intervention (Monday morning workflow)
  const highRiskPatients = [
    {
      id: "99990001000000",
      name: "Maria Rodriguez",
      age: 52,
      lastVisit: "2025-08-10",
      riskScore: 0.89,
      careGaps: [
        { measure: "CCS", dueDate: "2025-07-15", daysPastDue: 31, priority: "high" },
        { measure: "COL", dueDate: "2025-06-01", daysPastDue: 75, priority: "high" }
      ],
      evidenceSources: ["Claims", "HIE"],
      nextAppointment: "2025-08-20",
      phone: "(951) 555-0123"
    },
    {
      id: "99990002000000", 
      name: "Jennifer Chen",
      age: 45,
      lastVisit: "2025-08-12",
      riskScore: 0.76,
      careGaps: [
        { measure: "CCS", dueDate: "2025-08-01", daysPastDue: 14, priority: "medium" }
      ],
      evidenceSources: ["EMR", "Claims"],
      nextAppointment: null,
      phone: "(951) 555-0456"
    },
    {
      id: "99990003000000",
      name: "Robert Johnson", 
      age: 58,
      lastVisit: "2025-07-28",
      riskScore: 0.82,
      careGaps: [
        { measure: "COL", dueDate: "2025-05-15", daysPastDue: 92, priority: "high" },
        { measure: "WCV", dueDate: "2025-08-01", daysPastDue: 14, priority: "low" }
      ],
      evidenceSources: ["HIE", "Lab Results"],
      nextAppointment: "2025-08-25",
      phone: "(951) 555-0789"
    },
    {
      id: "99990004000000",
      name: "Lisa Thompson",
      age: 41,
      lastVisit: "2025-08-05",
      riskScore: 0.71,
      careGaps: [
        { measure: "CCS", dueDate: "2025-07-20", daysPastDue: 26, priority: "medium" }
      ],
      evidenceSources: ["Claims", "External Lab"],
      nextAppointment: "2025-08-18",
      phone: "(951) 555-0321"
    },
    {
      id: "99990005000000",
      name: "David Kim",
      age: 55,
      lastVisit: "2025-08-08",
      riskScore: 0.85,
      careGaps: [
        { measure: "COL", dueDate: "2025-06-10", daysPastDue: 66, priority: "high" },
        { measure: "CCS", dueDate: "2025-08-05", daysPastDue: 10, priority: "low" }
      ],
      evidenceSources: ["HIE", "Claims", "Pharmacy"],
      nextAppointment: null,
      phone: "(951) 555-0654"
    },
    {
      id: "99990006000000",
      name: "Angela Davis",
      age: 49,
      lastVisit: "2025-08-11",
      riskScore: 0.78,
      careGaps: [
        { measure: "CCS", dueDate: "2025-07-25", daysPastDue: 21, priority: "medium" }
      ],
      evidenceSources: ["EMR", "HIE"],
      nextAppointment: "2025-08-22",
      phone: "(951) 555-0987"
    },
    {
      id: "99990007000000",
      name: "Michael Brown",
      age: 62,
      lastVisit: "2025-07-30",
      riskScore: 0.91,
      careGaps: [
        { measure: "COL", dueDate: "2025-04-30", daysPastDue: 107, priority: "high" },
        { measure: "WCV", dueDate: "2025-07-15", daysPastDue: 31, priority: "medium" }
      ],
      evidenceSources: ["Claims", "HIE", "Lab Results"],
      nextAppointment: "2025-08-19",
      phone: "(951) 555-0147"
    }
  ];

  // Patients already compliant (don't need outreach)
  const compliantPatients = [
    {
      id: "99990008000000",
      name: "Sarah Wilson",
      age: 47,
      completedMeasures: ["CCS", "COL"],
      completionDate: "2025-07-20",
      evidenceSource: "External Provider"
    },
    {
      id: "99990009000000", 
      name: "James Garcia",
      age: 53,
      completedMeasures: ["COL"],
      completionDate: "2025-08-01",
      evidenceSource: "Specialist Referral"
    },
    {
      id: "99990010000000",
      name: "Patricia Lee",
      age: 44,
      completedMeasures: ["CCS"],
      completionDate: "2025-07-28",
      evidenceSource: "HIE Data"
    }
  ];

  useEffect(() => {
    // Simulate loading panel data
    setTimeout(() => {
      setPanelData({
        totalPatients: providerInfo.panelSize,
        highRiskCount: highRiskPatients.length,
        compliantCount: compliantPatients.length,
        needsOutreach: highRiskPatients.filter(p => !p.nextAppointment).length
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getRiskBadgeColor = (score) => {
    if (score >= 0.8) return "bg-red-100 text-red-800";
    if (score >= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return "bg-red-100 text-red-800";
      case 'medium': return "bg-yellow-100 text-yellow-800";
      case 'low': return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMeasureDisplayName = (measure) => {
    const names = {
      'CCS': 'Cervical Cancer Screening',
      'COL': 'Colorectal Cancer Screening', 
      'WCV': 'Well-Child Visit'
    };
    return names[measure] || measure;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading Provider Intelligence Hub...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clinical Decision Support</h1>
            <p className="text-gray-600 mt-1">
              SMART on FHIR • Real-time Care Gap Alerts • Multi-Source Evidence Aggregation
            </p>

            {/* View Navigation */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setViewMode('patient')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'patient'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🎯 Patient-Specific CDS Hook
              </button>
              <button
                onClick={() => setViewMode('panel')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'panel'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📊 Panel Management View
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Panel Size</div>
            <div className="text-2xl font-bold">{providerInfo.panelSize.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Patient-Specific CDS Hook View */}
      {viewMode === 'patient' && (
        <div className="space-y-6">
          {/* CDS Hook Simulation */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">CDS</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">
                  SMART on FHIR Clinical Decision Support Hook Activated
                </h3>
                <p className="text-blue-700 text-sm">
                  Real-time care gap alert triggered during patient encounter
                </p>
              </div>
            </div>
          </div>

          {/* Demo Patient Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Select Patient for CDS Demo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {highRiskPatients.slice(0, 3).map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => activateCDSHook(patient)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-sm text-gray-600">Age {patient.age}</div>
                  <div className="text-sm text-red-600">Risk Score: {(patient.riskScore * 100).toFixed(0)}%</div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient-Specific CDS Content */}
          {cdsPatient && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{cdsPatient.name}</h2>
                    <p className="text-gray-600">Age {cdsPatient.age} • MRN: {cdsPatient.id}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      {(cdsPatient.riskScore * 100).toFixed(0)}% Risk
                    </div>
                    <div className="text-sm text-gray-600">Non-compliance probability</div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Clinical Evidence */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">📋 Clinical Evidence Extracted</h3>
                  <div className="space-y-3">
                    {cdsPatient.clinicalEvidence?.map((evidence, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-blue-600">{evidence.source}</span>
                          <span className="text-sm text-gray-500">{evidence.date}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">"{evidence.content}"</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-green-600">
                            Extracted: {evidence.extracted}
                          </span>
                          <span className="text-xs text-gray-500">
                            Confidence: {(evidence.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">⚠️ Risk & Protective Factors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {cdsPatient.riskFactors?.map((factor, index) => (
                      <div key={index} className={`p-3 rounded-lg border-l-4 ${
                        factor.impact === 'High' ? 'border-red-500 bg-red-50' :
                        factor.impact === 'Moderate' ? 'border-yellow-500 bg-yellow-50' :
                        'border-green-500 bg-green-50'
                      }`}>
                        <div className="font-medium">{factor.factor}</div>
                        <div className={`text-sm ${
                          factor.impact === 'High' ? 'text-red-700' :
                          factor.impact === 'Moderate' ? 'text-yellow-700' :
                          'text-green-700'
                        }`}>
                          {factor.impact} Impact
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{factor.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🎯 Actionable Recommendations</h3>
                  <div className="space-y-3">
                    {cdsPatient.recommendations?.map((rec, index) => (
                      <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-blue-900">{rec.action}</div>
                          <div className="text-sm text-blue-700 mt-1">{rec.rationale}</div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {rec.priority} Priority
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{rec.dueDate}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    📅 Schedule Screening
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    📞 Contact Patient
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    📝 Update Care Plan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Panel Management View */}
      {viewMode === 'panel' && (
        <div>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">High Risk Patients</p>
                <p className="text-2xl font-bold text-gray-900">{panelData.highRiskCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Already Compliant</p>
                <p className="text-2xl font-bold text-gray-900">{panelData.compliantCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Needs Outreach</p>
                <p className="text-2xl font-bold text-gray-900">{panelData.needsOutreach}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Focus Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((panelData.highRiskCount / (panelData.highRiskCount + panelData.compliantCount)) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Value Proposition Alert */}
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <strong>Intelligence Insight:</strong> Focus on {panelData.highRiskCount} high-risk patients instead of calling all {panelData.highRiskCount + panelData.compliantCount} patients. 
          {panelData.compliantCount} patients already completed care elsewhere (evidence from HIE, claims, external providers).
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="high-risk" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="high-risk">High-Risk Patients ({panelData.highRiskCount})</TabsTrigger>
          <TabsTrigger value="compliant">Already Compliant ({panelData.compliantCount})</TabsTrigger>
          <TabsTrigger value="patient-detail">Patient Detail</TabsTrigger>
        </TabsList>

        <TabsContent value="high-risk" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Priority Patients for Outreach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highRiskPatients.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-lg">{patient.name}</h3>
                          <Badge className={getRiskBadgeColor(patient.riskScore)}>
                            Risk: {(patient.riskScore * 100).toFixed(0)}%
                          </Badge>
                          <span className="text-sm text-gray-500">Age {patient.age}</span>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          {patient.careGaps.map((gap, idx) => (
                            <Badge key={idx} className={getPriorityBadgeColor(gap.priority)}>
                              {getMeasureDisplayName(gap.measure)} - {gap.daysPastDue} days overdue
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Evidence Sources:</span> {patient.evidenceSources.join(", ")}
                        </div>
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm">
                          <span><Clock className="h-4 w-4 inline mr-1" />Last Visit: {patient.lastVisit}</span>
                          <span><Phone className="h-4 w-4 inline mr-1" />{patient.phone}</span>
                          {patient.nextAppointment && (
                            <span><Calendar className="h-4 w-4 inline mr-1" />Next: {patient.nextAppointment}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedPatient(patient)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {!patient.nextAppointment && (
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Call Patient
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliant" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Patients Already Compliant (No Outreach Needed)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {compliantPatients.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{patient.name}</h3>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {patient.completedMeasures.map((measure, idx) => (
                            <Badge key={idx} className="bg-green-100 text-green-800">
                              {getMeasureDisplayName(measure)} ✓
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          Completed: {patient.completionDate} • Source: {patient.evidenceSource}
                        </div>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patient-detail" className="mt-6">
          {selectedPatient ? (
            <Card>
              <CardHeader>
                <CardTitle>Patient Detail: {selectedPatient.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Care Gaps & Risk Factors</h4>
                    <div className="space-y-3">
                      {selectedPatient.careGaps.map((gap, idx) => (
                        <div key={idx} className="border rounded p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{getMeasureDisplayName(gap.measure)}</span>
                            <Badge className={getPriorityBadgeColor(gap.priority)}>
                              {gap.priority} priority
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Due: {gap.dueDate} ({gap.daysPastDue} days overdue)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Evidence & Data Sources</h4>
                    <div className="space-y-2">
                      {selectedPatient.evidenceSources.map((source, idx) => (
                        <div key={idx} className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{source}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Risk Score Breakdown</h5>
                      <div className="bg-gray-100 rounded p-3">
                        <div className="flex justify-between">
                          <span>Overall Risk Score:</span>
                          <span className="font-bold">{(selectedPatient.riskScore * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a patient from the High-Risk list to view detailed information</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
        </div>
      )}
    </div>
  );
};

export default ProviderIntelligenceHub;
