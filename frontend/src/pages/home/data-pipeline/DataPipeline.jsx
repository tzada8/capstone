import React from "react";

import "./DataPipeline.css";
import dataPipelineDiagram from "../../../images/home/data-pipeline.png";

import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";

function DataPipeline() {
    return (
        <div className="page-margin">
            <Navbar isComparisonNav={false} />
            <div className="content-data-pipeline">
                <div className="content-data-pipeline-body">
                    <div className="data-pipeline">
                        <h1 className="center-text max-width-heading">Our data <span className="text-highlight">pipeline</span></h1>
                        <br/>
                        <p className="body-1 center-text max-width-body">
                            Products are sourced from major retailers, filtered through your set preferences and scored based on machine learning algorithms to make the final selection as easy as possible.
                        </p>
                        <br/>
                        <img className="data-pipeline-diagram" src={dataPipelineDiagram} alt=""/>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
{/* <DataPipeline /> */}

export default DataPipeline;
