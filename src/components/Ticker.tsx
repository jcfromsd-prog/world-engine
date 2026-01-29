import { motion } from "framer-motion";

const Ticker = () => {
    const logos = [
        "DEPLOYED ON VERCEL",
        "SECURED BY STRIPE",
        "REAL-TIME VIA SUPABASE",
        "INTELLIGENCE BY OPENAI",
        "ANIMATED BY FRAMER MOTION"
    ];

    // Duplicate the array to create a seamless infinite loop
    const duplicatedLogos = [...logos, ...logos];

    return (
        <div className="w-full overflow-hidden bg-black border-t border-white/10 py-4">
            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: ["0%", "-50%"], // Moves exactly half the width (one full set of logos)
                }}
                transition={{
                    ease: "linear",
                    duration: 20, // Adjust this number to change speed (higher = slower)
                    repeat: Infinity,
                }}
            >
                {duplicatedLogos.map((logo, index) => (
                    <div key={index} className="flex items-center px-8">
                        <span className="text-xs font-bold tracking-widest text-cyan-400/60 uppercase">
                            {logo}
                        </span>
                        <span className="mx-8 h-1 w-1 rounded-full bg-cyan-400/30" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Ticker;
