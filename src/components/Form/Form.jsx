import "./Form.css";
import { useForm } from "../../hooks/useForm";
import { useRef, useState } from "react";
import { useGlobal } from "../GlobalState/GlobalState";

{
  /* <Form
  inputs={[
    {
      name: "name",
      type: "text",
      placeholder: "Name",
      labelText: "Name *",
      required: "true",
    },
  ]}
/> */
}

const Form = ({ inputs = [], onSuccessfulSubmit }) => {
  const { modalOpen, setModalOpen } = useGlobal();
  const { values, handleChange, setValues } = useForm({
    name: "",
    location: "",
    notes: "",
    cost: "",
    email: "",
    phone: "",
    message: "",
    reason: "",
  });
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});

  function validate(values, inputs) {
    const errors = {};

    inputs.forEach((input) => {
      const value = values[input.name] || "";

      if (input.required) {
        if (!value.trim()) {
          errors[input.name] =
            `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required`;
        }
      }

      if (input.name === "email") {
        if (!value.trim()) {
          errors.email = "Email is required";
        } else if (value && !/\S+@\S+\.\S+/.test(value)) {
          errors.email = "Email is invalid";
        }
      }
    });
    return errors;
  }

  function handleSubmit(e) {
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

    // ✅ stop if errors
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      return;
    }

    console.log("(from form) Valid:", values);

    setValues({
      name: "",
      location: "",
      notes: "",
      cost: "",
      email: "",
      phone: "",
      message: "",
      reason: "",
    });

    onSuccessfulSubmit(values);
  }

  return (
    <div className="form">
      <form className="form__form" ref={formRef}>
        {inputs.map((input, i) => {
          return (
            <label className="form__label" key={i}>
              {input.labelText}
              <input
                id={input.name}
                name={input.name}
                type={input.type}
                className="form__input"
                placeholder={input.placeholder}
                value={values[input.name]}
                onChange={handleChange}
              />
              {errors[input.name] ? (
                <span className="form__error-message">
                  {errors[input.name]}
                </span>
              ) : (
                <span className="form__error-message" />
              )}
            </label>
          );
        })}

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
