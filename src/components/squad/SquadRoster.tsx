import React from "react";
import type { Squad, UserVector } from "../../services/SquadMatcher";

interface SquadRosterProps {
    squads: Squad[];
    unmatched: UserVector[];
}

export const SquadRoster: React.FC<SquadRosterProps> = ({ squads, unmatched }) => (
    <div className="space-y-4">
        <h3 className="text-white font-bold text-lg">Matched Squads</h3>
        {squads.length === 0 && (
            <p className="text-gray-500 italic">No squads formed yet.</p>
        )}
        {squads.map((squad) => (
            <div
                key={squad.id}
                className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4"
            >
                <div className="flex justify-between items-center mb-2">
                    <strong className="text-green-400">{squad.name}</strong>
                    <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full">
                        {(squad.compatibilityScore * 100).toFixed(0)}% match
                    </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{squad.reason}</p>
                <ul className="space-y-1">
                    {squad.members.map((member) => (
                        <li key={member.id} className="text-gray-300 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {member.archetype}
                            <span className="text-gray-500 text-xs">
                                (θ: {member.skillTheta.toFixed(1)})
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        ))}

        {unmatched.length > 0 && (
            <>
                <h3 className="text-white font-bold text-lg mt-4">Seeking Squad</h3>
                <div className="space-y-2">
                    {unmatched.map((user) => (
                        <div
                            key={user.id}
                            className="text-gray-400 text-sm flex items-center gap-2 bg-zinc-900/50 p-2 rounded"
                        >
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                            {user.archetype}
                            <span className="text-gray-600 text-xs">
                                (θ: {user.skillTheta.toFixed(1)})
                            </span>
                        </div>
                    ))}
                </div>
            </>
        )}
    </div>
);
