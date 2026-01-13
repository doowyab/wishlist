const DeleteItemModal = ({ item, onClose, onConfirm }) => {
    const hasPurchases = item.purchases && item.purchases.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Remove Item</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {hasPurchases ? (
                    <div className="mb-6">
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-4">
                            <p className="text-yellow-800 dark:text-yellow-200 font-medium">Warning: This item has been purchased!</p>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                                Someone has already marked this item as purchased. Removing it may cause confusion.
                            </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                            Are you sure you want to remove "<strong>{item.title}</strong>"?
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Are you sure you want to remove "<strong>{item.title}</strong>" from this list?
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteItemModal;
