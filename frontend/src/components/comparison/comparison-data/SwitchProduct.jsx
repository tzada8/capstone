import React, { useState, useEffect, useRef } from "react";

import "./ComparisonData.css";

function SwitchProduct(props) {
    const [isSticky, setIsSticky] = useState(false);
    const [initialTop, setInitialTop] = useState(null);
    const [hasBeenRecalculated, sethasBeenRecalculated] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (dropdownRef !== null) {
                const rect = dropdownRef.current.getBoundingClientRect();
                const currTopDist = window.scrollY + rect.top;
                if (initialTop === null) {
                    setInitialTop(currTopDist);
                } else if (props.recalculateTop && !hasBeenRecalculated) {
                    setInitialTop(currTopDist);
                    sethasBeenRecalculated(true);
                } else {
                    setIsSticky(window.scrollY + 10 > initialTop);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => (window.removeEventListener("scroll", handleScroll));
    }, [initialTop, props.recalculateTop, hasBeenRecalculated]);

	return (
		<div>
            <div style={{height: isSticky ? dropdownRef.current?.offsetHeight || 0 : 0}}/>
            <div ref={dropdownRef} className={`product-switch-container ${isSticky ? "sticky-dropdown" : "normal-dropdown"}`}>
                <select
                    className="body-1 product-switch-dropdown"
                    id={`switch-product-${props.i}`}
                    name={`switch-product-${props.i}`}
                    value={props.selectedId}
                    onChange={props.handleSwitch}
                >
                    {props.productTitles.map(option => (
                        <option disabled={option.disabled} value={option.product_id} key={option.product_id}>{option.title}</option>
                    ))}
                </select>
            </div>
        </div>
	);
}

export default SwitchProduct;
