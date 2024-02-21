import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";
import { routes } from "../../routes/Routes";

function Navbar() {
    return (
        <div className="navbar">
            <div className="links">
                <Link to={routes.home}>LOGO</Link>
                <Link to={routes.home}>Restart Search</Link>
            </div>
        </div>
    )
}

export default Navbar;
