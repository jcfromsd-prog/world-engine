import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface MigrationReading {
    id: string;
    sensor_id: string;
    current_value: number;
    baseline_value: number;
    deviation_pct: number;
    is_anomaly: boolean;
    status: string;
    action_taken: string;
    created_at: string;
}

interface LiveInsightsProps {
    maxReadings?: number;
}

const LiveInsights: React.FC<LiveInsightsProps> = ({ maxReadings = 10 }) => {
    const [readings, setReadings] = useState<MigrationReading[]>([]);
    const [latestReading, setLatestReading] = useState<MigrationReading | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial readings
    useEffect(() => {
        const fetchReadings = async () => {
            const { data, error } = await supabase
                .from('migration_readings')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(maxReadings);

            if (!error && data) {
                setReadings(data);
                if (data.length > 0) {
                    setLatestReading(data[0]);
                }
            }
            setIsLoading(false);
        };

        fetchReadings();
    }, [maxReadings]);

    // Real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel('live-readings')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'migration_readings' },
                (payload) => {
                    const newReading = payload.new as MigrationReading;
                    setLatestReading(newReading);
                    setReadings(prev => [newReading, ...prev.slice(0, maxReadings - 1)]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [maxReadings]);

    // Simulate a reading (for demo purposes)
    const simulateReading = async () => {
        const baseline = 450;
        const variation = Math.random() * 200 - 50; // -50 to +150
        const currentReading = baseline + variation;

        try {
            await supabase.functions.invoke('analyze-migration', {
                body: {
                    current_reading: currentReading,
                    sensor_id: 'SENSOR_ALPHA',
                    data_type: 'whale_density'
                }
            });
        } catch (error) {
            console.error('Failed to invoke analysis:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center">
                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                <p className="text-slate-500 mt-4 text-sm">Connecting to sensors...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-white font-bold">Live Insights Dashboard</h3>
                    <span className="text-xs text-slate-500 font-mono">Phase 3 Protocol</span>
                </div>
                <button
                    onClick={simulateReading}
                    className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full hover:bg-cyan-500/30 transition"
                >
                    🔬 Simulate Reading
                </button>
            </div>

            {/* Current Status Card */}
            {latestReading && (
                <motion.div
                    key={latestReading.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 border-b ${latestReading.is_anomaly
                            ? 'border-red-500/30 bg-red-900/20'
                            : 'border-slate-700 bg-slate-800/50'
                        }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">
                                {latestReading.is_anomaly ? '⚠️' : '✅'}
                            </span>
                            <div>
                                <h4 className={`text-lg font-bold ${latestReading.is_anomaly ? 'text-red-400' : 'text-emerald-400'
                                    }`}>
                                    {latestReading.status}
                                </h4>
                                <p className="text-xs text-slate-500">{latestReading.sensor_id}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-mono font-bold text-white">
                                {latestReading.deviation_pct}%
                            </p>
                            <p className="text-xs text-slate-500">Deviation</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-900 p-3 rounded-lg">
                            <span className="text-xs text-slate-500">Current Reading</span>
                            <p className="text-lg font-mono text-cyan-400">{latestReading.current_value}</p>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-lg">
                            <span className="text-xs text-slate-500">Baseline</span>
                            <p className="text-lg font-mono text-slate-400">{latestReading.baseline_value}</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-400">
                        <span className="text-cyan-400 font-bold">Sage Logic:</span> {latestReading.action_taken}
                    </p>
                </motion.div>
            )}

            {/* Feed of Recent Readings */}
            <div className="p-4">
                <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Recent Readings</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    <AnimatePresence>
                        {readings.map((reading, i) => (
                            <motion.div
                                key={reading.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`flex items-center justify-between p-3 rounded-lg ${reading.is_anomaly
                                        ? 'bg-red-900/20 border border-red-500/20'
                                        : 'bg-slate-800/50 border border-slate-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-sm">
                                        {reading.is_anomaly ? '🔴' : '🟢'}
                                    </span>
                                    <div>
                                        <p className="text-sm text-white font-medium">
                                            {reading.current_value} / {reading.baseline_value}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(reading.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-sm font-mono font-bold ${reading.is_anomaly ? 'text-red-400' : 'text-emerald-400'
                                    }`}>
                                    {reading.deviation_pct}%
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {readings.length === 0 && (
                        <p className="text-center text-slate-500 text-sm py-8">
                            No readings yet. Click "Simulate Reading" to test the system.
                        </p>
                    )}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-between text-xs">
                <span className="text-slate-500">
                    Total Readings: <span className="text-white">{readings.length}</span>
                </span>
                <span className="text-slate-500">
                    Anomalies: <span className="text-red-400">{readings.filter(r => r.is_anomaly).length}</span>
                </span>
                <span className="text-slate-500">
                    Threshold: <span className="text-cyan-400">15%</span>
                </span>
            </div>
        </div>
    );
};

export default LiveInsights;
