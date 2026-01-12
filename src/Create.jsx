import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { supabase } from "./supabaseClient";
import usePageTitle from "./usePageTitle";

const Create = () => {
    usePageTitle("Create List");
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("List name is required");
            return;
        }

        const { data, error: apiError } = await supabase
            .from("lists")
            .insert({
                name: name.trim(),
                description: description.trim() || null,
                created_by: user.id
            })
            .select();

        if (apiError) {
            setError(apiError.message);
            return;
        }

        navigate(`/list/${data[0].id}`);
    };

    return (
        <div className="py-12 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Wishlist</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        List Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                        placeholder="My Birthday Wishlist"
                    />
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors resize-none"
                        placeholder="Add some details about your wishlist..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
                >
                    Create
                </button>
            </form>
        </div>
    );
};

export default Create;
