import { useState } from "react";

export function useForm(inputValues) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
}

// const { values, handleChange, setValues } = useForm({
//     name: "ezra",
//     email: "asdf@gmail.com",
//     phone: "111-111-1111",
//     message: "asdf",
//   });

// values = {
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   }

// handleChange is used on onChange for an input

// set values is used to manually in code change the values
// setValues({
//       name: "",
//       email: "",
//       phone: "",
//       message: "",
//     });

{
  /* <input
  className="invoice__section-input"
  type="text"
  name="name"
  value={values.name}
  onChange={handleChange}
/>; */
}
