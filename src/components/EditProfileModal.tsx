import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
    username: string;
    bio: string;
    skills: string[];
    githubUrl?: string; // Optional for now
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onSave: (updatedProfile: Partial<UserProfile>) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        username: user.username,
        bio: user.bio,
        skills: user.skills.join(', '), // Comma separated for editing
        githubUrl: user.githubUrl || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            username: formData.username,
            bio: formData.bio,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            githubUrl: formData.githubUrl
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                            <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Name</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    rows={3}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Skills (Comma separated)</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="React, TypeScript, Rust..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>

                            {/* GitHub Integration Mock */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GitHub URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="githubUrl"
                                        value={formData.githubUrl}
                                        onChange={handleChange}
                                        placeholder="https://github.com/username"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500 transition-colors"
                                    />
                                    <button type="button" className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white">
                                        Verify
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-slate-400 hover:text-white font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/20 transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
