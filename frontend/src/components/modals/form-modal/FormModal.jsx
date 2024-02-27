import React, { useState } from "react";
import { Button } from "antd";

import "./FormModal.css";
import Modal from "../base-modal/Modal";

function FormModal(props) {
    const defaultFormState = () => {
        const initialFormState = {};
        Object.keys(props.formQuestions).forEach(key => {
            initialFormState[key] = props.formQuestions[key].initial;
        })
        return initialFormState;
    }

    const [formState, setFormState] = useState(defaultFormState());

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
    }

    const handleSkip = (event) => {
        event.preventDefault();
        props.onSubmit(defaultFormState());
        setFormState(defaultFormState());
    }

	return (
        <Modal
            hasCloseBtn={true}
            isOpen={props.isOpen}
            onClose={props.onClose}
            title={props.formTitle}
            description={props.formDescription}
        >
            {props.errorMessage && <div className="modal-form-error">{props.errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                {Object.keys(props.formQuestions).map(question => {
                    return props.formQuestions[question].type === "radio" ? (
                        <div className="form-row-radio">
                            <p className="body-2 radio-label-question">{props.formQuestions[question].label}</p>
                            {props.formQuestions[question].options.map(option => (
                                <div>
                                    <input type="radio" id={option.value} name={question} value={option.value} onChange={handleInputChange}/>
                                    <label htmlFor={option.value} className="body-1-medium radio-label">{option.display}</label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="form-row-select">
                            <label className="body-1-medium select-label-question">{props.formQuestions[question].label}</label>
                            <select
                                className={`body-1 select-label ${formState[question] === "" ? "select-label-default" : "select-label-selected"}`}
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
                    )}
                )}
                <Button htmlType="submit" type="primary" size="large" block className="primary-button form-button-spacing form-button-size">Next</Button>
                <Button onClick={handleSkip} type="primary" size="large" block ghost className="primary-button form-button-size">Skip</Button>
            </form>
        </Modal>
	);
}

export default FormModal;
