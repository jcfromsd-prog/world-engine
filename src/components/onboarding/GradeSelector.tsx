/* =========================================================
   3. ONBOARDING UI (Refined)
   File: src/components/onboarding/GradeSelector.tsx
========================================================= */
import React, { useState } from "react";
import { GradeBand } from "../../services/RecommendationEngine";

interface GradeSelectorProps {
    onSubmit: (grade: number) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({ onSubmit }) => {
    // Default to 2nd grade
    const [selectedGrade, setSelectedGrade] = useState<number>(GradeBand.SECOND);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(selectedGrade);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-800 rounded-xl border border-slate-700 max-w-md w-full mx-auto shadow-2xl">
            <h3 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-blue-400">🎓</span> Select Your Learning Level
            </h3>

            <div className="mb-6">
                <label htmlFor="gradeSelect" className="block text-slate-400 mb-2 font-medium">
                    Current Grade / Stage
                </label>
                <select
                    id="gradeSelect"
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
                    className="w-full p-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 outline-none transition-all hover:border-slate-500"
                >
                    <option value={GradeBand.SECOND}>2nd Grade (Elementary)</option>
                    <option value={GradeBand.FIFTH}>5th Grade (Middle)</option>
                    <option value={GradeBand.SOPHOMORE}>High School Sophomore</option>
                    <option value={GradeBand.ADULT}>College / Adult</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">This helps Sage calibrate your initial missions.</p>
            </div>

            <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/20"
            >
                Start My Journey
            </button>
        </form>
    );
};
