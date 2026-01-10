const TopBar = () => {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/App Name */}
                    <div className="flex-shrink-0">
                        <a href="/" className="text-xl font-bold text-gray-900">
                            Wishlist
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/features" className="text-gray-600 hover:text-gray-900">
                            Features
                        </a>
                        <a href="/pricing" className="text-gray-600 hover:text-gray-900">
                            Pricing
                        </a>
                        <a href="/about" className="text-gray-600 hover:text-gray-900">
                            About
                        </a>
                    </div>

                    {/* Login Button */}
                    <div className="flex items-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                            Log In
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default TopBar