/* =========================================================
   3. ONBOARDING UI (Refined via Neural Identity Gate)
   File: src/components/onboarding/GradeSelector.tsx
========================================================= */
import React, { useState } from "react";
import SproutsLanding from "../SimplifiedLanding/SproutsLanding";


// Grade Bands (The 5-tier system)
export const GradeBands = {
    SPROUTS: 2,      // K-2
    BUILDERS: 5,     // 3-5
    TRAILBLAZERS: 8, // 6-8
    EXPLORERS: 12,   // 9-12
    VOYAGERS: 16     // College/Adult
} as const;

interface GradeSelectorProps {
    onSubmit: (grade: number) => void;
}

export const GradeSelector: React.FC<GradeSelectorProps> = ({ onSubmit }) => {
    // Default to Builders (safe middle ground if no selection)
    const [selectedGrade, setSelectedGrade] = useState<number>(GradeBands.BUILDERS);
    const [showSproutsUI, setShowSproutsUI] = useState(false);

    const handleGradeChange = (val: number) => {
        setSelectedGrade(val);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (selectedGrade === GradeBands.SPROUTS) {
            setShowSproutsUI(true);
            // We don't call onSubmit yet, we let the SproutsLanding handle the "Go" signal
        } else {
            onSubmit(selectedGrade);
        }
    };

    const handleSproutsStart = () => {
        onSubmit(GradeBands.SPROUTS);
    };

    if (showSproutsUI) {
        return <SproutsLanding onStart={handleSproutsStart} />;
    }

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-slate-800 rounded-xl border border-slate-700 max-w-md w-full mx-auto shadow-2xl">
            <h3 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-blue-400">🎓</span> Neural Identity Gate
            </h3>

            <div className="mb-6">
                <label htmlFor="gradeSelect" className="block text-slate-400 mb-2 font-medium">
                    Select Your Archetype Level
                </label>
                <select
                    id="gradeSelect"
                    value={selectedGrade}
                    onChange={(e) => handleGradeChange(parseInt(e.target.value))}
                    className="w-full p-3 bg-slate-900 text-white rounded-lg border border-slate-600 focus:border-blue-500 outline-none transition-all hover:border-slate-500"
                >
                    <option value={GradeBands.SPROUTS}>🌱 Sprouts (K-2)</option>
                    <option value={GradeBands.BUILDERS}>🛠️ Builders (3-5)</option>
                    <option value={GradeBands.TRAILBLAZERS}>🌲 Trailblazers (6-8)</option>
                    <option value={GradeBands.EXPLORERS}>🧭 Explorers (9-12)</option>
                    <option value={GradeBands.VOYAGERS}>🚀 Voyagers (College+)</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">
                    {selectedGrade === GradeBands.SPROUTS
                        ? "Activates simplified visuals & audio helper."
                        : "Sage calibrates mission difficulty to this level."}
                </p>
            </div>

            <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-500/20"
            >
                Initialize Identity
            </button>
        </form>
    );
};
