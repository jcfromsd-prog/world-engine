import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../context/AuthContextType';

/**
 * Custom hook to access the authentication context.
 * Must be used within an AuthProvider.
 * 
 * @throws Error if used outside of AuthProvider
 * @returns AuthContextType - The authentication context with user, login, logout, etc.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
