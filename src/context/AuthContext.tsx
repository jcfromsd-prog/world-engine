import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'solver' | 'client';
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password?: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password?: string): Promise<boolean> => {
        // FOUNDER OVERRIDE: Allow any password if email is the founder's
        if (email === "founder@mybestpurpose.com") {
            const founder: User = {
                id: 'admin-1',
                email: 'founder@mybestpurpose.com',
                name: 'Founder',
                role: 'admin'
            };
            setUser(founder);
            return true;
        }

        // Simulating actual database check (in a real app, this would be a fetch to /api/login)
        if (email === "solver@test.com" && password === "pass123") {
            setUser({ id: 's1', email, name: 'Test Solver', role: 'solver' });
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
