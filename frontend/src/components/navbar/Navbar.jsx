import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";
import { routes } from "../../routes/Routes";
import Logo from "../logo/Logo";

function Navbar(props) {
    const navigate = useNavigate();
    const navbarClass = props.isComparisonNav ? "comparison-navbar" : "regular-navbar"
    return (
        <div className={`navbar ${navbarClass}`}>
            <div className={props.isComparisonNav ? "navbar-logo" : ""}>
                <Link to={routes.home}><Logo /></Link>
            </div>
            <div className="navbar-middle" />
            <div className="navbar-restart-button">
                {props.isComparisonNav && <button 
                    onClick={() => navigate(routes.home)} className="primary-button primary-button-size"
                >Restart Search</button>}
            </div>
        </div>
    )
}

export default Navbar;
