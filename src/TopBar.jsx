import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const TopBar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/App Name */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
                            🛍️ Wishlist
                        </Link>
                    </div>

{/* Auth Button */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                                    {user.email}
                                </span>
                                <Link
                                    to="/me"
                                    className="border border-pink-500 text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950 px-4 py-2 rounded-md font-medium transition-colors"
                                >
                                    My Lists
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md font-medium transition-colors"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                            >
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopBar;
