import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";
import { routes } from "../../routes/Routes";
import Logo from "../logo/Logo";

function Navbar() {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <Link to={routes.home}><Logo /></Link>
            <div className="navbar-middle"/>
            <div className="navbar-options-container">
                <Link className="body-1-medium navbar-option" to={routes.dataPipeline}>Instructions</Link>
                <Link className="body-1-medium navbar-option" to={routes.howItWorks}>How it works</Link>
                <button
                    onClick={() => navigate(routes.productSearch, {state: {query: "", "showRecommendations": false}})}
                    className="primary-button-inverted primary-button-size primary-button-inverted-list"
                >Compare products</button>
            </div>
        </div>
    )
}

export default Navbar;
