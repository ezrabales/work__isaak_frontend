import { useState } from "react";

export function useForm(inputValues) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  return { values, handleChange, setValues };
}

// const { values, handleChange, setValues } = useForm({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

// values = {
//     name: "ezra",
//     email: "asdf@gmail.com",
//     phone: "111-111-1111",
//     message: "asdf",
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
