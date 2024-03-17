import React from "react";
import { LoadingOutlined } from '@ant-design/icons';

import "./Loading.css";

function ConstantLoading({ isLoading }) {
      return isLoading && (
        <div className="custom-constant-loading">
            <LoadingOutlined className="constant-loading-circle"/>
        </div>
    )
}

export default ConstantLoading;
