import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-black border-t border-slate-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                {/* Brand Column */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black text-white tracking-tighter">WORLD ENGINE</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        The liquid marketplace for engineering talent.
                        Deploying capital, verifying skill, and accelerating the future.
                    </p>
                    <div className="flex gap-4 pt-2">
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-cyan-400 transition">
                            𝕏
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-purple-400 transition">
                            Discord
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-600 hover:text-white transition">
                            GitHub
                        </a>
                    </div>
                </div>

                {/* Explore */}
                <div>
                    <h4 className="font-bold text-white mb-6">Explore</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li><Link to="/" className="hover:text-cyan-400 transition">Home</Link></li>
                        <li><Link to="/about" className="hover:text-cyan-400 transition">Manifesto</Link></li>
                        <li><Link to="/workspace" className="hover:text-cyan-400 transition">Global Feed</Link></li>
                        <li><Link to="/enterprise" className="hover:text-cyan-400 transition">For Enterprise</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="font-bold text-white mb-6">Legal</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li><Link to="/privacy" className="hover:text-cyan-400 transition">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-cyan-400 transition">Terms of Service</Link></li>
                        <li><Link to="/ip-policy" className="hover:text-cyan-400 transition">IP Protection</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold text-white mb-6">Contact</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li>
                            <a href="mailto:support@worldengine.io" className="hover:text-cyan-400 transition">
                                support@worldengine.io
                            </a>
                        </li>
                        <li>
                            <a href="mailto:partners@worldengine.io" className="hover:text-cyan-400 transition">
                                partners@worldengine.io
                            </a>
                        </li>
                        <li className="pt-4 text-xs text-slate-600">
                            123 Innovation Dr.<br />
                            San Francisco, CA 94103
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-slate-600">
                    © 2026 World Engine Inc. All rights reserved.
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    SYSTEM OPERATIONAL
                </div>
            </div>
        </footer>
    );
};

export default Footer;
