import { useState } from 'react';
import {
    Square, Triangle, Circle, Hexagon,
    Leaf, Flower2, CloudRain, TreeDeciduous,
    Battery, Zap, Cpu, Wifi,
    Shield, Lock, Key, Database
} from 'lucide-react';

export type TaskTheme = 'NATURE' | 'TECH' | 'SECURITY' | 'DEFAULT';

interface PatternMatchTaskProps {
    onComplete: () => void;
    theme?: TaskTheme;
}

export default function PatternMatchTask({ onComplete, theme = 'DEFAULT' }: PatternMatchTaskProps) {
    const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    // ----------------- THEME CONFIGURATION -----------------
    const themeConfig = {
        NATURE: {
            validSort: ['Leaf', 'Flower', 'Tree', 'Rain'],
            items: ['Leaf', 'Tree', 'Rain', 'Flower'], // Scrambled inventory
            colors: ['text-green-500', 'text-pink-500', 'text-emerald-700', 'text-blue-400'], // Leaf, Flower, Tree, Rain
            icons: [Leaf, Flower2, TreeDeciduous, CloudRain],
            hint: "GROWTH CYCLE: Sprout → Bloom → Forest → Storm",
            title: "Ecological Sorting Protocol"
        },
        TECH: {
            validSort: ['Battery', 'Cpu', 'Wifi', 'Zap'],
            items: ['Zap', 'Wifi', 'Battery', 'Cpu'],
            colors: ['text-yellow-400', 'text-blue-500', 'text-cyan-400', 'text-orange-500'],
            icons: [Battery, Cpu, Wifi, Zap],
            hint: "CIRCUIT FLOW: Power → Process → Transmit → Charge",
            title: "Hardware Diagnostic Sort"
        },
        SECURITY: {
            validSort: ['Shield', 'Lock', 'Key', 'Database'],
            items: ['Database', 'Key', 'Shield', 'Lock'],
            colors: ['text-blue-600', 'text-red-500', 'text-yellow-500', 'text-purple-500'],
            icons: [Shield, Lock, Key, Database],
            hint: "SECURE CHAIN: Defend → Encrypt → Access → Store",
            title: "Cryptographic Key Alignment"
        },
        DEFAULT: {
            validSort: ['Square', 'Circle', 'Triangle', 'Hexagon'],
            items: ['Circle', 'Hexagon', 'Square', 'Triangle'],
            colors: ['text-blue-400', 'text-red-400', 'text-green-400', 'text-yellow-400'],
            icons: [Square, Circle, Triangle, Hexagon],
            hint: "LOGIC SEQUENCE: [ 🟦 ] → [ 🔴 ] → [ 🟢 ] → [ 🟨 ]",
            title: "Pattern Recognition Protocol"
        }
    };

    const activeConfig = themeConfig[theme] || themeConfig.DEFAULT;

    // Helper to get component for item name
    const getIcon = (name: string | null, size: number = 24) => {
        if (!name) return null;

        // Find index in validSort or items to determine color/icon
        // const sortIdx = activeConfig.validSort.indexOf(name);
        // const itemIdx = activeConfig.items.indexOf(name);

        // Use the index to grab the right icon/color from the CONFIG arrays
        // We match by Name, seeking the index in validSort allows us to keep color consistency
        const configIndex = activeConfig.validSort.indexOf(name);

        if (configIndex === -1) return null; // Should not happen

        const IconComponent = activeConfig.icons[configIndex];
        const colorClass = activeConfig.colors[configIndex];

        return <IconComponent size={size} className={colorClass} />;
    };

    const handleDrop = (slotIndex: number) => {
        if (draggedItem) {
            const newSlots = [...slots];
            newSlots[slotIndex] = draggedItem;
            setSlots(newSlots);

            // Check win condition
            if (newSlots.every((item, idx) => item === activeConfig.validSort[idx])) {
                setTimeout(onComplete, 500);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/50 rounded-2xl border border-gray-800 w-full max-w-4xl h-[500px] relative overflow-hidden">
            {/* Background Flair */}
            <div className={`absolute top-0 w-full h-1 ${theme === 'NATURE' ? 'bg-green-500' : theme === 'TECH' ? 'bg-yellow-500' : 'bg-blue-500'} opacity-50`}></div>

            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest text-center">{activeConfig.title}</h2>
            <div className="text-xs font-mono text-gray-500 mb-8">{theme === 'DEFAULT' ? 'CALIBRATION MODE' : `MODE: ${theme}_OPERATIONS`}</div>

            {/* The Target Slots */}
            <div className="flex gap-4 mb-16">
                {slots.map((slot, i) => (
                    <div
                        key={i}
                        className={`w-24 h-24 border-2 border-dashed rounded-xl flex items-center justify-center transition-all ${slot ? 'border-green-500 bg-green-900/20' : 'border-gray-600 bg-black/20'}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(i)}
                    >
                        {slot ? getIcon(slot, 40) : <span className="text-gray-700 font-mono text-xs">SLOT {i + 1}</span>}
                    </div>
                ))}
            </div>

            {/* The Inventory */}
            <div className="bg-black p-6 rounded-xl border border-gray-800 relative z-10">
                <div className="text-gray-500 text-xs uppercase tracking-widest mb-4 text-center">Available Assets</div>
                <div className="flex gap-6">
                    {activeConfig.items.map((item, i) => (
                        <div
                            key={i}
                            draggable
                            onDragStart={() => setDraggedItem(item)}
                            className="p-4 bg-zinc-800 rounded-lg cursor-grab hover:bg-zinc-700 active:cursor-grabbing border border-gray-700 hover:border-white transition-all shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1"
                        >
                            {getIcon(item, 32)}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-500 font-mono bg-zinc-950 px-4 py-2 rounded border border-gray-800">
                HINT: {activeConfig.hint}
            </div>
        </div>
    );
}
