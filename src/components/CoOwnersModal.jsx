import { useState, useEffect } from "react";

const CoOwnersModal = ({ listId, onClose, onCoOwnerAdded, onCoOwnerRemoved, supabase, isCreator }) => {
    const [email, setEmail] = useState("");
    const [adding, setAdding] = useState(false);
    const [formError, setFormError] = useState("");
    const [coOwners, setCoOwners] = useState([]);
    const [creator, setCreator] = useState(null);
    const [loadingCoOwners, setLoadingCoOwners] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        const fetchCoOwners = async () => {
            setLoadingCoOwners(true);
            setFetchError("");

            const { data, error } = await supabase.functions.invoke('get-co-owners', {
                body: { listId }
            });

            if (error) {
                console.error('Error fetching co-owners:', error);
                setFetchError("Failed to load co-owners.");
            } else {
                const owners = data?.owners || [];
                setCreator(owners.find(owner => owner.isCreator) || null);
                setCoOwners(owners.filter(owner => !owner.isCreator));
            }
            setLoadingCoOwners(false);
        };

        fetchCoOwners();
    }, [listId, supabase]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        if (!email.trim()) {
            setFormError("Email is required");
            return;
        }

        setAdding(true);

        const { data, error } = await supabase.functions.invoke('add-co-owner', {
            body: {
                listId: listId,
                coOwnerEmail: email.trim()
            }
        });

        if (error) {
            console.error('Function error:', error);
            console.error('Error details:', error.message);
        } else {
            console.log('Success:', data);
        }

        setAdding(false);

        if (error) {
            setFormError("Failed to add co-owner. Please try again.");
            return;
        }

        // Add to local list
        setCoOwners([...coOwners, { email: email.trim() }]);
        setEmail("");
        onCoOwnerAdded(data);
    };

    const handleRemoveCoOwner = async (coOwnerToRemove) => {
        setRemovingId(coOwnerToRemove.id);

        const newCoOwnerIds = coOwners
            .filter(co => co.id !== coOwnerToRemove.id)
            .map(co => co.id);

        const { error } = await supabase
            .from("lists")
            .update({ co_owners: newCoOwnerIds })
            .eq("id", listId);

        if (error) {
            console.error('Error removing co-owner:', error);
            setRemovingId(null);
            return;
        }

        setCoOwners(coOwners.filter(co => co.id !== coOwnerToRemove.id));
        setRemovingId(null);
        onCoOwnerRemoved?.(newCoOwnerIds);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Co-Owners</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Add New Co-Owner</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <p className="text-amber-800 text-sm">
                            You can only add people who already have access to this site.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors"
                            placeholder="friend@example.com"
                        />
                        <button
                            type="submit"
                            disabled={adding}
                            className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                            {adding ? "..." : "Add"}
                        </button>
                    </form>
                    {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
                </div>

                {loadingCoOwners ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                ) : fetchError ? (
                    <p className="text-red-500 text-sm">{fetchError}</p>
                ) : (
                    <>
                        {creator && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Owner</h3>
                                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-100">
                                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-gray-700">{creator.email}</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Co-Owners</h3>
                            {coOwners.length === 0 ? (
                                <p className="text-gray-500 text-sm">No co-owners yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {coOwners.map((coOwner) => (
                                        <li key={coOwner.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-gray-700 flex-1">{coOwner.email}</span>
                                            {isCreator && (
                                                <button
                                                    onClick={() => handleRemoveCoOwner(coOwner)}
                                                    disabled={removingId === coOwner.id}
                                                    className="text-red-500 hover:text-red-700 disabled:text-red-300 p-1"
                                                    title="Remove co-owner"
                                                >
                                                    {removingId === coOwner.id ? (
                                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CoOwnersModal;
