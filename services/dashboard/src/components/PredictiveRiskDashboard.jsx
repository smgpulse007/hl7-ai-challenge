import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PredictiveRiskDashboard = () => {
  const [selectedMeasure, setSelectedMeasure] = useState('CCS');

  // Mock data for predictive risk analysis
  const populationData = {
    CCS: {
      totalDue: 1247,
      traditional: {
        approach: "Contact All Members",
        cost: 62350,
        contactRate: 100,
        successRate: 20,
        completions: 249
      },
      predictive: {
        approach: "Focus High-Risk Members",
        highRiskCount: 312,
        cost: 15600,
        contactRate: 25,
        successRate: 65,
        completions: 203,
        efficiency: 75
      }
    },
    WCV: {
      totalDue: 892,
      traditional: {
        approach: "Contact All Members",
        cost: 44600,
        contactRate: 100,
        successRate: 18,
        completions: 161
      },
      predictive: {
        approach: "Focus High-Risk Members",
        highRiskCount: 223,
        cost: 11150,
        contactRate: 25,
        successRate: 68,
        completions: 152,
        efficiency: 75
      }
    }
  };

  const riskDistribution = [
    { name: 'High Risk', value: 312, color: '#ef4444', likelihood: '15%' },
    { name: 'Medium Risk', value: 467, color: '#f59e0b', likelihood: '45%' },
    { name: 'Low Risk', value: 468, color: '#10b981', likelihood: '85%' }
  ];

  const highRiskMembers = [
    {
      id: "99990001000000",
      name: "John Smith",
      age: 67,
      measure: "COL",
      riskScore: 0.85,
      factors: ["3 missed appointments", "Transportation barriers", "Procedure anxiety"],
      intervention: "Personal call + transportation assistance",
      likelihood: "15% compliance without intervention"
    },
    {
      id: "99990002000000", 
      name: "Maria Garcia",
      age: 34,
      measure: "CCS",
      riskScore: 0.78,
      factors: ["Language barrier", "Work schedule conflicts", "No childcare"],
      intervention: "Spanish-speaking navigator + evening appointments",
      likelihood: "22% compliance without intervention"
    },
    {
      id: "99990003000000",
      name: "Robert Johnson", 
      age: 52,
      measure: "COL",
      riskScore: 0.82,
      factors: ["Previous bad experience", "Cost concerns", "Lack of PCP"],
      intervention: "Provider education + financial assistance",
      likelihood: "18% compliance without intervention"
    }
  ];

  const comparisonData = [
    {
      approach: 'Traditional',
      cost: populationData[selectedMeasure].traditional.cost,
      completions: populationData[selectedMeasure].traditional.completions,
      efficiency: 20
    },
    {
      approach: 'Predictive AI',
      cost: populationData[selectedMeasure].predictive.cost,
      completions: populationData[selectedMeasure].predictive.completions,
      efficiency: 65
    }
  ];

  const RiskMemberCard = ({ member }) => (
    <Card className="mb-4 border-red-200">
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold">{member.name}</h4>
            <p className="text-sm text-gray-600">ID: {member.id} | Age: {member.age}</p>
          </div>
          <div className="text-right">
            <Badge variant="destructive">Risk: {(member.riskScore * 100).toFixed(0)}%</Badge>
            <p className="text-xs text-gray-500 mt-1">{member.measure} Due</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div>
            <label className="text-xs font-medium text-gray-600">Risk Factors:</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {member.factors.map((factor, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-600">Recommended Intervention:</label>
            <p className="text-sm text-gray-800">{member.intervention}</p>
          </div>
          
          <div className="bg-red-50 p-2 rounded text-xs">
            <strong>Prediction:</strong> {member.likelihood}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Predictive Risk Stratification Platform</h2>
          <p className="text-gray-600">
            AI-powered non-compliance prediction and resource optimization
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMeasure} onValueChange={setSelectedMeasure}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="CCS">Cervical Cancer Screening</TabsTrigger>
              <TabsTrigger value="WCV">Well-Child Visits</TabsTrigger>
              <TabsTrigger value="COL">Colorectal Screening</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedMeasure} className="mt-6">
              {/* Population Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Population Due</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {populationData[selectedMeasure].totalDue.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Members requiring {selectedMeasure}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">High-Risk Focus</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      {populationData[selectedMeasure].predictive.highRiskCount}
                    </div>
                    <p className="text-sm text-gray-600">Members needing intervention</p>
                    <Badge variant="outline" className="mt-2">
                      {Math.round((populationData[selectedMeasure].predictive.highRiskCount / populationData[selectedMeasure].totalDue) * 100)}% of population
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold">Cost Efficiency</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {populationData[selectedMeasure].predictive.efficiency}%
                    </div>
                    <p className="text-sm text-gray-600">Cost reduction vs traditional</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Save ${(populationData[selectedMeasure].traditional.cost - populationData[selectedMeasure].predictive.cost).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Risk Distribution</h3>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {riskDistribution.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium">{item.likelihood} likely to comply</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Approach Comparison</h3>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="approach" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cost" fill="#ef4444" name="Cost ($)" />
                        <Bar dataKey="completions" fill="#10b981" name="Completions" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Traditional Approach</div>
                        <div>Cost: ${populationData[selectedMeasure].traditional.cost.toLocaleString()}</div>
                        <div>Success: {populationData[selectedMeasure].traditional.successRate}%</div>
                      </div>
                      <div>
                        <div className="font-medium">Predictive AI</div>
                        <div>Cost: ${populationData[selectedMeasure].predictive.cost.toLocaleString()}</div>
                        <div>Success: {populationData[selectedMeasure].predictive.successRate}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* High-Risk Members */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">High-Risk Members Requiring Intervention</h3>
                  <p className="text-sm text-gray-600">
                    AI-identified members with &lt;25% likelihood of compliance without intervention
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {highRiskMembers.map((member, index) => (
                      <RiskMemberCard key={index} member={member} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Value Proposition */}
              <Card className="mt-6 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <h3 className="text-lg font-semibold">Predictive Analytics Value Proposition</h3>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">75%</div>
                      <div className="text-sm text-gray-600">Cost Reduction</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">3.2x</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">25%</div>
                      <div className="text-sm text-gray-600">Population Focus</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">82%</div>
                      <div className="text-sm text-gray-600">Potential Captured</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Key Differentiator:</strong> While traditional approaches waste resources on members 
                      who will comply naturally, our predictive AI identifies the 25% who need intervention to succeed. 
                      This precision targeting delivers 3x higher success rates at 75% lower cost - true precision 
                      population health management.
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

export default PredictiveRiskDashboard;
