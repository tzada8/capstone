import React from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
    return (
        <div className="navbar">
            <div className="links">
                <Link to="/">LOGO</Link>
                <Link to="/">Restart Search</Link>
            </div>
        </div>
    )
}

export default Navbar;
