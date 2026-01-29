const PartnerTicker = () => {
    // Use "Anonymous Authority" titles. 
    // These imply you have clients without needing logos.
    const partners = [
        "FORTUNE 500 RETAILER",
        "TIER-1 AUTOMOTIVE",
        "GLOBAL FINTECH",
        "ENTERPRISE HEALTHCARE",
        "LEADING AI LAB",
        "DEFENSE CONTRACTOR"
    ];

    return (
        <div className="w-full mt-16 overflow-hidden opacity-80">
            <p className="text-center text-xs text-gray-500 uppercase tracking-[0.2em] mb-6 font-bold">
                Powering Innovation At
            </p>

            {/* The Infinite Scroll Track */}
            <div className="relative flex overflow-x-hidden group">
                <div className="flex animate-marquee whitespace-nowrap gap-16 md:gap-24">
                    {/* Double the list for seamless loop */}
                    {[...partners, ...partners].map((partner, index) => (
                        <div key={index} className="flex items-center gap-2 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Abstract Icon (Generic Shield/Globe) */}
                            <span className="text-cyan-500 text-lg">◆</span>

                            <span className="text-sm md:text-lg font-black text-gray-400 group-hover:text-white transition-colors duration-300 uppercase tracking-widest">
                                {partner}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Fade Edges for "High-End" Look */}
                <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

export default PartnerTicker;
