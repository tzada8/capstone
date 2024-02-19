import React from "react";

import FormModal from "../../form-modal/FormModal";

function PreferencesModal({ onSubmit, isOpen, onClose }) {
    const preferencesForm = {
        brand: {
            label: "Do you have a brand preference?",
            initial: "",
            options: [
                { value: "", display: "Please select" },
                { value: "canon", display: "Canon" },
                { value: "nikon", display: "Nikon" },
                { value: "other", display: "Other" },
            ]
        },
        megapixels: {
            label: "Do you have a preferred range of megapixels?",
            initial: "",
            options: [
                { value: "", display: "Please select" },
                { value: "<15", display: "<15" },
                { value: "15-30", display: "15-30" },
                { value: "30-45", display: "30-45" },
                { value: ">45", display: ">45" },
            ]
        },
        lens_type: {
            label: "Do you have a preferred lens type?",
            initial: "",
            options: [
                { value: "", display: "Please select" },
                { value: "fixed", display: "Fixed" },
                { value: "standard", display: "Standard" },
                { value: "other", display: "Other" },
            ]
        },
        camera_type: {
            label: "Do you have a preferred camera type?",
            initial: "",
            options: [
                { value: "", display: "Please select" },
                { value: "point-and-shoot", display: "Point and Shoot" },
                { value: "dslr", display: "DSLR" },
                { value: "mirrorless", display: "Mirrorless" },
                { value: "other", display: "Other" },
            ]
        },
        budget: {
            label: "What is your ideal budget range?",
            initial: "",
            options: [
                { value: "", display: "Please select" },
                { value: "<750", display: "<750" },
                { value: "750-1500", display: "750-1500" },
                { value: ">1500", display: ">1500" },
            ]
        },
    }

    // TODO: Add error handling (e.g. budget >= $0).
    // TODO: Maybe move list of preferences to backend (allows for dynamic set of products/options).
	return (
        <FormModal
            formTitle="Refine your search"
            formDescription={null}
            formQuestions={preferencesForm}
            onSubmit={onSubmit}
            isOpen={isOpen}
            onClose={onClose}
        />
	);
}

export default PreferencesModal;
