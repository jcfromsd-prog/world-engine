import React from 'react';
import { Rocket } from 'lucide-react';

interface SolveAndEarnButtonProps {
    onClick: () => void;
    className?: string;
}

const SolveAndEarnButton: React.FC<SolveAndEarnButtonProps> = ({ onClick, className = '' }) => {
    return (
        <div className={`flex justify-center mb-16 relative z-10 ${className}`}>
            <div className="relative group">
                {/* 1. Background Glow - Constrained to button area */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-full bg-lime-500 blur-[40px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-1000 animate-pulse-subtle pointer-events-none"></div>

                <button
                    onClick={onClick}
                    className="
                        relative
                        /* Sharp Metallic Gradient */
                        bg-[linear-gradient(110deg,#a3e635,40%,#22c55e,60%,#a3e635)] 
                        bg-[length:200%_100%]
                        hover:bg-[position:100%_0]
                        
                        text-black 
                        font-[900] 
                        text-xl md:text-2xl 
                        px-16 py-6 
                        rounded-lg 
                        
                        /* Harder, punchier shadow instead of diffuse glow */
                        shadow-[0_0_25px_rgba(132,204,22,0.7)] 
                        hover:shadow-[0_0_50px_rgba(132,204,22,1)] 
                        
                        transition-all duration-300 
                        transform hover:-translate-y-1 hover:scale-105
                        
                        flex items-center gap-4
                        uppercase 
                        tracking-widest
                        border-2 border-lime-300/50
                    "
                >
                    {/* Top Shine Reflection */}
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-90"></div>

                    <Rocket className="fill-black text-black relative z-10" strokeWidth={1.5} size={32} />
                    <span className="relative z-10 drop-shadow-none">SOLVE & EARN</span>
                </button>
            </div>
        </div>
    );
};

export default SolveAndEarnButton;
