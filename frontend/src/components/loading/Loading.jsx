import React from "react";
import { Progress } from "antd";

import "./Loading.css";

function Loading(props) {
    return props.isLoading && (
        <Progress
            className="custom-loading"
            type="circle"
            strokeColor="#1776EE"
            trailColor="#E7E7E7"
            size={200}
            percent={Math.round(props.percent)}
        />
    )
}

export default Loading;
