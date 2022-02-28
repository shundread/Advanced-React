import { number } from "prop-types";
import { useState } from "react";

export function useForm(initialState = {}) {
  // Create a state object for our inputs
  const [inputs, setInputs] = useState(initialState);

  function handleChange(event) {
    setInputs({
      ...inputs,
      [event.target.name]: parseEventValue(event),
    });
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.keys(inputs).map((key) => [key, ""])
    );
    setInputs(blankState);
  }

  function resetForm() {
    setInputs(initialState);
  }

  return {
    inputs,
    clearForm,
    handleChange,
    resetForm,
  };
}

function parseEventValue(event) {
  const { type, value } = event.target;
  if (type === "number") return parseInt(value);
  if (type === "file") return event.target.files;
  return event.target.value;
}
