import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-black border-t border-slate-900 py-8 text-center font-sans">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-xs text-slate-500">
                <span>MyBestPurpose © 2026</span>

                <Link to="/about" className="text-slate-400 hover:text-white transition font-medium">
                    Meet the Founder
                </Link>

                <a href="mailto:support@mybestpurpose.com" className="text-slate-400 hover:text-white transition font-medium">
                    Contact
                </a>

                <Link to="/ip-policy" className="text-slate-400 hover:text-white transition font-medium">
                    IP & Privacy
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
