/* =========================================================
   4. PATH LOGIC (Dynamic)
   File: src/services/PathEngine.ts
========================================================= */

import { GradeBand } from "./RecommendationEngine";

export interface SystemPath {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export function getRecommendedPaths(gradeLevel: number): SystemPath[] {
    // Elementary Logic (Grades K-5)
    if (gradeLevel <= GradeBand.FIFTH) {
        return [
            {
                id: "path_sticker",
                title: "Sticker Artist",
                description: "Draw fun characters for stories.",
                icon: "🎨"
            },
            {
                id: "path_teller",
                title: "Story Teller",
                description: "Tell a tale about a dragon.",
                icon: "🐉"
            }
        ];
    }

    // High School / Adult Logic (Grade 6+)
    return [
        {
            id: "path_pixel",
            title: "Pixel Weaver",
            description: "Create generative assets for the metaverse.",
            icon: "👾"
        },
        {
            id: "path_smith",
            title: "Story Smith",
            description: "Write compelling narratives that convert.",
            icon: "✍️"
        }
    ];
}
