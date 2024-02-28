import React from "react";

import "./DataPipeline.css";
import dataPipelineDiagram from "../../../images/home/data-pipeline.png";

function DataPipeline() {
    return (
        <div className="data-pipeline">
            <h1 className="center-text">Our data <span className="text-highlight">pipeline</span></h1>
            <br/>
            <p className="body-1 center-text">Products are sourced from major retailers, filtered through your set preferences and scored based on machine</p>
            <p className="body-1 center-text">learning algorithms to make the final selection as easy as possible.</p>
            <br/>
            <img className="data-pipeline-diagram" src={dataPipelineDiagram} alt=""/>
        </div>
    )
}

export default DataPipeline;
