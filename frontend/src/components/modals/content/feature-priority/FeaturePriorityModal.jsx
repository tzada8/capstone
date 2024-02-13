import React, { useRef, useState, useEffect } from "react";

import "./FeaturePriorityModal.css";
import Modal from "../../base-modals/Modal";

const initialFeaturePriorityModalData = {
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
}

// TODO: Maybe generalize to "FormModal".
function FeaturePriorityModal({ onSubmit, isOpen, onClose }) {
    const [formState, setFormState] = useState(initialFeaturePriorityModalData);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formState);
        setFormState(initialFeaturePriorityModalData);
    }

    // TODO: Add error handling (e.g. cannot choose same feature twice).
    // TODO: Maybe have list of features dependant on preferences to backend (allows for dynamic set of products/options).
	return (
        <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
            <h2>Priority of Features</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="first">1.</label>
                    <select
                        id="first"
                        name="first"
                        value={formState.first}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=""></option>
                        <option value="brand">Brand</option>
                        <option value="megapixels">Number of Megapixels</option>
                        <option value="lens_type">Lens Type</option>
                        <option value="camera_type">Camera Type</option>
                        <option value="budget">Budget</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="second">2.</label>
                    <select
                        id="second"
                        name="second"
                        value={formState.second}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=""></option>
                        <option value="brand">Brand</option>
                        <option value="megapixels">Number of Megapixels</option>
                        <option value="lens_type">Lens Type</option>
                        <option value="camera_type">Camera Type</option>
                        <option value="budget">Budget</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="third">3.</label>
                    <select
                        id="third"
                        name="third"
                        value={formState.third}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=""></option>
                        <option value="brand">Brand</option>
                        <option value="megapixels">Number of Megapixels</option>
                        <option value="lens_type">Lens Type</option>
                        <option value="camera_type">Camera Type</option>
                        <option value="budget">Budget</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="fourth">4.</label>
                    <select
                        id="fourth"
                        name="fourth"
                        value={formState.fourth}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=""></option>
                        <option value="brand">Brand</option>
                        <option value="megapixels">Number of Megapixels</option>
                        <option value="lens_type">Lens Type</option>
                        <option value="camera_type">Camera Type</option>
                        <option value="budget">Budget</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="fifth">5.</label>
                    <select
                        id="fifth"
                        name="fifth"
                        value={formState.fifth}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=""></option>
                        <option value="brand">Brand</option>
                        <option value="megapixels">Number of Megapixels</option>
                        <option value="lens_type">Lens Type</option>
                        <option value="camera_type">Camera Type</option>
                        <option value="budget">Budget</option>
                    </select>
                </div>
                <div className="button-container">
                    <button type="submit" className="left-button">Skip</button>
                    <button type="submit" className="right-button">Continue</button>
                </div>
            </form>
        </Modal>
	);
}

export default FeaturePriorityModal;
