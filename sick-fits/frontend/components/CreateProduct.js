import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useForm } from "../lib/useForm";
import { Form } from "./styles/Form";
import Router from "next/router";

import { ErrorMessage } from "./ErrorMessage";
import { ALL_PRODUCTS_QUERY } from "./Products";
import { PAGINATION_QUERY } from "./Pagination";

export const CREATE_PRODUCT_MUTATION = gql`
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
        photo: { create: { src: $image, altText: $name } }
      }
    ) {
      id
      name
      price
      description
    }
  }
`;

const DefaultProduct = {
  image: "",
  name: "",
  price: 0,
  description: "",
};

export function CreateProduct() {
  const { inputs, clearForm, handleChange, resetForm } =
    useForm(DefaultProduct);

  const [createProduct, { loading, error }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      refetchQueries: [
        { query: ALL_PRODUCTS_QUERY },
        { query: PAGINATION_QUERY },
      ],
    }
  );

  async function handleSubmit(event) {
    event.preventDefault();

    // Submit the input fields to the backend
    const { data, error } = await createProduct();
    if (error) return;
    clearForm();

    // Go to the product page
    Router.push({
      pathname: `/product/[id]`,
      query: { id: data.createProduct.id },
    });
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
