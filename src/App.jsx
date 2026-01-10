import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import TopBar from "./TopBar.jsx";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

export default function App() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [session, setSession] = useState(null);

    const [lists, setLists] = useState([]);

    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchLists = async () => {
            let {data, error} = await supabase
                .from('lists')
                .select('name')
            setLists(data);
        }
        fetchLists();
    }, []);

    // Check URL params on initial render
    const params = new URLSearchParams(window.location.search);
    const hasTokenHash = params.get("token_hash");

    const [verifying, setVerifying] = useState(!!hasTokenHash);
    const [authError, setAuthError] = useState(null);
    const [authSuccess, setAuthSuccess] = useState(false);

    useEffect(() => {
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });
        if (error) {
            alert(error.error_description || error.message);
        } else {
            alert("Check your email for the login link!");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    return (
        <>
            <TopBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {
                    session ? (
                        <div className="container">
                            Logged In
                        </div>
                    ) : <div>Guest</div>
                }
                <h2>All Lists</h2>
                {lists?.map(({ name }) => (
                    <div className="item">
                        {name}
                    </div>
                ))}
            </div>
        </>
    )

    // Show verification state
    if (verifying) {
        return (
            <div>
                <h1>Authentication</h1>
                <p>Confirming your magic link...</p>
                <p>Loading...</p>
            </div>
        );
    }

    // Show auth error
    if (authError) {
        return (
            <div>
                <h1>Authentication</h1>
                <p>✗ Authentication failed</p>
                <p>{authError}</p>
                <button
                    onClick={() => {
                        setAuthError(null);
                        window.history.replaceState({}, document.title, "/");
                    }}
                >
                    Return to login
                </button>
            </div>
        );
    }

    // Show auth success (briefly before session loads)
    if (authSuccess && !session) {
        return (
            <div>
                <h1>Authentication</h1>
                <p>✓ Authentication successful!</p>
                <p>Loading your account...</p>
            </div>
        );
    }

    // If user is logged in, show welcome screen
    if (session) {
        return (
            <div>
                <h1>Welcome!</h1>
                <p>You are logged in as: {session.user.email}</p>
                <button onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        );
    }

    // Show login form
    return (
        <div>
            <h1>Supabase + React</h1>
            <p>Sign in via magic link with your email below</p>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button disabled={loading}>
                    {loading ? <span>Loading</span> : <span>Send magic link</span>}
                </button>
            </form>
        </div>
    );
}