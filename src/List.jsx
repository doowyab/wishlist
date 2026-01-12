import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

const List = () => {
    const { listId } = useParams();
    const { user } = useAuth();
    const [list, setList] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [details, setDetails] = useState("");
    const [price, setPrice] = useState("");
    const [formError, setFormError] = useState("");

    const isOwner = user && list?.created_by === user.id;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const [listResult, itemsResult] = await Promise.all([
                supabase.from("lists").select("name, description, created_by").eq("id", listId).single(),
                supabase.from("items").select("*").eq("list_id", listId)
            ]);

            if (listResult.error) {
                setError(listResult.error.message);
            } else if (itemsResult.error) {
                setError(itemsResult.error.message);
            } else {
                setList(listResult.data);
                setItems(itemsResult.data);
            }
            setLoading(false);
        };

        fetchData();
    }, [listId]);

    const handleAddItem = async (e) => {
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
                created_by: user.id,
                title: title.trim(),
                url: url.trim() || null,
                details: details.trim() || null,
                price: price ? parseFloat(price) : null,
                is_purchased: false,
                is_archived: false
            })
            .select();

        if (apiError) {
            setFormError(apiError.message);
            return;
        }

        setItems([...items, data[0]]);
        setShowModal(false);
        setTitle("");
        setUrl("");
        setDetails("");
        setPrice("");
    };

    if (loading) {
        return <div className="py-12 text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="py-12 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="py-12">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{list?.name}</h1>
                {isOwner && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Item
                    </button>
                )}
            </div>
            {list?.description && (
                <p className="text-gray-600 text-lg mb-8">{list.description}</p>
            )}
            {!list?.description && <div className="mb-8" />}

            {items.length === 0 ? (
                <p className="text-gray-500">No items in this list yet.</p>
            ) : (
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <li key={item.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                                {item.price && (
                                    <span className="bg-pink-100 text-pink-600 font-semibold px-3 py-1 rounded-full text-sm">
                                        ${item.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            {item.details && (
                                <p className="text-gray-600 mb-4">{item.details}</p>
                            )}
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
                        </li>
                    ))}
                </ul>
            )}

            {/* Add Item Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Add Item</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddItem} className="space-y-4">
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
            )}
        </div>
    );
};

export default List;
