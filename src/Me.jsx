import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { supabase } from "./supabaseClient";
import usePageTitle from "./usePageTitle";

const Me = () => {
    usePageTitle("My Lists");
    const { user } = useAuth();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchLists = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("lists")
                .select("*")
                .eq("created_by", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                setError(error.message);
            } else {
                setLists(data);
            }
            setLoading(false);
        };

        fetchLists();
    }, [user]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleDelete = async (listId) => {
        if (!window.confirm("Are you sure you want to delete this list?")) {
            return;
        }

        const { error } = await supabase
            .from("lists")
            .delete()
            .eq("id", listId);

        if (error) {
            alert(error.message);
        } else {
            setLists(lists.filter((list) => list.id !== listId));
        }
    };

    if (loading) {
        return <div className="py-12 text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="py-12 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Lists</h1>
                <Link
                    to="/create"
                    className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    Create New List
                </Link>
            </div>

            {lists.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">You haven't created any lists yet.</p>
                    <Link
                        to="/create"
                        className="text-pink-500 hover:text-pink-600 font-medium"
                    >
                        Create your first list
                    </Link>
                </div>
            ) : (
                <ul className="space-y-4">
                    {lists.map((list) => (
                        <li key={list.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <Link
                                        to={`/list/${list.id}`}
                                        className="text-xl font-semibold text-gray-900 hover:text-pink-500 transition-colors"
                                    >
                                        {list.name}
                                    </Link>
                                    {list.description && (
                                        <p className="text-gray-600 mt-1">{list.description}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleDelete(list.id)}
                                        className="text-gray-500 hover:text-red-500 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                        title="Delete list"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Me;
