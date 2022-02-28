import { useForm } from "../lib/useForm";
import { Form } from "./styles/Form";

export function CreateProduct() {
  const { inputs, clearForm, handleChange, resetForm } = useForm({
    image: "",
    name: "Foo",
    price: 50,
    description: "Bar",
  });

  function handleSubmit(event) {
    event.preventDefault();
    console.log(inputs);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="image">
          Image
          <input
            required
            id="image"
            name="image"
            type="file"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name
          <input
            required
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
            required
            id="price"
            name="price"
            placeholder="Price"
            type="number"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            required
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <button type="submit">+ Add Product</button>
    </Form>
  );
}
