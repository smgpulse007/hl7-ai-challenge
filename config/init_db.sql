-- HEDIS AI Platform Database Initialization
-- PostgreSQL Database Schema for Healthcare Quality Management

-- Create database if not exists (handled by POSTGRES_DB environment variable)

-- Create tables for the HEDIS AI Platform
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    insurance_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS care_gaps (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(50) REFERENCES members(member_id),
    measure_code VARCHAR(20) NOT NULL,
    measure_name VARCHAR(200) NOT NULL,
    gap_status VARCHAR(20) DEFAULT 'OPEN',
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_assessments (
    id SERIAL PRIMARY KEY,
    member_id VARCHAR(50) REFERENCES members(member_id),
    risk_score DECIMAL(5,2),
    risk_level VARCHAR(20),
    prediction_confidence DECIMAL(5,2),
    factors JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hl7_messages (
    id SERIAL PRIMARY KEY,
    message_type VARCHAR(20),
    message_content TEXT,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    member_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'PROCESSED'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_member_id ON members(member_id);
CREATE INDEX IF NOT EXISTS idx_care_gaps_member_id ON care_gaps(member_id);
CREATE INDEX IF NOT EXISTS idx_care_gaps_status ON care_gaps(gap_status);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_member_id ON risk_assessments(member_id);
CREATE INDEX IF NOT EXISTS idx_hl7_messages_member_id ON hl7_messages(member_id);

-- Insert sample data for demo
INSERT INTO members (member_id, first_name, last_name, date_of_birth, gender, phone, email, insurance_id) VALUES
('M001', 'John', 'Smith', '1965-03-15', 'M', '555-0101', 'john.smith@email.com', 'INS001'),
('M002', 'Sarah', 'Johnson', '1972-08-22', 'F', '555-0102', 'sarah.johnson@email.com', 'INS002'),
('M003', 'Michael', 'Brown', '1958-11-30', 'M', '555-0103', 'michael.brown@email.com', 'INS003')
ON CONFLICT (member_id) DO NOTHING;

-- Insert sample care gaps
INSERT INTO care_gaps (member_id, measure_code, measure_name, gap_status, due_date, priority) VALUES
('M001', 'CCS', 'Cervical Cancer Screening', 'OPEN', '2025-12-31', 'HIGH'),
('M002', 'COL', 'Colorectal Cancer Screening', 'OPEN', '2025-09-30', 'MEDIUM'),
('M003', 'WCV', 'Well-Child Visits', 'OPEN', '2025-08-31', 'HIGH')
ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Database initialization complete
SELECT 'HEDIS AI Platform database initialized successfully' AS status;
