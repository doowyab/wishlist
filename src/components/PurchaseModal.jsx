import { useState } from "react";

const PurchaseModal = ({ itemId, user, onClose, onPurchased, supabase }) => {
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [formError, setFormError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!name.trim()) {
            setFormError("Name is required");
            return;
        }

        const { error: apiError } = await supabase
            .from("purchases")
            .insert({
                item_id: itemId,
                user_id: user?.id || null,
                user_alias: name.trim(),
                notes: notes.trim() || null
            });

        if (apiError) {
            setFormError(apiError.message);
            return;
        }

        onPurchased(itemId, name.trim());
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mark as Purchased</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="purchaseName" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name <span className="text-pink-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="purchaseName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                            placeholder="Enter your name"
                        />
                        {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
                    </div>

                    <div>
                        <label htmlFor="purchaseNotes" className="block text-sm font-medium text-gray-700 mb-2">
                            Notes <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            id="purchaseNotes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors resize-none"
                            placeholder="Any notes about the purchase..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PurchaseModal;
