const ItemCard = ({ item, isOwner, isPurchased, onPurchase, onDelete, showPurchaseInfo = false }) => {
    const hasPurchaseInfo = showPurchaseInfo && item.purchases && item.purchases.length > 0;

    return (
        <li className={`bg-white rounded-2xl p-6 shadow-md ${isPurchased ? 'opacity-60' : 'hover:shadow-lg'} transition-shadow`}>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <div className="flex gap-2 items-center">
                    {isPurchased && (
                        <span className="bg-green-100 text-green-600 font-semibold px-3 py-1 rounded-full text-sm">
                            Purchased
                        </span>
                    )}
                    {item.price && (
                        <span className="bg-pink-100 text-pink-600 font-semibold px-3 py-1 rounded-full text-sm">
                            ${item.price.toFixed(2)}
                        </span>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(item)}
                            className="text-gray-400 hover:text-pink-500 p-1 rounded transition-colors"
                            title="Remove item"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            {item.details && (
                <p className="text-gray-600 mb-4">{item.details}</p>
            )}
            {hasPurchaseInfo && (
                <div className="text-gray-600 mb-4 space-y-1">
                    {isOwner && (
                        <p><span className="font-medium">Purchased by:</span> {item.purchases[0].user_alias}</p>
                    )}
                    {item.purchases[0].created_at && (
                        <p><span className="font-medium">Purchased on:</span> {new Date(item.purchases[0].created_at).toLocaleDateString()} at {new Date(item.purchases[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    )}
                    {isOwner && item.purchases[0].notes && (
                        <p><span className="font-medium">Notes:</span> {item.purchases[0].notes}</p>
                    )}
                </div>
            )}
            <div className="flex justify-between items-center">
                {item.url ? (
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
                ) : (
                    <div />
                )}
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
