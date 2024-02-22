import React from "react";
import { Link } from "react-router-dom";

import "./Footer.css";
import { routes } from "../../routes/Routes";

function Footer() {
    return (
        <footer className="footer">
            <hr className="footer-hr" />
            <Link to={routes.home}>LOGO</Link>
            <div className="footer-options-container">
                <Link className="footer-option" to={routes.home}>About the Tool</Link>
                <Link className="footer-option" to={routes.home}>Help</Link>
                <Link className="footer-option" to={routes.home}>Contact Us</Link>
            </div>
        </footer>
    )
}

export default Footer;
