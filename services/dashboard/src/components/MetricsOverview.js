import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Brain,
  Zap
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const MetricsOverview = () => {
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    messagesProcessed: 1247,
    successRate: 95.2,
    avgProcessingTime: 1.1,
    activeConnections: 23,
    aiConfidence: 94.8,
    fhirCompliance: 99.1,
    careGapsIdentified: 156,
    interventionsTriggered: 89
  });

  const [processingTrend, setProcessingTrend] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState({});
  const [evidenceSources, setEvidenceSources] = useState({});

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        messagesProcessed: prev.messagesProcessed + Math.floor(Math.random() * 3),
        successRate: 95.0 + Math.random() * 1.0,
        avgProcessingTime: 1.0 + Math.random() * 0.4,
        activeConnections: 20 + Math.floor(Math.random() * 10),
        aiConfidence: 94.0 + Math.random() * 2.0,
        careGapsIdentified: prev.careGapsIdentified + Math.floor(Math.random() * 2)
      }));

      // Update processing trend
      const now = new Date();
      const timeLabel = now.toLocaleTimeString();
      setProcessingTrend(prev => {
        const newData = [...prev, {
          time: timeLabel,
          messages: Math.floor(Math.random() * 10) + 5,
          success: 95 + Math.random() * 5
        }].slice(-10); // Keep last 10 data points
        return newData;
      });
    }, 3000);

    // Initialize charts data
    setRiskDistribution({
      high: 23,
      medium: 45,
      low: 32
    });

    setEvidenceSources({
      'HL7 ORU/MDM': 42,
      'FHIR R4 CA Bundles': 38,
      'Claims Processed': 31,
      'Lab Results': 24
    });

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      title: 'Messages Processed',
      value: realTimeMetrics.messagesProcessed.toLocaleString(),
      change: '+12.3%',
      icon: Activity,
      color: '#0066CC',
      trend: 'up'
    },
    {
      title: 'Success Rate',
      value: `${realTimeMetrics.successRate.toFixed(1)}%`,
      change: '+0.3%',
      icon: CheckCircle,
      color: '#10B981',
      trend: 'up'
    },
    {
      title: 'Avg Processing Time',
      value: `${realTimeMetrics.avgProcessingTime.toFixed(1)}s`,
      change: '-0.2s',
      icon: Clock,
      color: '#FF6B35',
      trend: 'down'
    },
    {
      title: 'AI Confidence',
      value: `${realTimeMetrics.aiConfidence.toFixed(1)}%`,
      change: '+1.2%',
      icon: Brain,
      color: '#8B5CF6',
      trend: 'up'
    },
    {
      title: 'FHIR Compliance',
      value: `${realTimeMetrics.fhirCompliance.toFixed(1)}%`,
      change: '+0.1%',
      icon: CheckCircle,
      color: '#0066CC',
      trend: 'up'
    },
    {
      title: 'Care Gaps Found',
      value: realTimeMetrics.careGapsIdentified.toString(),
      change: '+8 today',
      icon: AlertTriangle,
      color: '#F59E0B',
      trend: 'up'
    },
    {
      title: 'Active Connections',
      value: realTimeMetrics.activeConnections.toString(),
      change: '+2',
      icon: Users,
      color: '#00A651',
      trend: 'up'
    },
    {
      title: 'Interventions Triggered',
      value: realTimeMetrics.interventionsTriggered.toString(),
      change: '+5 today',
      icon: Zap,
      color: '#10B981',
      trend: 'up'
    }
  ];

  const processingTrendData = {
    labels: processingTrend.map(d => d.time),
    datasets: [
      {
        label: 'Messages/min',
        data: processingTrend.map(d => d.messages),
        borderColor: 'var(--primary-blue)',
        backgroundColor: 'rgba(0, 102, 204, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const riskDistributionData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [riskDistribution.high, riskDistribution.medium, riskDistribution.low],
        backgroundColor: [
          '#EF4444', // Red for high risk
          '#F59E0B', // Yellow for medium risk
          '#10B981'  // Green for low risk
        ],
        borderWidth: 0
      }
    ]
  };

  const evidenceSourcesData = {
    labels: Object.keys(evidenceSources),
    datasets: [
      {
        label: 'Evidence Sources (%)',
        data: Object.values(evidenceSources),
        backgroundColor: [
          '#0066CC', // Primary blue for HL7 ORU/MDM
          '#00A651', // Secondary green for FHIR R4 CA Bundles
          '#8B5CF6', // Purple for Claims Processed
          '#10B981'  // Success green for Lab Results
        ],
        borderColor: [
          '#0052A3',
          '#059669',
          '#7C3AED',
          '#059669'
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="metrics-overview">
      {/* Real-time Metrics Grid */}
      <div className="metrics-grid">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              className="metric-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="metric-value" style={{ color: metric.color }}>
                    {metric.value}
                  </div>
                  <div className="metric-label">{metric.title}</div>
                  <div className={`metric-change ${metric.trend === 'up' ? 'positive' : 'negative'}`}>
                    <TrendingUp className={`inline w-3 h-3 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                    {metric.change}
                  </div>
                </div>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: metric.color }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Processing Trend */}
        <motion.div
          className="glass-card col-span-1 lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Real-time Processing Trend</h3>
          <div className="h-64">
            <Line data={processingTrendData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Risk Distribution</h3>
          <div className="h-64">
            <Doughnut data={riskDistributionData} options={{ ...chartOptions, cutout: '60%' }} />
          </div>
        </motion.div>

        {/* Evidence Sources */}
        <motion.div
          className="glass-card col-span-1 lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Evidence Sources Distribution</h3>
          <div className="h-64">
            <Bar data={evidenceSourcesData} options={chartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MetricsOverview;
