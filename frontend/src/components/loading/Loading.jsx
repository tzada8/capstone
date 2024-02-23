import React from "react";
import { Progress } from "antd";

import "./Loading.css";

function Loading(props) {
    const roundedPercent = Math.round((props.percent * 100)) / 100;

    return props.isLoading && (
        <Progress
            className="custom-loading"
            type="circle"
            strokeColor="#1776EE"
            trailColor="#E7E7E7"
            size={200}
            percent={roundedPercent}
        />
    )
}

export default Loading;
