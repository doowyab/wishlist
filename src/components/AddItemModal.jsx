import { useState } from "react";

const AddItemModal = ({ listId, onClose, onItemAdded, supabase }) => {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [details, setDetails] = useState("");
    const [price, setPrice] = useState("");
    const [formError, setFormError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!title.trim()) {
            setFormError("Title is required");
            return;
        }

        const { data, error: apiError } = await supabase
            .from("items")
            .insert({
                list_id: listId,
                title: title.trim(),
                url: url.trim() || null,
                details: details.trim() || null,
                price: price ? parseFloat(price) : null
            })
            .select();

        if (apiError) {
            setFormError(apiError.message);
            return;
        }

        onItemAdded(data[0]);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add Item</h2>
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
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title <span className="text-pink-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                            placeholder="Item name"
                        />
                        {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
                    </div>

                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                            URL <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                            placeholder="https://example.com/product"
                        />
                    </div>

                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                            Details <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            id="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors resize-none"
                            placeholder="Size, color, or other details..."
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                            Price <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            step="0.01"
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                            placeholder="0.00"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                    >
                        Add Item
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
