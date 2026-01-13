const PurchaseHistoryModal = ({ item, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Purchase History</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-gray-600 mb-4">{item.title}</p>

                <div className="space-y-4">
                    {item.purchases.map((purchase, index) => (
                        <div key={index} className="border-l-4 border-pink-300 pl-4 py-2">
                            <p className="font-medium text-gray-900">{purchase.user_alias}</p>
                            {purchase.created_at && (
                                <p className="text-sm text-gray-500">
                                    {new Date(purchase.created_at).toLocaleDateString()} at {new Date(purchase.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                            {purchase.notes && (
                                <p className="text-gray-600 mt-1">{purchase.notes}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PurchaseHistoryModal;
