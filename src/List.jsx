import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabaseClient";

const List = () => {
    const { listId } = useParams();
    const [list, setList] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const [listResult, itemsResult] = await Promise.all([
                supabase.from("lists").select("name, description").eq("id", listId).single(),
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

    if (loading) {
        return <div className="py-12 text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="py-12 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{list?.name}</h1>
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
        </div>
    );
};

export default List;
