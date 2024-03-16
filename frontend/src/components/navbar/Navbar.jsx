import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";
import { routes } from "../../routes/Routes";
import Logo from "../logo/Logo";

function Navbar(props) {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const toProductSearch = (showRecommendations, preferencesModalData, isPreferencesSkipped) => {
        navigate(routes.productSearch, {state: {
            query: searchQuery,
            preferences: preferencesModalData,
            "showRecommendations": showRecommendations,
            "isPreferencesSkipped": isPreferencesSkipped,
        }})
    }

    return (
        <div className={`navbar`}>
            <Link to={routes.home}><Logo /></Link>
            <div className="navbar-middle" />
            <div className="navbar-options-container">
                <Link className="body-1-medium navbar-option" to={routes.how_it_works}>How it works</Link>
                <Link className="body-1-medium navbar-option" to={routes.data_pipeline}>Our data</Link>
                <button
                        onClick={() => toProductSearch(false)}
                        className="primary-button-inverted primary-button-size primary-button-inverted-list"
                    >Compare products</button>
            </div>
        </div>
    )
}

export default Navbar;
