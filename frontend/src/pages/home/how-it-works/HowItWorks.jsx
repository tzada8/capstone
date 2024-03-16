import React from "react";

import "./HowItWorks.css";
import comparisonLayout from "../../../images/home/comparison-layout.png";

import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";

function HowItWorks() {
    return (
        <div className="page-margin">
            <Navbar/>
            <div className="how-it-works">
                <div className="how-it-works-text-container">
                    <h1 className="how-it-works-title max-width-heading"><span className="text-highlight">How</span> it works</h1>
                    <ul className="steps-container">
                        <li><h4 className="how-it-works-h4">1. Search</h4></li>
                        <li className="body-1 steps-indent">Search for product category (ex. DSLR cameras)</li>
                        <li><h4 className="how-it-works-h4">2. Set filters & preferences</h4></li>
                        <li className="body-1 steps-indent">Set filters and rank your feature preferences </li>
                        <li><h4 className="how-it-works-h4">3. View recommendations</h4></li>
                        <li className="body-1 steps-indent">See the products we think you’ll like</li>
                        <li><h4 className="how-it-works-h4">4. Compare</h4></li>
                        <li className="body-1 steps-indent">Compare products with the help of the Rich Comparison View</li>
                    </ul>
                </div>
                <div className="diagram-container">
                    <img className="how-it-works-diagram" src={comparisonLayout} alt=""/>
                </div>
            </div>
            <Footer />
        </div>

    )
}


{/* <HowItWorks /> */}
export default HowItWorks;
