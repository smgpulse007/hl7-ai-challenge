import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Activity, Database, FileText, Pill } from 'lucide-react';

const MultiSourceDataView = ({ memberId = "99990001000000" }) => {
  const [selectedView, setSelectedView] = useState('emr');
  const [syntheticData, setSyntheticData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load synthetic data from our comprehensive test data
    const loadSyntheticData = async () => {
      try {
        // Simulate loading from our synthetic data files
        const mockData = {
          basic: {
            name: "Maria Rodriguez",
            memberId: "99990001000000",
            age: 35,
            lastEMRVisit: "2024-02-15"
          },
          emrOnly: {
            ccsStatus: "GAP IDENTIFIED",
            lastScreening: "Not documented in EMR",
            riskLevel: "UNKNOWN",
            dataSource: "Epic EMR Only",
            completionStatus: "NON-COMPLIANT",
            confidence: "Low - Incomplete Data",
            projectedCost: "$50 outreach required"
          },
          multiSource: {
            ccsStatus: "COMPLIANT",
            lastScreening: "2024-07-22 - Community Health Clinic",
            riskLevel: "LOW",
            dataSource: "Multi-Source Integration",
            completionStatus: "COMPLIANT",
            confidence: "High - Complete Picture",
            projectedSavings: "$50 outreach avoided",
            sources: [
              {
                type: "HL7 Lab Results",
                icon: <FileText className="w-4 h-4" />,
                date: "2024-07-22",
                facility: "Community Health Clinic",
                result: "Pap smear - Normal cytology (LOINC: 33717-0)",
                status: "completed",
                color: "green"
              },
              {
                type: "HIE Data",
                icon: <Database className="w-4 h-4" />,
                date: "2024-07-22",
                facility: "Regional HIE Network",
                result: "Cervical screening procedure documented",
                status: "completed",
                color: "blue"
              },
              {
                type: "Claims Data",
                icon: <Activity className="w-4 h-4" />,
                date: "2024-07-25",
                facility: "Claims Processing System",
                result: "CPT 88150 - Cytopathology, cervical/vaginal",
                status: "processed",
                color: "purple"
              },
              {
                type: "Pharmacy Data",
                icon: <Pill className="w-4 h-4" />,
                date: "2024-07-20",
                facility: "CVS Pharmacy #4521",
                result: "Anxiety medication filled (pre-procedure)",
                status: "supporting",
                color: "orange"
              }
            ]
          }
        };

        setSyntheticData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading synthetic data:', error);
        setLoading(false);
      }
    };

    loadSyntheticData();
  }, [memberId]);

  // Mock data showing the same patient from different data sources
  const patientData = {
    basic: {
      name: "Maria Rodriguez",
      memberId: "99990001000000",
      age: 35,
      lastEMRVisit: "2024-02-15"
    },
    emrOnly: {
      ccsStatus: "GAP IDENTIFIED",
      lastScreening: "Not documented in EMR",
      riskLevel: "UNKNOWN",
      dataSource: "Epic EMR Only",
      completionStatus: "NON-COMPLIANT",
      confidence: "Low - Incomplete Data"
    },
    multiSource: {
      ccsStatus: "COMPLIANT",
      lastScreening: "2024-07-22 - Community Health Clinic",
      riskLevel: "LOW",
      dataSource: "Multi-Source Integration",
      completionStatus: "COMPLIANT",
      confidence: "High - Complete Picture",
      sources: [
        {
          type: "HL7 Lab Results",
          date: "2024-07-22",
          facility: "Community Health Clinic",
          result: "Pap smear - Normal cytology",
          status: "completed"
        },
        {
          type: "HIE Data",
          date: "2024-07-22", 
          facility: "Regional HIE",
          result: "Cervical screening procedure documented",
          status: "completed"
        },
        {
          type: "Claims Data",
          date: "2024-07-25",
          facility: "Claims Processing",
          result: "CPT 88150 - Cytopathology, cervical",
          status: "processed"
        },
        {
          type: "Pharmacy Data",
          date: "2024-07-20",
          facility: "CVS Pharmacy",
          result: "Pre-procedure anxiety medication filled",
          status: "supporting"
        }
      ]
    }
  };

  const DataSourceCard = ({ source }) => (
    <div className={`border-l-4 border-${source.color}-500 bg-${source.color}-50 rounded-lg p-4 mb-3`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`text-${source.color}-600`}>
            {source.icon}
          </div>
          <Badge variant={source.status === 'completed' ? 'success' : 'secondary'}>
            {source.type}
          </Badge>
        </div>
        <span className="text-sm text-gray-500 font-medium">{source.date}</span>
      </div>
      <p className="text-sm font-medium text-gray-800 mb-1">{source.result}</p>
      <p className="text-xs text-gray-600">{source.facility}</p>
      <div className="mt-2">
        <Badge variant="outline" className="text-xs">
          Status: {source.status}
        </Badge>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading synthetic data demonstration...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!syntheticData) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading demonstration data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Multi-Source Data Integration Demo</h2>
              <p className="text-gray-600">
                Patient: {syntheticData.basic.name} (ID: {syntheticData.basic.memberId}) | Age: {syntheticData.basic.age}
              </p>
            </div>
            <Badge variant="success" className="text-lg px-4 py-2">
              Differentiator #1: Input Agnostic
            </Badge>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">
              <strong>Value Proposition:</strong> While EMRs only see what's documented in their system,
              we see the complete picture across all healthcare touchpoints.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedView} onValueChange={setSelectedView}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="emr">EMR-Only View (Traditional)</TabsTrigger>
              <TabsTrigger value="complete">Multi-Source View (Our Platform)</TabsTrigger>
            </TabsList>

            <TabsContent value="emr" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-red-200">
                  <CardHeader className="bg-red-50">
                    <h3 className="text-lg font-semibold text-red-800">
                      Traditional EMR-Only Analysis
                    </h3>
                    <Badge variant="destructive">GAP IDENTIFIED</Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">CCS Status:</label>
                        <p className="text-red-600 font-semibold text-lg">{syntheticData.emrOnly.ccsStatus}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Last Screening:</label>
                        <p className="text-gray-800">{syntheticData.emrOnly.lastScreening}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Data Source:</label>
                        <p className="text-gray-800">{syntheticData.emrOnly.dataSource}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Confidence Level:</label>
                        <p className="text-orange-600 font-medium">{syntheticData.emrOnly.confidence}</p>
                      </div>
                      <div className="pt-2 border-t">
                        <label className="text-sm font-medium text-gray-600">Projected Cost:</label>
                        <p className="text-red-600 font-semibold">{syntheticData.emrOnly.projectedCost}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200">
                  <CardHeader className="bg-gray-50">
                    <h3 className="text-lg font-semibold">Recommended Actions</h3>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Schedule cervical screening</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Member outreach required</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Provider notification</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Risk:</strong> May be unnecessary outreach if screening completed elsewhere
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="complete" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-green-200">
                  <CardHeader className="bg-green-50">
                    <h3 className="text-lg font-semibold text-green-800">
                      Multi-Source Intelligence
                    </h3>
                    <Badge variant="success">COMPLIANT</Badge>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">CCS Status:</label>
                        <p className="text-green-600 font-semibold text-lg">{syntheticData.multiSource.ccsStatus}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Last Screening:</label>
                        <p className="text-gray-800">{syntheticData.multiSource.lastScreening}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Data Source:</label>
                        <p className="text-gray-800">{syntheticData.multiSource.dataSource}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Confidence Level:</label>
                        <p className="text-green-600 font-medium">{syntheticData.multiSource.confidence}</p>
                      </div>
                      <div className="pt-2 border-t">
                        <label className="text-sm font-medium text-gray-600">Projected Savings:</label>
                        <p className="text-green-600 font-semibold">{syntheticData.multiSource.projectedSavings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <h3 className="text-lg font-semibold">Data Sources Integrated</h3>
                    <p className="text-sm text-gray-600">
                      {syntheticData.multiSource.sources.length} sources providing complete member journey
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {syntheticData.multiSource.sources.map((source, index) => (
                        <DataSourceCard key={index} source={source} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <h3 className="text-lg font-semibold">Value Proposition Highlight</h3>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">$50</div>
                      <div className="text-sm text-gray-600">Outreach Cost Saved</div>
                      <div className="text-xs text-gray-500">Per unnecessary contact</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">30-40%</div>
                      <div className="text-sm text-gray-600">Care Missed by EMR</div>
                      <div className="text-xs text-gray-500">External facility completion</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">4</div>
                      <div className="text-sm text-gray-600">Data Sources</div>
                      <div className="text-xs text-gray-500">Complete member journey</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Key Differentiator:</strong> While EMR-only solutions miss 30-40% of completed care 
                      happening outside their system, our platform captures the complete member journey across 
                      all touchpoints, eliminating unnecessary outreach and improving member satisfaction.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiSourceDataView;
