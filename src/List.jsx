import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";
import usePageTitle from "./usePageTitle";
import AddItemModal from "./components/AddItemModal";
import EditListModal from "./components/EditListModal";
import DeleteListModal from "./components/DeleteListModal";
import PurchaseModal from "./components/PurchaseModal";
import PurchasesWarningModal from "./components/PurchasesWarningModal";
import DeleteItemModal from "./components/DeleteItemModal";
import EditItemModal from "./components/EditItemModal";
import PurchaseHistoryModal from "./components/PurchaseHistoryModal";
import CoOwnersModal from "./components/CoOwnersModal";
import ItemCard from "./components/ItemCard";

const List = () => {
    const { listId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal visibility state
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseItemId, setPurchaseItemId] = useState(null);
    const [showPurchases, setShowPurchases] = useState(false);
    const [showPurchasesWarningModal, setShowPurchasesWarningModal] = useState(false);
    const [showDeleteItemModal, setShowDeleteItemModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [showEditItemModal, setShowEditItemModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [showPurchaseHistoryModal, setShowPurchaseHistoryModal] = useState(false);
    const [purchaseHistoryItem, setPurchaseHistoryItem] = useState(null);
    const [showCoOwnersModal, setShowCoOwnersModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const isOwner = user && (list?.created_by === user.id || (list?.co_owners && list.co_owners.includes(user.id)));

    const handleShare = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    usePageTitle(list?.name || "List");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const [listResult, itemsResult] = await Promise.all([
                supabase.from("lists").select("name, description, created_by, co_owners").eq("id", listId).single(),
                supabase.from("items").select("*, purchases(*)").eq("list_id", listId)
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

    const handleItemAdded = (newItem) => {
        setItems([...items, newItem]);
    };

    const handleListUpdated = (updates) => {
        setList({ ...list, ...updates });
    };

    const handleDeleteList = async () => {
        const { error: apiError } = await supabase
            .from("lists")
            .delete()
            .eq("id", listId);

        if (apiError) {
            alert(apiError.message);
            return;
        }

        navigate("/me");
    };

    const openPurchaseModal = (itemId) => {
        setPurchaseItemId(itemId);
        setShowPurchaseModal(true);
    };

    const handlePurchased = (itemId, userAlias) => {
        setItems(items.map(item =>
            item.id === itemId
                ? { ...item, purchases: [...(item.purchases || []), { user_alias: userAlias }] }
                : item
        ));
    };

    const openDeleteItemModal = (item) => {
        setDeleteItem(item);
        setShowDeleteItemModal(true);
    };

    const handleDeleteItem = async () => {
        if (!deleteItem) return;

        const { error: apiError } = await supabase
            .from("items")
            .delete()
            .eq("id", deleteItem.id);

        if (apiError) {
            alert(apiError.message);
            return;
        }

        setItems(items.filter(item => item.id !== deleteItem.id));
        setShowDeleteItemModal(false);
        setDeleteItem(null);
    };

    const openEditItemModal = (item) => {
        setEditItem(item);
        setShowEditItemModal(true);
    };

    const handleItemUpdated = (itemId, updates) => {
        setItems(items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
        ));
    };

    const openPurchaseHistoryModal = (item) => {
        setPurchaseHistoryItem(item);
        setShowPurchaseHistoryModal(true);
    };

    const handleCoOwnerAdded = (data) => {
        if (data?.co_owners) {
            setList({ ...list, co_owners: data.co_owners });
        }
    };

    const handleCoOwnerRemoved = (newCoOwners) => {
        setList({ ...list, co_owners: newCoOwners });
    };

    const isListCreator = user && list?.created_by === user.id;

    // Split items into unpurchased, multibuy, and purchased
    const multibuyItems = items.filter(item => item.is_multibuy);
    const unpurchasedItems = items.filter(item => !item.is_multibuy && (!item.purchases || item.purchases.length === 0));
    const purchasedItems = items.filter(item => !item.is_multibuy && item.purchases && item.purchases.length > 0);

    if (loading) {
        return <div className="py-12 text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="py-12 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="py-12">
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{list?.name}</h1>
            </div>
            {list?.description && (
                <p className="text-gray-600 text-lg mb-2">{list.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-4 mt-4">
                <button
                    onClick={handleShare}
                    className="border border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {copied ? "Copied!" : "Share"}
                </button>
                {isOwner && (
                    <>
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="border border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="border border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                        {showPurchases ? (
                            <button
                                onClick={() => setShowPurchases(false)}
                                className="border border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                Hide Purchases
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowPurchasesWarningModal(true)}
                                className="border border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Show Purchases
                            </button>
                        )}
                        <button
                            onClick={() => setShowCoOwnersModal(true)}
                            className="border border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Co-Owners
                        </button>
                    </>
                )}
            </div>

            {(isOwner && !showPurchases) ? (
                /* Owner view - show all items without differentiation */
                <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <li
                        onClick={() => setShowAddItemModal(true)}
                        className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-pink-400 cursor-pointer flex flex-col items-center justify-center min-h-[150px]"
                    >
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-gray-500 font-medium">Add Item</span>
                    </li>
                    {items.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            isOwner={isOwner}
                            isPurchased={false}
                            onEdit={openEditItemModal}
                            onDelete={openDeleteItemModal}
                        />
                    ))}
                </ul>
            ) : items.length === 0 && !isOwner ? (
                <p className="text-gray-500">No items in this list yet.</p>
            ) : (
                /* Non-owner view or owner with showPurchases - show unpurchased first, then purchased section */
                <>
                    {(unpurchasedItems.length > 0 || isOwner) && (
                        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {isOwner && (
                                <li
                                    onClick={() => setShowAddItemModal(true)}
                                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-pink-400 cursor-pointer flex flex-col items-center justify-center min-h-[150px]"
                                >
                                    <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-gray-500 font-medium">Add Item</span>
                                </li>
                            )}
                            {unpurchasedItems.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    isOwner={isOwner}
                                    isPurchased={false}
                                    onPurchase={!isOwner ? openPurchaseModal : undefined}
                                    onEdit={isOwner ? openEditItemModal : undefined}
                                    onDelete={isOwner ? openDeleteItemModal : undefined}
                                />
                            ))}
                        </ul>
                    )}

                    {unpurchasedItems.length === 0 && multibuyItems.length === 0 && purchasedItems.length > 0 && !isOwner && (
                        <p className="text-gray-500 mb-8">All items have been purchased!</p>
                    )}

                    {multibuyItems.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold text-gray-500 mb-6">Multibuy</h2>
                            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {multibuyItems.map((item) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        isOwner={isOwner}
                                        isPurchased={false}
                                        onPurchase={!isOwner ? openPurchaseModal : undefined}
                                        showPurchaseInfo={isOwner ? showPurchases : true}
                                        onEdit={isOwner ? openEditItemModal : undefined}
                                        onDelete={isOwner ? openDeleteItemModal : undefined}
                                        onShowPurchaseHistory={isOwner ? openPurchaseHistoryModal : undefined}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}

                    {purchasedItems.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold text-gray-500 mb-6">Already Purchased</h2>
                            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {purchasedItems.map((item) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        isOwner={isOwner}
                                        isPurchased={true}
                                        showPurchaseInfo={isOwner ? showPurchases : true}
                                        onEdit={isOwner ? openEditItemModal : undefined}
                                        onDelete={isOwner ? openDeleteItemModal : undefined}
                                        onShowPurchaseHistory={isOwner ? openPurchaseHistoryModal : undefined}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            {showAddItemModal && (
                <AddItemModal
                    listId={listId}
                    onClose={() => setShowAddItemModal(false)}
                    onItemAdded={handleItemAdded}
                    supabase={supabase}
                />
            )}

            {showEditModal && (
                <EditListModal
                    list={list}
                    listId={listId}
                    onClose={() => setShowEditModal(false)}
                    onListUpdated={handleListUpdated}
                    supabase={supabase}
                />
            )}

            {showDeleteModal && (
                <DeleteListModal
                    listName={list?.name}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteList}
                />
            )}

            {showPurchaseModal && (
                <PurchaseModal
                    itemId={purchaseItemId}
                    user={user}
                    onClose={() => setShowPurchaseModal(false)}
                    onPurchased={handlePurchased}
                    supabase={supabase}
                />
            )}

            {showPurchasesWarningModal && (
                <PurchasesWarningModal
                    onClose={() => setShowPurchasesWarningModal(false)}
                    onConfirm={() => {
                        setShowPurchases(true);
                        setShowPurchasesWarningModal(false);
                    }}
                />
            )}

            {showDeleteItemModal && deleteItem && (
                <DeleteItemModal
                    item={deleteItem}
                    onClose={() => {
                        setShowDeleteItemModal(false);
                        setDeleteItem(null);
                    }}
                    onConfirm={handleDeleteItem}
                />
            )}

            {showEditItemModal && editItem && (
                <EditItemModal
                    item={editItem}
                    onClose={() => {
                        setShowEditItemModal(false);
                        setEditItem(null);
                    }}
                    onItemUpdated={handleItemUpdated}
                    supabase={supabase}
                />
            )}

            {showPurchaseHistoryModal && purchaseHistoryItem && (
                <PurchaseHistoryModal
                    item={purchaseHistoryItem}
                    onClose={() => {
                        setShowPurchaseHistoryModal(false);
                        setPurchaseHistoryItem(null);
                    }}
                />
            )}

            {showCoOwnersModal && (
                <CoOwnersModal
                    listId={listId}
                    onClose={() => setShowCoOwnersModal(false)}
                    onCoOwnerAdded={handleCoOwnerAdded}
                    onCoOwnerRemoved={handleCoOwnerRemoved}
                    supabase={supabase}
                    isCreator={isListCreator}
                />
            )}
        </div>
    );
};

export default List;
