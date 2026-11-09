import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "./db";
import { useAuth } from "./AuthContext";
import usePageTitle from "./usePageTitle";

const inputClass =
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
const buttonClass =
    "w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 dark:disabled:bg-pink-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed";
const linkButtonClass = "w-full text-sm text-pink-500 hover:text-pink-600 font-medium";

const MIN_PASSWORD_LENGTH = 8;

// Modes: "signin" (email + password), "reset-request" (email a code), "reset" (code + new password).
const Login = () => {
    usePageTitle("Login");
    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");
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

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setPassword("");
        setConfirmPassword("");
        setCode("");
        setMessage(null);
        setError(null);
    };

    // Signs in with email + password, then loads the session (which redirects home).
    const signIn = async (signInPassword) => {
        await db.auth.signIn.email({ email: email.trim(), password: signInPassword });
        const signedIn = await refreshSession();
        if (!signedIn) {
            setError("You were signed in, but your browser blocked the login cookie. Please try a different browser.");
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await signIn(password);
        } catch (err) {
            console.error("Sign-in failed:", err);
            setError("Incorrect email or password. If you haven't set a password yet, use \"Set or reset password\" below.");
        }
        setLoading(false);
    };

    const handleSendResetCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await db.auth.emailOtp.sendVerificationOtp({ email: email.trim(), type: "forget-password" });
            setMode("reset");
            setMessage(`If ${email.trim()} has access, we've emailed it a code. Enter it below with your new password.`);
        } catch (err) {
            setError(err.message || "Couldn't send a code. Please try again.");
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Your password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }
        if (password !== confirmPassword) {
            setError("The passwords don't match.");
            return;
        }

        setLoading(true);
        try {
            await db.auth.emailOtp.resetPassword({ email: email.trim(), otp: code.trim(), password });
        } catch (err) {
            console.error("Password reset failed:", err);
            setLoading(false);
            setError("That code didn't work. Check it and try again, or request a new one.");
            return;
        }

        try {
            await signIn(password);
        } catch (err) {
            console.error("Sign-in after reset failed:", err);
            switchMode("signin");
            setMessage("Your password is set. Please sign in.");
        }
        setLoading(false);
    };

    const emailField = (
        <div>
            <label htmlFor="email" className={labelClass}>
                Email address
            </label>
            <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
            />
        </div>
    );

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
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-xl p-4 mb-6 text-center">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {mode === "signin" && (
                    <form onSubmit={handleSignIn} className="space-y-6">
                        {emailField}
                        <div>
                            <label htmlFor="password" className={labelClass}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={inputClass}
                            />
                        </div>
                        <button type="submit" disabled={loading} className={buttonClass}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                        <button type="button" onClick={() => switchMode("reset-request")} className={linkButtonClass}>
                            Set or reset password
                        </button>
                    </form>
                )}

                {mode === "reset-request" && (
                    <form onSubmit={handleSendResetCode} className="space-y-6">
                        <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                            Enter your email and we'll send you a code to set a new password.
                        </p>
                        {emailField}
                        <button type="submit" disabled={loading} className={buttonClass}>
                            {loading ? "Sending..." : "Email Me a Code"}
                        </button>
                        <button type="button" onClick={() => switchMode("signin")} className={linkButtonClass}>
                            Back to sign in
                        </button>
                    </form>
                )}

                {mode === "reset" && (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label htmlFor="code" className={labelClass}>
                                Code
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
                                className={`${inputClass} tracking-widest text-center text-lg`}
                            />
                        </div>
                        <div>
                            <label htmlFor="new-password" className={labelClass}>
                                New password
                            </label>
                            <input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={MIN_PASSWORD_LENGTH}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className={labelClass}>
                                Confirm new password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={MIN_PASSWORD_LENGTH}
                                className={inputClass}
                            />
                        </div>
                        <button type="submit" disabled={loading} className={buttonClass}>
                            {loading ? "Saving..." : "Set Password & Sign In"}
                        </button>
                        <button type="button" onClick={() => switchMode("reset-request")} className={linkButtonClass}>
                            Resend the code
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
