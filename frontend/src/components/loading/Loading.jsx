import React, { useState, useEffect } from "react";

import "./Loading.css";

function Loading({ isLoading, percent, size, strokeWidth }) {
    const [progressOffset, setProgressOffset] = useState(0);

    const roundedPercent = Math.round(percent);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const progress = Math.min(Math.max(roundedPercent, 0), 100);
        const offset = ((100 - progress) / 100) * circumference;
        setProgressOffset(offset);
      }, [roundedPercent, circumference]);

      return isLoading && (
        <div className="custom-loading">
            <svg className="circular-progress" width={size} height={size}>
                <circle
                    className="progress-background"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className={`progress-bar ${roundedPercent === 100 ? "completed-progress" : ""}`}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <text className="progress-text" x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
                    {roundedPercent}%
                </text>
            </svg>
        </div>
    )
}

export default Loading;
