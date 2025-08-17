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
      'Clinical Notes': 35,
      'Lab Results': 28,
      'Imaging Reports': 18,
      'Medication History': 19
    });

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      title: 'Messages Processed',
      value: realTimeMetrics.messagesProcessed.toLocaleString(),
      change: '+12.3%',
      icon: Activity,
      color: 'var(--primary-blue)',
      trend: 'up'
    },
    {
      title: 'Success Rate',
      value: `${realTimeMetrics.successRate.toFixed(1)}%`,
      change: '+0.3%',
      icon: CheckCircle,
      color: 'var(--success-green)',
      trend: 'up'
    },
    {
      title: 'Avg Processing Time',
      value: `${realTimeMetrics.avgProcessingTime.toFixed(1)}s`,
      change: '-0.2s',
      icon: Clock,
      color: 'var(--accent-orange)',
      trend: 'down'
    },
    {
      title: 'AI Confidence',
      value: `${realTimeMetrics.aiConfidence.toFixed(1)}%`,
      change: '+1.2%',
      icon: Brain,
      color: 'var(--secondary-green)',
      trend: 'up'
    },
    {
      title: 'FHIR Compliance',
      value: `${realTimeMetrics.fhirCompliance.toFixed(1)}%`,
      change: '+0.1%',
      icon: CheckCircle,
      color: 'var(--primary-blue)',
      trend: 'up'
    },
    {
      title: 'Care Gaps Found',
      value: realTimeMetrics.careGapsIdentified.toString(),
      change: '+8 today',
      icon: AlertTriangle,
      color: 'var(--warning-yellow)',
      trend: 'up'
    },
    {
      title: 'Active Connections',
      value: realTimeMetrics.activeConnections.toString(),
      change: '+2',
      icon: Users,
      color: 'var(--text-light)',
      trend: 'up'
    },
    {
      title: 'Interventions Triggered',
      value: realTimeMetrics.interventionsTriggered.toString(),
      change: '+5 today',
      icon: Zap,
      color: 'var(--accent-orange)',
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
          'var(--error-red)',
          'var(--warning-yellow)',
          'var(--success-green)'
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
          'var(--primary-blue)',
          'var(--secondary-green)',
          'var(--accent-orange)',
          'var(--warning-yellow)'
        ],
        borderRadius: 4
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
