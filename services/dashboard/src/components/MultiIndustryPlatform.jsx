import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Building2, Hospital, Stethoscope, Users } from 'lucide-react';

const MultiIndustryPlatform = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('health-plan');

  const industryData = {
    'health-plan': {
      title: 'Health Plan Operations',
      icon: <Building2 className="w-6 h-6" />,
      organization: 'IEHP (Inland Empire Health Plan)',
      population: '450,000 members',
      focus: 'Population Health & Quality Scores',
      metrics: {
        members: 450000,
        providers: 8500,
        starRating: 4.2,
        qualityBonus: '$5.6M',
        measures: ['CCS', 'WCV', 'COL', 'BCS', 'CDC-HbA1c', 'CBP']
      },
      dashboard: {
        kpis: [
          { label: 'Star Rating Impact', value: '+0.8 points', trend: 'up' },
          { label: 'Quality Bonus Revenue', value: '$5.6M', trend: 'up' },
          { label: 'Vendor Cost Elimination', value: '$350K', trend: 'down' },
          { label: 'Audit Preparation Time', value: '-80%', trend: 'down' }
        ],
        priorities: [
          'CCS compliance improvement (72% → 85%)',
          'WCV gap closure for pediatric population',
          'COL screening outreach for 45+ members',
          'Star rating optimization across all measures'
        ]
      }
    },
    'health-system': {
      title: 'Health System Population Health',
      icon: <Hospital className="w-6 h-6" />,
      organization: 'Riverside Medical Center',
      population: '85,000 attributed lives',
      focus: 'Value-Based Care & Provider Performance',
      metrics: {
        members: 85000,
        providers: 450,
        starRating: 4.0,
        qualityBonus: '$1.2M',
        measures: ['CCS', 'WCV', 'COL', 'BCS', 'DM-Eye', 'HTN-Control']
      },
      dashboard: {
        kpis: [
          { label: 'Value-Based Revenue', value: '$1.2M', trend: 'up' },
          { label: 'Provider Efficiency', value: '+35%', trend: 'up' },
          { label: 'Care Coordination', value: '92%', trend: 'up' },
          { label: 'Readmission Reduction', value: '-15%', trend: 'down' }
        ],
        priorities: [
          'Provider performance scorecards',
          'Care coordination workflow optimization',
          'Quality measure tracking across service lines',
          'Population health risk stratification'
        ]
      }
    },
    'individual-practice': {
      title: 'Individual Practice Management',
      icon: <Stethoscope className="w-6 h-6" />,
      organization: 'Dr. Martinez Family Practice',
      population: '2,400 attributed patients',
      focus: 'Patient Care & Quality Incentives',
      metrics: {
        members: 2400,
        providers: 3,
        starRating: 4.5,
        qualityBonus: '$45K',
        measures: ['CCS', 'WCV', 'COL', 'DM-HbA1c', 'HTN-BP']
      },
      dashboard: {
        kpis: [
          { label: 'Quality Incentives', value: '$45K', trend: 'up' },
          { label: 'Patient Satisfaction', value: '4.8/5', trend: 'up' },
          { label: 'Workflow Efficiency', value: '+60%', trend: 'up' },
          { label: 'Administrative Burden', value: '-70%', trend: 'down' }
        ],
        priorities: [
          'Daily patient care gap alerts',
          'Preventive care scheduling optimization',
          'Quality measure performance tracking',
          'Patient engagement and outreach'
        ]
      }
    }
  };

  const smartOnFhirViews = {
    'patient-level': {
      title: 'Patient-Level View',
      description: 'Individual member/patient dashboard with personalized care plans',
      features: [
        'Personalized care gap identification',
        'Risk-based intervention recommendations',
        'Preferred provider matching',
        'Appointment scheduling integration',
        'Health goal tracking and progress'
      ]
    },
    'panel-level': {
      title: 'Panel-Level View', 
      description: 'Provider view of attributed population with prioritized actions',
      features: [
        'Population health overview',
        'Risk-stratified patient lists',
        'Workflow-integrated care alerts',
        'Performance analytics and trends',
        'Quality measure tracking'
      ]
    }
  };

  const currentData = industryData[selectedIndustry];

  const KPICard = ({ kpi }) => (
    <Card className="h-full">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600">{kpi.label}</p>
            <p className="text-2xl font-bold mt-1">{kpi.value}</p>
          </div>
          <div className={`text-sm px-2 py-1 rounded ${
            kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {kpi.trend === 'up' ? '↗' : '↘'}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Multi-Industry Platform Scalability</h2>
          <p className="text-gray-600">
            Same AI intelligence, different business models - from individual practices to major health plans
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="health-plan" className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Health Plan</span>
              </TabsTrigger>
              <TabsTrigger value="health-system" className="flex items-center space-x-2">
                <Hospital className="w-4 h-4" />
                <span>Health System</span>
              </TabsTrigger>
              <TabsTrigger value="individual-practice" className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4" />
                <span>Practice</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedIndustry} className="mt-6">
              {/* Organization Header */}
              <Card className="mb-6">
                <CardHeader className="bg-blue-50">
                  <div className="flex items-center space-x-3">
                    {currentData.icon}
                    <div>
                      <h3 className="text-xl font-semibold">{currentData.title}</h3>
                      <p className="text-gray-600">{currentData.organization}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Population</label>
                      <p className="text-lg font-semibold">{currentData.population}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Providers</label>
                      <p className="text-lg font-semibold">{currentData.metrics.providers.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Quality Rating</label>
                      <p className="text-lg font-semibold">{currentData.metrics.starRating} ⭐</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Quality Revenue</label>
                      <p className="text-lg font-semibold">{currentData.metrics.qualityBonus}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Focus Area</label>
                    <p className="text-gray-800">{currentData.focus}</p>
                  </div>
                </CardContent>
              </Card>

              {/* KPI Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {currentData.dashboard.kpis.map((kpi, index) => (
                  <KPICard key={index} kpi={kpi} />
                ))}
              </div>

              {/* Priorities and Measures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Strategic Priorities</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentData.dashboard.priorities.map((priority, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">{priority}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Quality Measures</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {currentData.metrics.measures.map((measure, index) => (
                        <Badge key={index} variant="outline">
                          {measure}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Platform Advantage:</strong> Same AI models and data integration 
                        serving different business contexts and user workflows.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SMART on FHIR Integration */}
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <h3 className="text-lg font-semibold">SMART on FHIR Integration Capabilities</h3>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(smartOnFhirViews).map(([key, view]) => (
                      <div key={key} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{view.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{view.description}</p>
                        <div className="space-y-2">
                          {view.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Value Proposition */}
              <Card className="mt-6 border-purple-200">
                <CardHeader className="bg-purple-50">
                  <h3 className="text-lg font-semibold">Multi-Industry Value Proposition</h3>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1</div>
                      <div className="text-sm text-gray-600">Platform</div>
                      <div className="text-xs text-gray-500">Multiple Industries</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-gray-600">Business Models</div>
                      <div className="text-xs text-gray-500">Payer/Provider/Practice</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">∞</div>
                      <div className="text-sm text-gray-600">Scalability</div>
                      <div className="text-xs text-gray-500">2K to 450K population</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Key Differentiator:</strong> While competitors build point solutions for single 
                      use cases, our platform scales from 2,400-patient practices to 450,000-member health plans 
                      using the same core AI intelligence. This multi-industry approach creates unprecedented 
                      market opportunities and competitive moats.
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

export default MultiIndustryPlatform;
