import React from "react";

import "./DataPipeline.css";
import dataPipelineDiagram from "../../../images/home/data-pipeline.png";

import Footer from "../../../components/footer/Footer";
import Navbar from "../../../components/navbar/Navbar";

function DataPipeline() {
    return (
        <div className="page-margin">
            <Navbar/>
            <div className="content-data-pipeline">
                <div className="content-data-pipeline-body">
                    <h1 className="center-text max-width-heading">How we make <span className="text-highlight">recommendations</span></h1>
                    <br/>
                    <p className="body-1 center-text" style={{maxWidth: "80%"}}>
                    We aggregate products from major retailers and score them based on your preferences, popularity and consumer reports to recommend the products we think you'll like best
                    </p>
                    <br/>
                    <img className="data-pipeline-diagram" src={dataPipelineDiagram} alt=""/>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default DataPipeline;
