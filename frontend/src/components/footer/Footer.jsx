import React from "react";
import { Link } from "react-router-dom";

import "./Footer.css";
import { routes } from "../../routes/Routes";
import Logo from "../logo/Logo";

function Footer() {
    return (
        <footer className="footer">
            <hr className="footer-hr" />
            <div className="footer-logo">
                <Link className="center-logo" to={routes.home}><Logo /></Link>
            </div>
            <div className="footer-options-container">
                <Link className="body-1-medium footer-option" to={routes.how_it_works}>How it works</Link>
                <Link className="body-1-medium footer-option" to={routes.data_pipeline}>Our data</Link>
            </div>
        </footer>
    )
}

export default Footer;
