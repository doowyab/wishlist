import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { db } from "./db";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Neon Auth session data: { session, user } or null when signed out.
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
            const { data } = await db.auth.getSession();
            setSession(data?.user ? data : null);
            return data?.user ? data : null;
        } catch (error) {
            console.error("Failed to load session:", error);
            setSession(null);
            return null;
        }
    }, []);

    useEffect(() => {
        refreshSession().finally(() => setLoading(false));
    }, [refreshSession]);

    const signOut = async () => {
        try {
            await db.auth.signOut();
        } finally {
            setSession(null);
        }
    };

    const value = {
        session,
        user: session?.user ?? null,
        loading,
        signOut,
        refreshSession,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
