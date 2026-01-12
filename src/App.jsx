import { useState, useEffect } from "react";
import TopBar from "./TopBar.jsx";
import { Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import List from "./List.jsx";
import Admin from "./Admin.jsx";
import Login from "./Login.jsx";
import Create from "./Create.jsx";
import ListAdmin from "./ListAdmin.jsx";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

export default function App() {
    const { user } = useAuth();
    const [lists, setLists] = useState([]);

    useEffect(() => {
        const fetchLists = async () => {
            let { data, error } = await supabase
                .from('lists')
                .select('name')
            setLists(data);
        }
        fetchLists();
    }, []);

    return (
        <>
            <TopBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/list/:listId" element={<List />} />
                    <Route path="/list/:listId/admin" element={<ListAdmin />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </div>
        </>
    );
}
