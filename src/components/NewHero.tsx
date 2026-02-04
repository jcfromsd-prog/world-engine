import SolveAndEarnButton from './SolveAndEarnButton';
import { motion } from 'framer-motion';

interface NewHeroProps {
    onOpenNeuralLink?: () => void;
}

const NewHero: React.FC<NewHeroProps> = ({ onOpenNeuralLink }) => {
    return (
        <section className="relative py-32 px-6 border-b border-gray-900 bg-black overflow-hidden">
            <div className="relative z-10 max-w-7xl mx-auto text-center">

                {/* MAIN WORDS */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mb-16 font-black text-4xl md:text-6xl lg:text-7xl tracking-tighter"
                >
                    <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">CONNECT</span>
                    <span className="text-gray-800 font-light text-3xl md:text-6xl">/</span>
                    <span className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]">LEARN</span>
                    <span className="text-gray-800 font-light text-3xl md:text-6xl">/</span>
                    <span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.2)]">SOLVE</span>
                    <span className="text-gray-800 font-light text-3xl md:text-6xl">/</span>
                    <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.2)]">EARN</span>
                </motion.div>

                {/* BIG GREEN BUTTON - FINAL TUNING */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="flex justify-center mb-16"
                >
                    <SolveAndEarnButton onClick={onOpenNeuralLink || (() => { })} />
                </motion.div>

                {/* SUB-NAV LINKS */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] md:text-xs text-gray-500 font-bold tracking-widest uppercase mb-20"
                >
                    <span className="hover:text-white cursor-pointer transition-colors">LEARN (AI-TUTORED)</span>
                    <span className="text-gray-800">•</span>
                    <span className="hover:text-white cursor-pointer transition-colors">SQUAD (TEAM UP)</span>
                    <span className="text-gray-800">•</span>
                    <span className="hover:text-white cursor-pointer transition-colors">EARN (CASH XP)</span>
                </motion.div>

                <div className="text-gray-700 text-[10px] tracking-[0.3em] uppercase font-mono">
                    Built with the Global Innovation Stack
                </div>
            </div>
        </section>
    );
};

export default NewHero;
