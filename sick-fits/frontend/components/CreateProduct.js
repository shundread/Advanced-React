import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useForm } from "../lib/useForm";
import { Form } from "./styles/Form";

import { ErrorMessage } from "./ErrorMessage";

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: String
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: {
          create: {
            src: $image,
            altText: $name
          }
        }
      }
    ) {
      id
      name
      price
      description
    }
  }
`

export function CreateProduct() {
  const { inputs, clearForm, handleChange, resetForm } = useForm({
    image: "",
    name: "Foo",
    price: 50,
    description: "Bar",
  });

  const [createProduct, { loading, error, data }] = useMutation(CREATE_PRODUCT_MUTATION, {
    variables: inputs
  });

  async function handleSubmit(event) {
    event.preventDefault();
    await createProduct();
    if (error) return;
    clearForm();

  }

  return (
    <Form onSubmit={handleSubmit}>
      <ErrorMessage error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
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
