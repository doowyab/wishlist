import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "./db";
import { useAuth } from "./AuthContext";
import usePageTitle from "./usePageTitle";

const Login = () => {
    usePageTitle("Login");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user, refreshSession } = useAuth();

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await db.auth.emailOtp.sendVerificationOtp({ email: email.trim(), type: "sign-in" });
            setCodeSent(true);
            setMessage(`We've emailed a sign-in code to ${email.trim()}`);
        } catch (err) {
            setError(err.message || "Couldn't send a code. Please try again.");
        }
        setLoading(false);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await db.auth.signIn.emailOtp({ email: email.trim(), otp: code.trim() });
        } catch (err) {
            console.error("Sign-in failed:", err);
            setLoading(false);
            setError("That code didn't work. Check it and try again, or request a new one.");
            return;
        }

        // Loading the session sets `user`, and the effect above redirects home.
        const signedIn = await refreshSession();
        setLoading(false);
        if (!signedIn) {
            setError("Your code was accepted, but your browser blocked the login cookie. Please try a different browser.");
        }
    };

    const startOver = () => {
        setCodeSent(false);
        setCode("");
        setMessage(null);
        setError(null);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Family & Friends Only</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        This software was built for family and friends only. You can request login access to create your own lists by{" "}
                        <Link to="/contact" className="text-pink-500 hover:text-pink-600 font-medium">
                            contacting us
                        </Link>.
                    </p>
                </div>

                {message && (
                    <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 rounded-xl p-4 mb-6 text-center">
                        <p className="font-medium">{message}</p>
                        <p className="text-sm mt-1">Enter it below. The code expires in a few minutes.</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl p-4 mb-6 text-center">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {codeSent ? (
                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sign-in code
                        </label>
                        <input
                            id="code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            autoFocus
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white tracking-widest text-center text-lg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 dark:disabled:bg-pink-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <button
                        type="button"
                        onClick={startOver}
                        className="w-full text-sm text-pink-500 hover:text-pink-600 font-medium"
                    >
                        Use a different email or resend the code
                    </button>
                </form>
                ) : (
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 dark:disabled:bg-pink-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            "Email Me a Code"
                        )}
                    </button>
                </form>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        No password needed! We'll email you a one-time code to sign in.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
