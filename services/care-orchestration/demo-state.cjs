'use strict';

// Purpose-built synthetic fixtures, independent of the historical sample files.
function initialMembers() {
  return ['CCS', 'COL', 'WCV', 'CCS', 'COL', 'WCV'].map((measure, index) => ({
    member_id: `demo-${String(index + 1).padStart(3, '0')}`,
    name: `Demo Member ${String(index + 1).padStart(2, '0')}`,
    age: measure === 'WCV' ? 8 : 45,
    language: 'English',
    measure_type: measure,
    risk_level: ['HIGH', 'MEDIUM', 'LOW'][index % 3],
    risk_probability: [0.8, 0.5, 0.2][index % 3],
    evidence_found: index % 2 === 0,
    evidence_source: index % 2 === 0 ? 'Synthetic fixture' : 'NONE',
    clinical_quote: index % 2 === 0 ? 'Synthetic screening record available for review.' : '',
    risk_factors: ['Illustrative priority assigned by the fixture; no model inference'],
    protective_factors: [],
    intervention_due_date: 'Illustrative only',
    gap_status: 'open',
    synthetic: true,
  }));
}

function createDemoState() {
  let members = initialMembers();
  let events = [];
  let sequence = 0;
  const limit = 100;
  return {
    get members() { return members; },
    get events() { return events; },
    get full() { return events.length >= limit; },
    append(type, details) {
      const event = { id: ++sequence, type, timestamp: new Date().toISOString(), ...details };
      events.push(event);
      return event;
    },
    reset() { members = initialMembers(); events = []; sequence = 0; },
    statistics() {
      const count = predicate => members.filter(predicate).length;
      return {
        total_members: members.length,
        high_risk: count(m => m.risk_level === 'HIGH'),
        medium_risk: count(m => m.risk_level === 'MEDIUM'),
        low_risk: count(m => m.risk_level === 'LOW'),
        evidence_found: count(m => m.evidence_found),
        closed_gaps: count(m => m.gap_status === 'closed'),
        evidence_sources: { 'Synthetic fixture': count(m => m.evidence_found), NONE: count(m => !m.evidence_found) },
        measures: Object.fromEntries(['CCS', 'COL', 'WCV'].map(type => [type, count(m => m.measure_type === type)])),
        synthetic: true,
      };
    },
  };
}

module.exports = { createDemoState };
