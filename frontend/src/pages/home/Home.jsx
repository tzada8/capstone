import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";
import PreferencesModal from "../../components/modals/content/preferences/PreferencesModal";
import SearchBar from "../../components/search-bar/SearchBar";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

    const navigate = useNavigate();
    const toProductSearch = (preferencesModalData) => {
        navigate("/product-search", {state: {
            query: searchQuery,
            preferences: preferencesModalData,
        }})
    }

    const handlePreferencesModalSubmit = (data) => {
        setIsPreferencesModalOpen(false);
        toProductSearch(data);
    }

	return (
		<div>
            <PreferencesModal
                isOpen={isPreferencesModalOpen}
                onSubmit={handlePreferencesModalSubmit}
                onClose={() => setIsPreferencesModalOpen(false)}
            />

            <h1>Making purchasing decisions easier with <b>simplified</b> specs & product reviews</h1>
            <br/>
            {/* TODO: Need to limit users to only search for camera specific items. */}
            <SearchBar onSearchSubmit={() => setIsPreferencesModalOpen(true)} query={searchQuery} setQuery={setSearchQuery}/>
		</div>
	);
}

export default Home;
