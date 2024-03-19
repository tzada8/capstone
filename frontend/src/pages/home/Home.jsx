import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";
import { routes } from "../../routes/Routes";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import PreferencesModal from "../../components/modals/content/preferences/PreferencesModal";
import SearchBar from "../../components/search-bar/SearchBar";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

    const navigate = useNavigate();
    const toProductSearch = (showRecommendations, preferencesModalData, isPreferencesSkipped) => {
        navigate(routes.productSearch, {state: {
            query: searchQuery,
            preferences: preferencesModalData,
            "showRecommendations": showRecommendations,
            "isPreferencesSkipped": isPreferencesSkipped,
        }})
    }

    const handlePreferencesModalSubmit = (data) => {
        setIsPreferencesModalOpen(false);
        Object.keys(data).forEach(k => data[k] = data[k].includes("no-preference") ? "" : data[k]);
        const isPreferencesSkipped = Object.values(data).every(v => v === "");
        toProductSearch(true, data, isPreferencesSkipped);
    }

	return (
		<div className="page-margin">
            <Navbar/>
            <PreferencesModal
                isOpen={isPreferencesModalOpen}
                onSubmit={handlePreferencesModalSubmit}
                onClose={() => setIsPreferencesModalOpen(false)}
            />
            <div className="hero">
                <div className="hero-body">
                    <h1 className="center-text max-width-heading">Make purchasin<span className="g-title-font">g</span> decisions easier with <span className="text-highlight">simplified</span> specs & product reviews</h1>
                    <br/>
                    <p className="body-1 center-text max-width-body">
                        Search for the products you are interested in and we will help you find the perfect choice for your needs
                    </p>
                    <SearchBar
                        isButtonInsideBar={false}
                        onSearchSubmit={() => setIsPreferencesModalOpen(true)}
                        query={searchQuery}
                        setQuery={setSearchQuery}
                    />
                </div>
            </div>
            <Footer />
		</div>
	);
}

export default Home;
