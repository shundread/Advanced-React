import { useState } from "react";
import { useForm } from "../lib/useForm";

export function CreateProduct() {
  const { inputs, clearForm, handleChange, resetForm } = useForm({
    name: "Foo",
    price: 50,
    description: "Bar",
  });
  return (
    <form>
      <label htmlFor="name">
        Name
        <input
          id="name"
          name="name"
          placeholder="Name"
          type="text"
          value={inputs.name}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="price">
        Price
        <input
          id="price"
          name="price"
          placeholder="Price"
          type="number"
          value={inputs.price}
          onChange={handleChange}
        />
      </label>

      <button type="button" onClick={clearForm}>
        Clear form
      </button>
      <button type="button" onClick={resetForm}>
        Reset form
      </button>
    </form>
  );
}
