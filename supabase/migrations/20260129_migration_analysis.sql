-- World Engine Protocol: Phase 3
-- Migration Analysis Real-Time Data Tables
-- Run this in Supabase SQL Editor

-- =====================================================
-- TABLE: migration_baselines
-- Stores historical baseline values for each data type
-- =====================================================
CREATE TABLE IF NOT EXISTS migration_baselines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    data_type TEXT NOT NULL UNIQUE,
    baseline_value DECIMAL(10, 2) NOT NULL,
    description TEXT,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default baseline
INSERT INTO migration_baselines (data_type, baseline_value, description)
VALUES ('whale_density', 450.0, 'Historical average whale migration density per square kilometer')
ON CONFLICT (data_type) DO NOTHING;

-- =====================================================
-- TABLE: migration_readings
-- Real-time sensor readings with deviation calculations
-- =====================================================
CREATE TABLE IF NOT EXISTS migration_readings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sensor_id TEXT NOT NULL,
    current_value DECIMAL(10, 2) NOT NULL,
    baseline_value DECIMAL(10, 2) NOT NULL,
    deviation_pct DECIMAL(5, 2) NOT NULL,
    is_anomaly BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL,
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries on recent readings
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON migration_readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_sensor ON migration_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_readings_anomaly ON migration_readings(is_anomaly) WHERE is_anomaly = TRUE;

-- =====================================================
-- TABLE: migration_alerts
-- Critical alerts when anomalies are detected
-- =====================================================
CREATE TABLE IF NOT EXISTS migration_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sensor_id TEXT NOT NULL,
    alert_type TEXT NOT NULL,
    deviation_pct DECIMAL(5, 2) NOT NULL,
    current_value DECIMAL(10, 2) NOT NULL,
    message TEXT NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for unacknowledged alerts
CREATE INDEX IF NOT EXISTS idx_alerts_unacknowledged ON migration_alerts(acknowledged) WHERE acknowledged = FALSE;

-- =====================================================
-- REALTIME: Enable for live dashboard updates
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE migration_readings;
ALTER PUBLICATION supabase_realtime ADD TABLE migration_alerts;

-- =====================================================
-- RLS: Row Level Security policies
-- =====================================================
ALTER TABLE migration_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_baselines ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all
CREATE POLICY "Allow read access to readings" ON migration_readings FOR SELECT USING (true);
CREATE POLICY "Allow read access to alerts" ON migration_alerts FOR SELECT USING (true);
CREATE POLICY "Allow read access to baselines" ON migration_baselines FOR SELECT USING (true);

-- Only service role can insert (Edge Functions)
CREATE POLICY "Allow service insert readings" ON migration_readings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow service insert alerts" ON migration_alerts FOR INSERT WITH CHECK (true);
