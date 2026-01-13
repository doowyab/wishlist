const ItemCard = ({ item, isOwner, isPurchased, onPurchase, onEdit, onDelete, showPurchaseInfo = false, onShowPurchaseHistory }) => {
    const hasPurchaseInfo = showPurchaseInfo && item.purchases && item.purchases.length > 0;

    return (
        <li className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md ${isPurchased ? 'opacity-60' : 'hover:shadow-lg'} transition-shadow`}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
            {(isPurchased || item.is_multibuy || item.price) && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {isPurchased && (
                        <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 font-semibold px-3 py-1 rounded-full text-sm">
                            Purchased
                        </span>
                    )}
                    {item.is_multibuy && (
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold px-3 py-1 rounded-full text-sm">
                            Multibuy
                        </span>
                    )}
                    {item.price && (
                        <span className="bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 font-semibold px-3 py-1 rounded-full text-sm">
                            £{item.price.toFixed(2)}
                        </span>
                    )}
                </div>
            )}
            {item.details && (
                <p className="text-gray-600 dark:text-gray-300 mb-4">{item.details}</p>
            )}
            {hasPurchaseInfo && (
                <div className="text-gray-600 dark:text-gray-300 mb-4 space-y-1">
                    {isOwner && onShowPurchaseHistory ? (
                        <button
                            onClick={() => onShowPurchaseHistory(item)}
                            className="text-pink-500 hover:text-pink-600 font-medium"
                        >
                            Show details of {item.purchases.length} purchase{item.purchases.length !== 1 ? 's' : ''}
                        </button>
                    ) : (
                        <>
                            {item.purchases[0].created_at && !item.is_multibuy && (
                                <p><span className="font-medium">Purchased on:</span> {new Date(item.purchases[0].created_at).toLocaleDateString()} at {new Date(item.purchases[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            )}
                        </>
                    )}
                </div>
            )}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {item.url && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
                        >
                            View Item
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-pink-500 font-medium transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(item)}
                            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-pink-500 font-medium transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
                {onPurchase && !isPurchased && (
                    <button
                        onClick={() => onPurchase(item.id)}
                        className="text-sm bg-pink-500 hover:bg-pink-600 text-white font-medium py-1.5 px-3 rounded-lg transition-colors"
                    >
                        Mark as Purchased
                    </button>
                )}
            </div>
        </li>
    );
};

export default ItemCard;
