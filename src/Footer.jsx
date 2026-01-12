import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600">
                        Made with <span className="text-pink-500">❤️</span> by doowyab
                    </p>
                    <Link
                        to="/contact"
                        className="text-gray-600 hover:text-pink-500 transition-colors"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
