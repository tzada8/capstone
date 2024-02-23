import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";
import { routes } from "../../routes/Routes";
import Footer from "../../components/footer/Footer";
import HowItWorks from "./how-it-works/HowItWorks";
import Navbar from "../../components/navbar/Navbar";
import PreferencesModal from "../../components/modals/content/preferences/PreferencesModal";
import SearchBar from "../../components/search-bar/SearchBar";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

    const navigate = useNavigate();
    const toProductSearch = (preferencesModalData) => {
        navigate(routes.productSearch, {state: {
            query: searchQuery,
            preferences: preferencesModalData,
        }})
    }

    const handlePreferencesModalSubmit = (data) => {
        setIsPreferencesModalOpen(false);
        Object.keys(data).forEach(k => data[k] = data[k].includes("no-preference") ? "" : data[k])
        toProductSearch(data);
    }

	return (
		<div className="page-margin">
            <Navbar isComparisonNav={false} />
            <PreferencesModal
                isOpen={isPreferencesModalOpen}
                onSubmit={handlePreferencesModalSubmit}
                onClose={() => setIsPreferencesModalOpen(false)}
            />

            <h1>Making purchasing decisions easier with <span className="text-highlight">simplified</span> specs & product reviews</h1>
            <p className="body-1 center-text">Enter items and obtain a score of likeability - how much we think you'll like the product</p>
            <p className="body-1 center-text">based on your preferences. Compare products in a comparison table and see all.</p>
            <br/>
            {/* TODO: Need to limit users to only search for camera specific items. */}
            <SearchBar
                isButtonInsideBar={false}
                onSearchSubmit={() => setIsPreferencesModalOpen(true)}
                query={searchQuery}
                setQuery={setSearchQuery}
            />
            <br />
            <HowItWorks />
            <Footer />
		</div>
	);
}

export default Home;
