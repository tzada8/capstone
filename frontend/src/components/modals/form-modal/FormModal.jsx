import React, { useState } from "react";

import "./FormModal.css";
import Modal from "../base-modal/Modal";

function FormModal(props) {
    const [formState, setFormState] = useState(() => {
        const initialFormState = {};
        Object.keys(props.formQuestions).forEach(key => {
            initialFormState[key] = props.formQuestions[key].initial;
        })
        return initialFormState;
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormState((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.onSubmit(formState);
        setFormState(props.formQuestions);
    }

	return (
        <Modal hasCloseBtn={true} isOpen={props.isOpen} onClose={props.onClose}>
            <h2>{props.formTitle}</h2>
            <p>{props.formDescription}</p>
            <form onSubmit={handleSubmit}>
                {Object.keys(props.formQuestions).map(question => (
                    <div className="form-row">
                        <label htmlFor={question}>{props.formQuestions[question].label}</label>
                        <select
                            id={question}
                            name={question}
                            value={formState[question]}
                            onChange={handleInputChange}
                        >
                            {props.formQuestions[question].options.map(option => (
                                <option value={option.value}>{option.display}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <div className="button-container">
                    <button type="submit" className="left-button">Skip</button>
                    <button type="submit" className="right-button">Continue</button>
                </div>
            </form>
        </Modal>
	);
}

export default FormModal;
