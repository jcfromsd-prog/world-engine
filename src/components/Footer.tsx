import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-black border-t border-slate-900 py-8 text-center font-sans">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 text-xs text-slate-500">
                <span>MyBestPurpose © 2026</span>

                <Link to="/about" className="text-slate-400 hover:text-white transition font-medium p-3 md:p-0">
                    Meet the Founder
                </Link>

                <a href="mailto:support@mybestpurpose.com" className="text-slate-400 hover:text-white transition font-medium p-3 md:p-0">
                    Contact
                </a>


                <Link to="/trust" className="text-slate-400 hover:text-white transition font-medium p-3 md:p-0">
                    Trust Center
                </Link>

                <Link to="/economics" className="text-slate-400 hover:text-white transition font-medium p-3 md:p-0">
                    Economics
                </Link>

                <Link to="/charter" className="text-slate-400 hover:text-white transition font-medium p-3 md:p-0">
                    Founding Charter
                </Link>

                <Link to="/ip-policy" className="text-slate-400 hover:text-white transition font-medium p-3 md:p-0">
                    IP & Privacy
                </Link>

                {/* HIDDEN FOUNDER LINK - Only visible if authenticated */}
                {localStorage.getItem('SOVEREIGN_ACCESS_TOKEN') && (
                    <button
                        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'G', code: 'KeyG', ctrlKey: true, shiftKey: true }))}
                        className="text-emerald-900 hover:text-emerald-500 transition font-mono p-3 md:p-0 uppercase tracking-widest text-[10px]"
                    >
                        [COMMAND_CENTER]
                    </button>
                )}
            </div>
        </footer>
    );
};

export default Footer;
