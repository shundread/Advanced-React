import { useEffect, useState } from "react";

export function useForm(initialState = {}) {
  // Create a state object for our inputs
  const [inputs, setInputs] = useState(initialState);

  useEffect(() => setInputs(initialState), [initialState]);

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
  if (event.target.type === "number") return parseInt(event.target.value);
  if (event.target.type === "file") return event.target.files[0]?.name || ""; // event.target.files;
  return event.target.value;
}
