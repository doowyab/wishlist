import { Link } from "react-router-dom";
import usePageTitle from "./usePageTitle";

const Home = () => {
    usePageTitle("");

    return (
    <div className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Wishlists Made <span className="text-pink-500">Simple</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                No more duplicate gifts. No more awkward returns. Create wishlists that help
                your friends and family find the perfect presents for any occasion.
            </p>
            <Link to="/create" className="inline-block mt-8 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors shadow-lg hover:shadow-xl">
                Create Your Wishlist
            </Link>
        </div>

        {/* 3 Easy Steps Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-10 mt-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                3 Easy Steps to Perfect Gifts
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow text-center">
                    <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl dark:text-white">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Create Your List</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Add the items you actually want. Include links, sizes, and notes to make
                        it easy for gift-givers to get it right.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl dark:text-white">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Friends & Family Shop</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Share your list with loved ones. They can mark items as purchased
                        secretly, so no one doubles up on gifts.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl dark:text-white">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Perfect Presents Arrive</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Gifts you actually love show up at your door. No duplicates, no
                        surprises you don't want, just happiness delivered.
                    </p>
                </div>
            </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                Birthdays, holidays, weddings, baby showers... we've got you covered.
            </p>
            <a href="#" className="text-pink-500 hover:text-pink-600 font-semibold text-lg underline underline-offset-4">
                See how it works
            </a>
        </div>
    </div>
    );
};

export default Home;
