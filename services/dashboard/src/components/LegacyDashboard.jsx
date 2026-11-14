import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Phone, FileText, X } from 'lucide-react';

const LegacyDashboard = () => {
  const [currentDate, setCurrentDate] = useState('December 31, 2024');
  const [selectedTask, setSelectedTask] = useState(null);

  // Sarah's timeline data
  const sarahTimeline = [
    { date: 'Nov 17, 2024', event: 'COL Screening Due Date', status: 'due', icon: '📅' },
    { date: 'Nov 20, 2024', event: 'System generates task', status: 'generated', icon: '📋' },
    { date: 'Nov 25, 2024', event: 'Care coordinator assigned', status: 'assigned', icon: '👩‍💼' },
    { date: 'Dec 2, 2024', event: 'Chart review completed', status: 'reviewed', icon: '📊' },
    { date: 'Dec 5, 2024', event: 'Called member - no answer', status: 'attempted', icon: '📞' },
    { date: 'Dec 8, 2024', event: 'Called PCP office', status: 'attempted', icon: '🏥' },
    { date: 'Dec 12, 2024', event: 'Member callback received', status: 'contact', icon: '☎️' },
    { date: 'Dec 15, 2024', event: 'Scheduled with specialist', status: 'scheduled', icon: '📅' },
    { date: 'Dec 28, 2024', event: 'Screening completed', status: 'completed', icon: '✅' },
    { date: 'Dec 31, 2024', event: 'NON-COMPLIANT (41 days late)', status: 'non-compliant', icon: '❌' }
  ];

  const tasks = [
    {
      id: 1,
      member: 'Sarah Johnson',
      memberId: 'M123456',
      measure: 'COL - Colorectal Cancer Screening',
      dueDate: 'November 17, 2024',
      daysOverdue: 44,
      priority: 'HIGH',
      status: 'In Progress',
      coordinator: 'Jennifer Martinez',
      lastAction: 'Member scheduled screening',
      notes: 'Member finally responded after multiple attempts. Screening scheduled for Dec 28.'
    },
    {
      id: 2,
      member: 'Michael Chen',
      memberId: 'M789012',
      measure: 'CCS - Cervical Cancer Screening',
      dueDate: 'October 15, 2024',
      daysOverdue: 77,
      priority: 'CRITICAL',
      status: 'Pending',
      coordinator: 'Robert Kim',
      lastAction: 'Left voicemail #3',
      notes: 'Unable to reach member. PCP office says member moved.'
    },
    {
      id: 3,
      member: 'Lisa Rodriguez',
      memberId: 'M345678',
      measure: 'WCV - Well-Child Visit',
      dueDate: 'September 30, 2024',
      daysOverdue: 92,
      priority: 'CRITICAL',
      status: 'Escalated',
      coordinator: 'Amanda Foster',
      lastAction: 'Supervisor review',
      notes: 'Multiple failed contact attempts. Case escalated to supervisor.'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'due': return '#FFA500';
      case 'generated': return '#87CEEB';
      case 'assigned': return '#9370DB';
      case 'reviewed': return '#4169E1';
      case 'attempted': return '#FF6347';
      case 'contact': return '#32CD32';
      case 'scheduled': return '#FFD700';
      case 'completed': return '#228B22';
      case 'non-compliant': return '#DC143C';
      default: return '#666';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return '#DC143C';
      case 'HIGH': return '#FF6347';
      case 'MEDIUM': return '#FFA500';
      default: return '#666';
    }
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '15px 20px',
        marginBottom: '20px',
        borderRadius: '5px'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>
          📋 Legacy Care Management System
        </h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>
          Traditional Chase-and-Close Workflow • {currentDate}
        </p>
      </div>

      {/* Alert Banner */}
      <div style={{
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        color: '#721c24',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <AlertTriangle size={20} />
        <div>
          <strong>Year-End Deadline Alert:</strong> 127 care gaps still open with 0 days remaining in measurement year.
          Average closure time: 45 days.
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>127</div>
          <div style={{ color: '#666', fontSize: '14px' }}>Open Care Gaps</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12' }}>45</div>
          <div style={{ color: '#666', fontSize: '14px' }}>Avg Days to Close</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3498db' }}>8</div>
          <div style={{ color: '#666', fontSize: '14px' }}>Care Coordinators</div>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#95a5a6' }}>Manual</div>
          <div style={{ color: '#666', fontSize: '14px' }}>Chart Review</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Task Queue */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#34495e',
            color: 'white',
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            📋 Care Gap Task Queue
          </div>
          <div style={{ padding: '0' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: '15px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  backgroundColor: selectedTask?.id === task.id ? '#f8f9fa' : 'white'
                }}
                onClick={() => setSelectedTask(task)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                      {task.member}
                    </div>
                    <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                      {task.measure}
                    </div>
                    <div style={{ fontSize: '12px', color: '#e74c3c' }}>
                      <Clock size={12} style={{ marginRight: '5px' }} />
                      Due: {task.dueDate} ({task.daysOverdue} days overdue)
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      backgroundColor: getPriorityColor(task.priority),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      marginBottom: '5px'
                    }}>
                      {task.priority}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {task.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sarah's Timeline */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            📅 Sarah's Care Gap Timeline
          </div>
          <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
            {sarahTimeline.map((item, index) => (
              <div key={index} style={{ display: 'flex', marginBottom: '15px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(item.status),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  marginRight: '15px',
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>
                    {item.date}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: item.status === 'non-compliant' ? '#e74c3c' : '#666',
                    fontWeight: item.status === 'non-compliant' ? 'bold' : 'normal'
                  }}>
                    {item.event}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Task Details</h3>
              <button
                onClick={() => setSelectedTask(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong>Member:</strong> {selectedTask.member} ({selectedTask.memberId})
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Measure:</strong> {selectedTask.measure}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Due Date:</strong> {selectedTask.dueDate}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Days Overdue:</strong> <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{selectedTask.daysOverdue}</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Coordinator:</strong> {selectedTask.coordinator}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Last Action:</strong> {selectedTask.lastAction}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Notes:</strong>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '5px', 
                marginTop: '5px',
                fontSize: '14px'
              }}>
                {selectedTask.notes}
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Phone size={16} />
                Call Member
              </button>
              <button style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <FileText size={16} />
                Review Chart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Banner */}
      <div style={{
        backgroundColor: '#34495e',
        color: 'white',
        padding: '15px',
        marginTop: '30px',
        borderRadius: '5px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
          🚨 The Problem: Reactive "Chase-and-Close" Workflow
        </div>
        <div style={{ opacity: 0.9 }}>
          Manual processes • Late interventions • High administrative burden • Poor member experience
        </div>
      </div>
    </div>
  );
};

export default LegacyDashboard;
