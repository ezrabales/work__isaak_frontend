import "./Form.css";
import { useForm } from "../../hooks/useForm";
import React, { useEffect, useRef, useState } from "react";
import { useGlobal } from "../GlobalState/GlobalState";

{
  /* <Form
  inputs={[
    {
      name: "name",
      type: "text",
      placeholder: "Name",
      labelText: "Name *",
      required: true,
    },
  ]}
/> */
}

// extra functionality: add errors to params so the user can create their own based on information outside the form

const Form = ({ inputs = [], onSuccessfulSubmit, initialValues = {} }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  const defaultValues = {
    key: "",
    name: "",
    location: "",
    notes: "",
    cost: "",
    email: "",
    phone: "",
    message: "",
    reason: "",
    file: "",
    description: "",
    invoice: "",
    status: "",
    amountOwed: "",
    amountPaid: "",
    dateStarted: "",
    dateEnded: "",
    paymentTerms: "",
    dateDue: "",
    rate: "",
    companyName: "",
    address: "",
    payableNote: "",
    thankYou: "",
    partNumber: "",
  };
  const { values, handleChange, setValues } = useForm({
    ...defaultValues,
    ...initialValues,
  });

  const formRef = useRef(null);
  const [errors, setErrors] = useState({});

  function validate(values, inputs) {
    const errors = {};

    inputs.forEach((input) => {
      const value = values[input.name] || "";

      if (input.required) {
        if (value === "" || value === null || value === undefined) {
          errors[input.name] =
            `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required`;
        }
      }

      if (input.name === "email") {
        if (value && !/\S+@\S+\.\S+/.test(value)) {
          errors.email = "Email is invalid";
        }
      }
    });
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    const form = formRef.current;
    const newErrors = {};

    // ✅ native validation
    Array.from(form.elements).forEach((input) => {
      if (input.name && !input.validity.valid) {
        newErrors[input.name] = input.validationMessage;
      }
    });

    const customErrors = validate(values, inputs);

    // merge
    const finalErrors = { ...newErrors, ...customErrors };

    // ✅ apply classes
    Array.from(form.elements).forEach((input) => {
      if (!input.name) return;

      if (finalErrors[input.name]) {
        input.classList.add("form__input-error");
      } else {
        input.classList.remove("form__input-error");
      }
    });

    // stop if validation errors
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    const result = await onSuccessfulSubmit(values);

    // only clear if explicitly approved
    if (result?.success) {
      setValues(defaultValues);
      setErrors({});
    } else {
      setErrors((prev) => ({
        ...prev,
        api: result?.message || "Submission failed",
      }));
    }
  }

  return (
    <div className="form">
      <form className="form__form" ref={formRef}>
        {inputs.map((input, i) => {
          if (React.isValidElement(input)) {
            return <div key={i}>{input}</div>;
          }

          if (input.type === "radio") {
            return (
              <div key={i}>
                <div className="form__radio" key={i}>
                  <p>{input.labelText}</p>

                  <div
                    className={`form__radio-group ${
                      errors[input.name] ? "form__input-error" : ""
                    }`}
                  >
                    {input.options.map((option) => (
                      <label
                        key={option.value}
                        className={
                          values[input.name] === option.value
                            ? "form__radio-option form__radio-option--checked"
                            : "form__radio-option"
                        }
                      >
                        <input
                          type="radio"
                          name={input.name}
                          value={option.value}
                          checked={values[input.name] === option.value}
                          onChange={handleChange}
                          required={input.required}
                        />

                        {option.label}
                      </label>
                    ))}
                  </div>

                  {errors[input.name] && (
                    <span className="form__error-message">
                      {errors[input.name]}
                    </span>
                  )}
                </div>
                {values.status === "Partially Paid" && (
                  <label className="form__label" key={i + 1000}>
                    Amount Paid *
                    <input
                      id="amountPaid"
                      name="amountPaid"
                      type="number"
                      className="form__input"
                      placeholder="Amount Paid"
                      required
                      value={values.amountPaid}
                      onChange={handleChange}
                    />
                    {errors["amountPaid"] && (
                      <span className="form__error-message">
                        {errors["amountPaid"]}
                      </span>
                    )}
                  </label>
                )}
                {values.status === "Awaiting Payment" && (
                  <label className="form__label" key={i + 1000}>
                    Amount Owed *
                    <input
                      id="amountOwed"
                      name="amountOwed"
                      type="number"
                      className="form__input"
                      placeholder="Amount Owed"
                      required
                      value={values.amountOwed}
                      onChange={handleChange}
                    />
                    {errors["amountOwed"] && (
                      <span className="form__error-message">
                        {errors["amountOwed"]}
                      </span>
                    )}
                  </label>
                )}
              </div>
            );
          }

          return (
            <label className="form__label" key={i}>
              {input.labelText}

              <input
                id={input.name}
                name={input.name}
                type={input.type}
                className="form__input"
                placeholder={input.placeholder}
                accept={input.accept}
                required={input.required}
                onChange={handleChange}
                {...(input.type !== "file"
                  ? { value: values[input.name] || "" }
                  : {})}
              />

              {errors[input.name] && (
                <span className="form__error-message">
                  {errors[input.name]}
                </span>
              )}
            </label>
          );
        })}
        {errors.api && (
          <span className="form__final-error-message">{errors.api}</span>
        )}
        <button
          type="submit"
          className="form__submit-btn"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
};
export default Form;
