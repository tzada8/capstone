import React, { useRef, useState, useEffect } from "react";

import "./FeaturePriorityModal.css";
import Modal from "../../base-modal/Modal";

const initialFeaturePriorityModalData = {
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
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
            <p>Rank the features that are most important to you</p>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="1">1.</label>
                    <select
                        id="1"
                        name="1"
                        value={formState["1"]}
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
                    <label htmlFor="2">2.</label>
                    <select
                        id="2"
                        name="2"
                        value={formState["2"]}
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
                    <label htmlFor="3">3.</label>
                    <select
                        id="3"
                        name="3"
                        value={formState["3"]}
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
                    <label htmlFor="4">4.</label>
                    <select
                        id="4"
                        name="4"
                        value={formState["4"]}
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
                    <label htmlFor="5">5.</label>
                    <select
                        id="5"
                        name="5"
                        value={formState["5"]}
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
