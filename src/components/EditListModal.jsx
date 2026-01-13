import { useState } from "react";

const EditListModal = ({ list, listId, onClose, onListUpdated, supabase }) => {
    const [name, setName] = useState(list?.name || "");
    const [description, setDescription] = useState(list?.description || "");
    const [formError, setFormError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!name.trim()) {
            setFormError("List name is required");
            return;
        }

        const { error: apiError } = await supabase
            .from("lists")
            .update({
                name: name.trim(),
                description: description.trim() || null
            })
            .eq("id", listId);

        if (apiError) {
            setFormError(apiError.message);
            return;
        }

        onListUpdated({
            name: name.trim(),
            description: description.trim() || null
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit List</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="editName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            List Name <span className="text-pink-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="editName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="My Wishlist"
                        />
                        {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
                    </div>

                    <div>
                        <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description <span className="text-gray-400">(optional)</span>
                        </label>
                        <textarea
                            id="editDescription"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Add some details about your wishlist..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditListModal;
