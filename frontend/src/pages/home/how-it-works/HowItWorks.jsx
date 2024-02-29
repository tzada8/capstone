import React from "react";

import "./HowItWorks.css";
import comparisonLayout from "../../../images/home/comparison-layout.png";

function HowItWorks() {
    return (
        <div id="learn-more-jump" className="how-it-works">
            <div className="how-it-works-text-container">
                <h1 className="how-it-works-title max-width-heading"><span className="text-highlight">How</span> it works</h1>
                <ol className="steps-container">
                    <li className="body-1 how-it-works-step">Search for products that interest you. Products are already filtered, so you'll see only the most relevant products to you.</li>
                    <li className="body-1 how-it-works-step">Provide your product preferences and prioritization of features. These features help recommend products we think you'll like.</li>
                    <li className="body-1 how-it-works-step">View your recommended products and make comparisons. The likeability score is how much we think you'll like the product based on your preferences.</li>
                </ol>
            </div>
            <div className="diagram-container">
                <img className="how-it-works-diagram" src={comparisonLayout} alt=""/>
            </div>
        </div>
    )
}

export default HowItWorks;
