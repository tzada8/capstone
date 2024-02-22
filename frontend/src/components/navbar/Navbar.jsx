import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";

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
                {props.isComparisonNav && <Button 
                    onClick={() => navigate(routes.home)} type="primary" size="large" className="primary-button"
                >Restart Search</Button>}
            </div>
        </div>
    )
}

export default Navbar;
