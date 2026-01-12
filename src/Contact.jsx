import usePageTitle from "./usePageTitle";

const Contact = () => {
    usePageTitle("Contact");

    return (
        <div className="py-12 max-w-xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-gray-600 mb-8">
                Hey! Want to join in and create your own wishlists? Drop me a message and I'll get you set up. Also let me know if you spot any bugs!
            </p>
            <a
                href="mailto:josh.baywood@outlook.com"
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
            </a>
        </div>
    );
};

export default Contact;
