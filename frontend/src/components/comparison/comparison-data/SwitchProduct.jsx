import React, { useState, useEffect, useRef } from "react";

import "./ComparisonData.css";

function SwitchProduct(props) {
    const [isSticky, setIsSticky] = useState(false);
    const [initialTop, setInitialTop] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const rect = dropdownRef.current.getBoundingClientRect();
            initialTop === null ? setInitialTop(window.scrollY + rect.top) : setIsSticky(window.scrollY + 10 > initialTop);
        };

        window.addEventListener("scroll", handleScroll);
        return () => (window.removeEventListener("scroll", handleScroll));
    }, [initialTop]);

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
