import React, { useState } from "react";
import { InfoCircleOutlined } from '@ant-design/icons';

import "./Tooltip.css";

const Tooltip = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
        className="tooltip-container"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
    >
      <InfoCircleOutlined className="score-info-tooltip" />
      {isVisible && <div className="body-3 tooltip-content">{props.content}</div>}
    </div>
  );
};

export default Tooltip;
