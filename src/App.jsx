import { useState, useEffect } from "react";
import TopBar from "./TopBar.jsx";
import { Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import List from "./List.jsx";
import Admin from "./Admin.jsx";
import Login from "./Login.jsx";
import Create from "./Create.jsx";
import Me from "./Me.jsx";
import Contact from "./Contact.jsx";
import Footer from "./Footer.jsx";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

export default function App() {
    const { user, loading } = useAuth();
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/me" element={<Me />} />
                    <Route path="/list/:listId" element={<List />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<div>404 Not Found</div>} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}
