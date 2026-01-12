import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();

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

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/wishlist/`,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Check your email for the magic link!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12">
            <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Family & Friends Only</h1>
                    <p className="text-gray-600">
                        This software was built for family and friends only. You can request login access to create your own lists by{" "}
                        <Link to="/contact" className="text-pink-500 hover:text-pink-600 font-medium">
                            contacting us
                        </Link>.
                    </p>
                </div>

                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 text-center">
                        <p className="font-medium">{message}</p>
                        <p className="text-sm mt-1">The link will expire in 1 hour</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-center">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:cursor-not-allowed"
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
                            "Send Magic Link"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-600 text-sm">
                        No password needed! We'll send you a secure link to sign in.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
