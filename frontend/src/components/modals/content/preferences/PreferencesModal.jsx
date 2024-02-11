import React, { useState } from "react";

import "./PreferencesModal.css";
import Modal from "../../base-modals/Modal";

const initialPreferencesModalData = {
    brand: "",
    numberOfMegapixels: "",
    cameraLensType: "",
    cameraType: "",
    maxBudget: "",
}

function PreferencesModal({ onSubmit, isOpen, onClose }) {
    const [formState, setFormState] = useState(initialPreferencesModalData);

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
        setFormState(initialPreferencesModalData);
    }

    // TODO: Add error handling (e.g. budget >= $0)
    // TODO: Maybe move list of preferences to backend (allows for dynamic set of products/options)
	return (
        <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
            <h2>Preferences</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="brand">Brand</label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formState.brand}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-row">
                    <label htmlFor="numberOfMegapixels">Number of Megapixels (MP)</label>
                    <select
                        id="numberOfMegapixels"
                        name="numberOfMegapixels"
                        value={formState.numberOfMegapixels}
                        onChange={handleInputChange}
                    >
                        <option value=""></option>
                        <option value="<15">{"<15"}</option>
                        <option value="15-30">15-30</option>
                        <option value="30-45">30-45</option>
                        <option value=">45">{">45"}</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="cameraLensType">Camera Lens Type</label>
                    <select
                        id="cameraLensType"
                        name="cameraLensType"
                        value={formState.cameraLensType}
                        onChange={handleInputChange}
                    >
                        <option value=""></option>
                        <option value="fixed">Fixed</option>
                        <option value="wide-angle">Wide-angle</option>
                        <option value="telephoto">Telephoto</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="cameraType">Camera Type</label>
                    <select
                        id="cameraType"
                        name="cameraType"
                        value={formState.cameraType}
                        onChange={handleInputChange}
                    >
                        <option value=""></option>
                        <option value="point-and-shoot">Point-and-Shoot</option>
                        <option value="dslr">DSLR</option>
                        <option value="mirrorless">Mirrorless</option>
                    </select>
                </div>
                <div className="form-row">
                    <label htmlFor="maxBudget">Maximum Budget ($)</label>
                    <input
                        type="number"
                        id="maxBudget"
                        name="maxBudget"
                        value={formState.maxBudget}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="button-container">
                    <button type="submit" className="left-button">Skip</button>
                    <button type="submit" className="right-button">Continue</button>
                </div>
            </form>
        </Modal>
	);
}

export default PreferencesModal;
