// Synthetic Data Loader for Demo
// This simulates loading from our comprehensive synthetic data files

export const loadSyntheticData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    // Multi-Source Integration Demo Data
    multiSourceDemo: {
      patients: [
        {
          id: "99990001000000",
          name: "Maria Rodriguez",
          age: 35,
          measure: "CCS",
          emrView: {
            status: "GAP IDENTIFIED",
            lastScreening: "Not documented in EMR",
            confidence: "Low - Incomplete Data",
            projectedCost: "$50 outreach required",
            dataSource: "Epic EMR Only"
          },
          multiSourceView: {
            status: "COMPLIANT", 
            lastScreening: "2024-07-22 - Community Health Clinic",
            confidence: "High - Complete Picture",
            projectedSavings: "$50 outreach avoided",
            dataSource: "Multi-Source Integration",
            sources: [
              {
                type: "HL7 Lab Results",
                date: "2024-07-22",
                facility: "Community Health Clinic",
                result: "Pap smear - Normal cytology (LOINC: 33717-0)",
                status: "completed",
                color: "green"
              },
              {
                type: "HIE Data", 
                date: "2024-07-22",
                facility: "Regional HIE Network",
                result: "Cervical screening procedure documented",
                status: "completed",
                color: "blue"
              },
              {
                type: "Claims Data",
                date: "2024-07-25", 
                facility: "Claims Processing System",
                result: "CPT 88150 - Cytopathology, cervical/vaginal",
                status: "processed",
                color: "purple"
              },
              {
                type: "Pharmacy Data",
                date: "2024-07-20",
                facility: "CVS Pharmacy #4521", 
                result: "Anxiety medication filled (pre-procedure)",
                status: "supporting",
                color: "orange"
              }
            ]
          }
        }
      ]
    },

    // Predictive Analytics Demo Data
    predictiveDemo: {
      populations: {
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
        },
        COL: {
          totalDue: 634,
          traditional: {
            approach: "Contact All Members",
            cost: 31700,
            contactRate: 100,
            successRate: 22,
            completions: 139
          },
          predictive: {
            approach: "Focus High-Risk Members",
            highRiskCount: 158,
            cost: 7900,
            contactRate: 25,
            successRate: 70,
            completions: 111,
            efficiency: 75
          }
        }
      },
      riskDistribution: [
        { name: 'High Risk', value: 312, color: '#ef4444', likelihood: '15%' },
        { name: 'Medium Risk', value: 467, color: '#f59e0b', likelihood: '45%' },
        { name: 'Low Risk', value: 468, color: '#10b981', likelihood: '85%' }
      ],
      highRiskMembers: [
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
      ]
    },

    // Multi-Industry Platform Demo Data
    multiIndustryDemo: {
      industries: {
        'health-plan': {
          title: 'Health Plan Operations',
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
        },
        'health-system': {
          title: 'Health System Population Health',
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
        },
        'individual-practice': {
          title: 'Individual Practice Management',
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
    },

    // Live Platform Metrics
    liveMetrics: {
      totalMembers: 450000,
      careGapsIdentified: 5,
      projectedSavings: 46750,
      successRate: 65,
      servicesHealthy: 3,
      processingTime: 2.1,
      fhirResourcesCreated: 15,
      riskPredictionsGenerated: 24
    }
  };
};

// Simulate real-time updates
export const getLiveMetrics = () => {
  return {
    totalMembers: 450000,
    careGapsIdentified: Math.floor(Math.random() * 3) + 4,
    projectedSavings: 46750 + Math.floor(Math.random() * 5000),
    successRate: 65 + Math.floor(Math.random() * 10),
    servicesHealthy: 3,
    processingTime: 2.0 + Math.random() * 0.5,
    fhirResourcesCreated: 12 + Math.floor(Math.random() * 6),
    riskPredictionsGenerated: 20 + Math.floor(Math.random() * 8)
  };
};
